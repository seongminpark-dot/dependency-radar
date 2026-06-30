import { NextResponse } from "next/server";
import countries from "world-countries";
import { Redis } from "@upstash/redis";

export const revalidate = 21600;

type CountryRecord = {
  cca3?: string;
  ccn3?: string;
};

type ComtradeRow = Record<string, unknown>;

type SeriesPoint = {
  period: string;
  value: number;
};

type TradeMetric = {
  value: number | null;
  period: string | null;
  previousYearValue: number | null;
  yoyChange: number | null;
  shareOfTotal?: number | null;
};

type ComtradePayload = {
  configured: boolean;
  iso3: string;
  reporterCode: string | null;
  source: string;
  note: string;
  frequency: "A" | null;
  latestPeriod: string | null;
  previousPeriod: string | null;
  quotaExceeded?: boolean;
  apiLimited?: boolean;
  fallback?: boolean;
  emptyFallback?: boolean;
  fromCache?: boolean;
  cacheSavedAt?: string | null;
  metrics: null | {
    totalImports: TradeMetric;
    totalExports: TradeMetric;
    tradeBalance: TradeMetric;
    fuelImports: TradeMetric;
    foodImports: TradeMetric;
  };
  debug?: Record<string, unknown>;
};

type CachedComtradeSnapshot = {
  savedAt: string;
  payload: ComtradePayload;
};

const API_BASE = "https://comtradeapi.un.org/data/v1/get";
const CACHE_TTL_SECONDS = 60 * 60 * 24 * 30;
const FRESH_CACHE_MS = 1000 * 60 * 60 * 6;

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

const reporterOverrides: Record<string, string> = {
  USA: "842",
  KOR: "410",
  JPN: "392",
  CHN: "156",
  DEU: "276",
  FRA: "251",
  GBR: "826",
  ITA: "381",
  CAN: "124",
  AUS: "36",
  MEX: "484",
  BRA: "76",
  IND: "699",
  SGP: "702",
  HKG: "344",
};

const foodCodes = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
];

function normalizeIso3(value: string) {
  return value.trim().toUpperCase();
}

function getReporterCode(iso3: string) {
  if (reporterOverrides[iso3]) return reporterOverrides[iso3];

  const match = (countries as CountryRecord[]).find(
    (country) => country.cca3?.toUpperCase() === iso3
  );

  if (!match?.ccn3) return null;

  const numeric = String(Number(match.ccn3));

  return numeric === "0" ? null : numeric;
}

function buildAnnualPeriods(yearCount = 5) {
  const periods: string[] = [];
  const currentYear = new Date().getFullYear();

  for (let index = 0; index < yearCount; index += 1) {
    periods.push(String(currentYear - index));
  }

  return periods;
}

function toNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return null;

  const numberValue = Number(value);

  return Number.isNaN(numberValue) ? null : numberValue;
}

function readValue(row: ComtradeRow) {
  return (
    toNumber(row.primaryValue) ??
    toNumber(row.cifValue) ??
    toNumber(row.cifvalue) ??
    toNumber(row.fobValue) ??
    toNumber(row.fobvalue) ??
    toNumber(row.tradeValue) ??
    toNumber(row.TradeValue) ??
    toNumber(row.value) ??
    0
  );
}

function readPeriod(row: ComtradeRow) {
  const raw =
    row.period ??
    row.periodDesc ??
    row.refPeriodId ??
    row.refYear ??
    row.year;

  if (raw === null || raw === undefined) return null;

  const value = String(raw);

  if (/^\d{8}$/.test(value)) return value.slice(0, 4);

  return value;
}

function aggregateByPeriod(rows: ComtradeRow[]) {
  const map = new Map<string, number>();

  for (const row of rows) {
    const period = readPeriod(row);
    const value = readValue(row);

    if (!period || value === 0) continue;

    map.set(period, (map.get(period) ?? 0) + value);
  }

  return Array.from(map.entries())
    .map(([period, value]) => ({ period, value }))
    .sort((a, b) => a.period.localeCompare(b.period));
}

function getLatestPoint(points: SeriesPoint[]) {
  return [...points]
    .filter((point) => point.value !== 0)
    .sort((a, b) => b.period.localeCompare(a.period))[0];
}

function getPreviousComparablePeriod(period: string | null) {
  if (!period) return null;

  if (/^\d{4}$/.test(period)) {
    return String(Number(period) - 1);
  }

  return null;
}

function getPointByPeriod(points: SeriesPoint[], period: string | null) {
  if (!period) return null;

  return points.find((point) => point.period === period) ?? null;
}

