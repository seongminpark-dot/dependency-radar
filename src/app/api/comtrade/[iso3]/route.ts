import { NextResponse } from "next/server";
import countries from "world-countries";

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

const API_BASE = "https://comtradeapi.un.org/data/v1/get";

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
  "01", "02", "03", "04", "05", "06", "07", "08",
  "09", "10", "11", "12", "13", "14", "15", "16",
  "17", "18", "19", "20", "21", "22", "23", "24",
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

function makeResponse(body: Record<string, unknown>, cache = true) {
  return NextResponse.json(body, {
    headers: {
      "Cache-Control": cache
        ? "public, s-maxage=21600, stale-while-revalidate=86400"
        : "no-store",
    },
  });
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ iso3: string }> }
) {
  const { iso3 } = await context.params;
  const country = normalizeIso3(iso3);
  const apiKey = process.env.COMTRADE_API_KEY;

  if (!apiKey) {
    return makeResponse(
      {
        configured: false,
        iso3: country,
        source: "UN Comtrade API",
        note: "COMTRADE_API_KEY is not configured.",
        reporterCode: null,
        frequency: null,
        latestPeriod: null,
        metrics: null,
      },
      false
    );
  }

  const reporterCode = getReporterCode(country);

  if (!reporterCode) {
    return makeResponse(
      {
        configured: true,
        iso3: country,
        source: "UN Comtrade API",
        note: "Reporter code was not found for this ISO3 country code.",
        reporterCode: null,
        frequency: null,
        latestPeriod: null,
        metrics: null,
      },
      false
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
    return makeResponse(
      {
        configured: true,
        iso3: country,
        source: "UN Comtrade API",
        note: "UN Comtrade API quota exceeded. Try again after the API quota resets.",
        reporterCode,
        frequency: null,
        latestPeriod: null,
        quotaExceeded: true,
        metrics: null,
        debug: {
          importsStatus: imports.status,
          exportsStatus: exports.status,
          fuelStatus: fuel.status,
          foodStatus: food.status,
        },
      },
      false
    );
  }

  const importSeries = aggregateByPeriod(imports.rows);
  const exportSeries = aggregateByPeriod(exports.rows);
  const fuelSeries = aggregateByPeriod(fuel.rows);
  const foodSeries = aggregateByPeriod(food.rows);

  const latestImport = getLatestPoint(importSeries);
  const latestExport = getLatestPoint(exportSeries);

  if (!latestImport && !latestExport) {
    return makeResponse(
      {
        configured: true,
        iso3: country,
        source: "UN Comtrade API",
        note: "No annual import/export data was returned for this reporter.",
        reporterCode,
        frequency: null,
        latestPeriod: null,
        quotaExceeded: false,
        metrics: null,
        debug: {
          importRows: imports.rows.length,
          exportRows: exports.rows.length,
          fuelRows: fuel.rows.length,
          foodRows: food.rows.length,
          importsStatus: imports.status,
          exportsStatus: exports.status,
          fuelStatus: fuel.status,
          foodStatus: food.status,
        },
      },
      false
    );
  }

  const latestPeriod = latestImport?.period ?? latestExport?.period ?? null;
  const previousPeriod = getPreviousComparablePeriod(latestPeriod);

  const importAtPeriod = getPointByPeriod(importSeries, latestPeriod) ?? latestImport;
  const exportAtPeriod = getPointByPeriod(exportSeries, latestPeriod) ?? latestExport;

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

  return makeResponse({
    configured: true,
    iso3: country,
    reporterCode,
    source: "UN Comtrade API",
    note: "Latest official annual merchandise trade data.",
    frequency: "A",
    latestPeriod,
    previousPeriod,
    quotaExceeded: false,
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
          latestFuel && importAtPeriod && latestFuel.period === importAtPeriod.period
            ? (latestFuel.value / importAtPeriod.value) * 100
            : null,
        previousYearValue: previousFuel?.value ?? null,
        yoyChange: getYoY(latestFuel, previousFuel),
      },
      foodImports: {
        value: latestFood?.value ?? null,
        period: latestFood?.period ?? null,
        shareOfTotal:
          latestFood && importAtPeriod && latestFood.period === importAtPeriod.period
            ? (latestFood.value / importAtPeriod.value) * 100
            : null,
        previousYearValue: previousFood?.value ?? null,
        yoyChange: getYoY(latestFood, previousFood),
      },
    },
  });
}