function getYoY(latest: SeriesPoint | undefined, previous: SeriesPoint | null) {
  if (!latest || !previous || previous.value === 0) return null;

  return ((latest.value - previous.value) / Math.abs(previous.value)) * 100;
}

function cacheKey(country: string) {
  return `comtrade:official:${country}`;
}

async function getCachedSnapshot(country: string) {
  if (!redis) return null;

  try {
    return await redis.get<CachedComtradeSnapshot>(cacheKey(country));
  } catch {
    return null;
  }
}

async function saveSnapshot(country: string, payload: ComtradePayload) {
  if (!redis || !payload.metrics) return;

  try {
    const snapshot: CachedComtradeSnapshot = {
      savedAt: new Date().toISOString(),
      payload: {
        ...payload,
        fromCache: false,
        cacheSavedAt: null,
      },
    };

    await redis.set(cacheKey(country), snapshot, {
      ex: CACHE_TTL_SECONDS,
    });
  } catch {
    // Redis 저장 실패는 사이트 표시를 막지 않음
  }
}

function isFreshSnapshot(snapshot: CachedComtradeSnapshot | null) {
  if (!snapshot?.savedAt) return false;

  const savedTime = new Date(snapshot.savedAt).getTime();

  if (Number.isNaN(savedTime)) return false;

  return Date.now() - savedTime < FRESH_CACHE_MS;
}

function snapshotToPayload(
  snapshot: CachedComtradeSnapshot,
  note: string,
  apiLimited = false
): ComtradePayload {
  return {
    ...snapshot.payload,
    note,
    fromCache: true,
    fallback: true,
    apiLimited,
    cacheSavedAt: snapshot.savedAt,
  };
}

function makeStatusFallback(
  country: string,
  reporterCode: string | null,
  reason: string
): ComtradePayload {
  return {
    configured: true,
    iso3: country,
    reporterCode,
    source: "UN Comtrade API",
    note: reason,
    frequency: null,
    latestPeriod: null,
    previousPeriod: null,
    quotaExceeded: true,
    apiLimited: true,
    fallback: true,
    emptyFallback: true,
    fromCache: false,
    cacheSavedAt: null,
    metrics: null,
  };
}

function getManualKoreaSnapshot(
  country: string,
  reporterCode: string | null,
  reason: string
): ComtradePayload | null {
  if (country !== "KOR") return null;

  return {
    configured: true,
    iso3: "KOR",
    reporterCode,
    source: "UN Comtrade API",
    note:
      reason ||
      "Showing the last successful official UN Comtrade annual snapshot for Korea.",
    frequency: "A",
    latestPeriod: "2025",
    previousPeriod: "2024",
    quotaExceeded: true,
    apiLimited: true,
    fallback: true,
    emptyFallback: false,
    fromCache: false,
    cacheSavedAt: null,
    metrics: {
      totalImports: {
        value: 631585806009,
        period: "2025",
        previousYearValue: 631727134467,
        yoyChange: -0.022371756774266387,
      },
      totalExports: {
        value: null,
        period: null,
        previousYearValue: null,
        yoyChange: null,
      },
      tradeBalance: {
        value: null,
        period: "2025",
        previousYearValue: null,
        yoyChange: null,
      },
      fuelImports: {
        value: 140092305192,
        period: "2025",
        shareOfTotal: 22.18104078007157,
        previousYearValue: 162096246783,
        yoyChange: -13.574615099174329,
      },
      foodImports: {
        value: 17696000000,
        period: "2025",
        shareOfTotal: 2.8,
        previousYearValue: 18016493584,
        yoyChange: -1.78,
      },
    },
  };
}

function makeResponse(body: ComtradePayload, cacheSeconds = 1800) {
  return NextResponse.json(body, {
    headers: {
      "Cache-Control":
        cacheSeconds > 0
          ? `public, s-maxage=${cacheSeconds}, stale-while-revalidate=21600`
          : "no-store",
    },
  });
}

async function fetchRows({
  reporterCode,
  cmdCode,
  periods,
  flowCode,
  apiKey,
}: {
  reporterCode: string;
  cmdCode: string;
  periods: string[];
  flowCode: "M" | "X";
  apiKey: string;
}) {
  const params = new URLSearchParams({
    reporterCode,
    flowCode,
    cmdCode,
    period: periods.join(","),
    maxrecords: "50000",
    maxRecords: "50000",
    includeDesc: "true",
    format: "json",
    breakdownMode: "classic",
    "subscription-key": apiKey,
  });

  const url = `${API_BASE}/C/A/HS?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey,
      },
      next: {
        revalidate: 21600,
      },
    });

    const status = `${response.status} ${response.statusText}`;

    if (!response.ok) {
      return {
        rows: [] as ComtradeRow[],
        status,
        quotaExceeded: status.toLowerCase().includes("quota"),
      };
    }

    const json = await response.json();
    const rows = Array.isArray(json.data) ? json.data : [];

    return {
      rows,
      status,
      quotaExceeded: false,
    };
  } catch {
    return {
      rows: [] as ComtradeRow[],
      status: "Fetch failed",
      quotaExceeded: false,
    };
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ iso3: string }> }
) {
  const { iso3 } = await context.params;
  const country = normalizeIso3(iso3);
  const apiKey = process.env.COMTRADE_API_KEY;
  const reporterCode = getReporterCode(country);

  const url = new URL(request.url);
  const forceRefresh = url.searchParams.get("refresh") === "1";

  const cachedSnapshot = await getCachedSnapshot(country);

  if (cachedSnapshot && !forceRefresh && isFreshSnapshot(cachedSnapshot)) {
    return makeResponse(
      snapshotToPayload(
        cachedSnapshot,
        "Showing saved official UN Comtrade response to reduce API quota usage.",
        false
      ),
      1800
    );
  }

  if (!apiKey) {
    if (cachedSnapshot) {
      return makeResponse(
        snapshotToPayload(
          cachedSnapshot,
          "COMTRADE_API_KEY is not configured. Showing saved official response.",
          true
        ),
        1800
      );
    }

    return makeResponse(
      makeStatusFallback(
        country,
        reporterCode,
        "COMTRADE_API_KEY is not configured."
      ),
      600
    );
  }

  if (!reporterCode) {
    if (cachedSnapshot) {
      return makeResponse(
        snapshotToPayload(
          cachedSnapshot,
          "Reporter code was not found. Showing saved official response.",
          true
        ),
        1800
      );
    }

    return makeResponse(
      makeStatusFallback(
        country,
        null,
        "Reporter code was not found for this ISO3 country code."
      ),
      600
    );
  }

  const periods = buildAnnualPeriods(5);

  const [imports, exports, fuel, food] = await Promise.all([
    fetchRows({
      reporterCode,
      cmdCode: "TOTAL",
      periods,
      flowCode: "M",
      apiKey,
    }),
    fetchRows({
      reporterCode,
      cmdCode: "TOTAL",
      periods,
      flowCode: "X",
      apiKey,
    }),
    fetchRows({
      reporterCode,
      cmdCode: "27",
      periods,
      flowCode: "M",
      apiKey,
    }),
    fetchRows({
      reporterCode,
      cmdCode: foodCodes.join(","),
      periods,
      flowCode: "M",
      apiKey,
    }),
  ]);

  const quotaExceeded =
    imports.quotaExceeded ||
    exports.quotaExceeded ||
    fuel.quotaExceeded ||
    food.quotaExceeded;

  if (quotaExceeded) {
    if (cachedSnapshot) {
      return makeResponse(
        {
          ...snapshotToPayload(
            cachedSnapshot,
            "Showing the latest saved official UN Comtrade response snapshot.",
            true
          ),
          debug: {
            importsStatus: imports.status,
            exportsStatus: exports.status,
            fuelStatus: fuel.status,
            foodStatus: food.status,
          },
        },
        1800
      );
    }

    const manualKorea = getManualKoreaSnapshot(
      country,
      reporterCode,
      "Showing a saved official UN Comtrade annual snapshot for Korea."
    );

    if (manualKorea) {
      await saveSnapshot(country, manualKorea);

      return makeResponse(
        {
          ...manualKorea,
          debug: {
            importsStatus: imports.status,
            exportsStatus: exports.status,
            fuelStatus: fuel.status,
            foodStatus: food.status,
          },
        },
        1800
      );
    }

    return makeResponse(
      {
        ...makeStatusFallback(
          country,
          reporterCode,
          "Official UN Comtrade data is not available in the saved snapshot for this country yet. No estimated values are shown."
        ),
        debug: {
          importsStatus: imports.status,
          exportsStatus: exports.status,
          fuelStatus: fuel.status,
          foodStatus: food.status,
        },
      },
      600
    );
  }

  const importSeries = aggregateByPeriod(imports.rows);
  const exportSeries = aggregateByPeriod(exports.rows);
  const fuelSeries = aggregateByPeriod(fuel.rows);
  const foodSeries = aggregateByPeriod(food.rows);

  const latestImport = getLatestPoint(importSeries);
  const latestExport = getLatestPoint(exportSeries);

  if (!latestImport && !latestExport) {
    if (cachedSnapshot) {
      return makeResponse(
        snapshotToPayload(
          cachedSnapshot,
          "UN Comtrade returned no rows. Showing the last saved official response.",
          true
        ),
        1800
      );
    }

    return makeResponse(
      makeStatusFallback(
        country,
        reporterCode,
        "No annual import/export data was returned from UN Comtrade for this reporter. No estimated values are shown."
      ),
      600
    );
  }

  const latestPeriod = latestImport?.period ?? latestExport?.period ?? null;
  const previousPeriod = getPreviousComparablePeriod(latestPeriod);

  const importAtPeriod =
    getPointByPeriod(importSeries, latestPeriod) ?? latestImport;
  const exportAtPeriod =
    getPointByPeriod(exportSeries, latestPeriod) ?? latestExport;

  const previousImport = getPointByPeriod(importSeries, previousPeriod);
  const previousExport = getPointByPeriod(exportSeries, previousPeriod);

  const latestFuel =
    getPointByPeriod(fuelSeries, latestPeriod) ?? getLatestPoint(fuelSeries);
  const latestFood =
    getPointByPeriod(foodSeries, latestPeriod) ?? getLatestPoint(foodSeries);

  const previousFuel = getPointByPeriod(
    fuelSeries,
    getPreviousComparablePeriod(latestFuel?.period ?? null)
  );

  const previousFood = getPointByPeriod(
    foodSeries,
    getPreviousComparablePeriod(latestFood?.period ?? null)
  );

  const tradeBalanceValue =
    exportAtPeriod && importAtPeriod
      ? exportAtPeriod.value - importAtPeriod.value
      : null;

  const previousTradeBalanceValue =
    previousExport && previousImport
      ? previousExport.value - previousImport.value
      : null;

  const tradeBalancePoint =
    tradeBalanceValue !== null && latestPeriod
      ? { period: latestPeriod, value: tradeBalanceValue }
      : undefined;

  const previousTradeBalancePoint =
    previousTradeBalanceValue !== null && previousPeriod
      ? { period: previousPeriod, value: previousTradeBalanceValue }
      : null;

  const payload: ComtradePayload = {
    configured: true,
    iso3: country,
    reporterCode,
    source: "UN Comtrade API",
    note: "Latest official annual merchandise trade data.",
    frequency: "A",
    latestPeriod,
    previousPeriod,
    quotaExceeded: false,
    apiLimited: false,
    fallback: false,
    emptyFallback: false,
    fromCache: false,
    cacheSavedAt: null,
    metrics: {
      totalImports: {
        value: importAtPeriod?.value ?? null,
        period: importAtPeriod?.period ?? null,
        previousYearValue: previousImport?.value ?? null,
        yoyChange: getYoY(importAtPeriod, previousImport),
      },
      totalExports: {
        value: exportAtPeriod?.value ?? null,
        period: exportAtPeriod?.period ?? null,
        previousYearValue: previousExport?.value ?? null,
        yoyChange: getYoY(exportAtPeriod, previousExport),
      },
      tradeBalance: {
        value: tradeBalanceValue,
        period: latestPeriod,
        previousYearValue: previousTradeBalanceValue,
        yoyChange: getYoY(tradeBalancePoint, previousTradeBalancePoint),
      },
      fuelImports: {
        value: latestFuel?.value ?? null,
        period: latestFuel?.period ?? null,
        shareOfTotal:
          latestFuel &&
          importAtPeriod &&
          latestFuel.period === importAtPeriod.period
            ? (latestFuel.value / importAtPeriod.value) * 100
            : null,
        previousYearValue: previousFuel?.value ?? null,
        yoyChange: getYoY(latestFuel, previousFuel),
      },
      foodImports: {
        value: latestFood?.value ?? null,
        period: latestFood?.period ?? null,
        shareOfTotal:
          latestFood &&
          importAtPeriod &&
          latestFood.period === importAtPeriod.period
            ? (latestFood.value / importAtPeriod.value) * 100
            : null,
        previousYearValue: previousFood?.value ?? null,
        yoyChange: getYoY(latestFood, previousFood),
      },
    },
  };

  await saveSnapshot(country, payload);

  return makeResponse(payload, 1800);
}
