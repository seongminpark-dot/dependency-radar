import { NextResponse } from "next/server";
import countries from "world-countries";

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
  if (reporterOverrides[iso3]) {
    return reporterOverrides[iso3];
  }

  const match = (countries as CountryRecord[]).find(
    (country) => country.cca3?.toUpperCase() === iso3
  );

  if (!match?.ccn3) return null;

  const numeric = String(Number(match.ccn3));

  return numeric === "0" ? null : numeric;
}

function buildMonthlyPeriods(monthCount = 36) {
  const periods: string[] = [];
  const date = new Date();

  date.setDate(1);
  date.setMonth(date.getMonth() - 1);

  for (let index = 0; index < monthCount; index += 1) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");

    periods.push(`${year}${month}`);
    date.setMonth(date.getMonth() - 1);
  }

  return periods;
}

function buildAnnualPeriods(yearCount = 8) {
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
    toNumber(row.fobValue) ??
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

  return String(raw);
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
    .map(([period, value]) => ({
      period,
      value,
    }))
    .sort((a, b) => a.period.localeCompare(b.period));
}

function getLatestPoint(points: SeriesPoint[]) {
  return [...points]
    .filter((point) => point.value !== 0)
    .sort((a, b) => b.period.localeCompare(a.period))[0];
}

function getPreviousComparablePeriod(period: string | null) {
  if (!period) return null;

  if (/^\d{6}$/.test(period)) {
    const year = Number(period.slice(0, 4));
    const month = period.slice(4, 6);

    return `${year - 1}${month}`;
  }

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
  frequency,
  flowCode,
  apiKey,
}: {
  reporterCode: string;
  cmdCode: string;
  periods: string[];
  frequency: "M" | "A";
  flowCode: "M" | "X";
  apiKey: string;
}) {
  const rows: ComtradeRow[] = [];
  const partnerOptions = ["0", ""];

  for (const partnerCode of partnerOptions) {
    const params = new URLSearchParams({
      reporterCode,
      flowCode,
      cmdCode,
      period: periods.join(","),
      maxRecords: "50000",
      includeDesc: "true",
      format: "json",
      breakdownMode: "classic",
      "subscription-key": apiKey,
    });

    if (partnerCode) {
      params.set("partnerCode", partnerCode);
    }

    const url = `${API_BASE}/C/${frequency}/HS?${params.toString()}`;

    try {
      const response = await fetch(url, {
        headers: {
          "Ocp-Apim-Subscription-Key": apiKey,
        },
        next: {
          revalidate: 21600,
        },
      });

      if (!response.ok) {
        continue;
      }

      const json = await response.json();
      const data = Array.isArray(json.data) ? json.data : [];

      rows.push(...data);

      if (data.length > 0) {
        break;
      }
    } catch {
      continue;
    }
  }

  return rows;
}

async function fetchGroupedRows({
  reporterCode,
  cmdCodes,
  periods,
  frequency,
  flowCode,
  apiKey,
}: {
  reporterCode: string;
  cmdCodes: string[];
  periods: string[];
  frequency: "M" | "A";
  flowCode: "M" | "X";
  apiKey: string;
}) {
  const combined = await fetchRows({
    reporterCode,
    cmdCode: cmdCodes.join(","),
    periods,
    frequency,
    flowCode,
    apiKey,
  });

  if (combined.length > 0) {
    return combined;
  }

  const rows: ComtradeRow[] = [];

  for (const code of cmdCodes) {
    const each = await fetchRows({
      reporterCode,
      cmdCode: code,
      periods,
      frequency,
      flowCode,
      apiKey,
    });

    rows.push(...each);
  }

  return rows;
}

async function getTradeLayer({
  reporterCode,
  frequency,
  periods,
  apiKey,
}: {
  reporterCode: string;
  frequency: "M" | "A";
  periods: string[];
  apiKey: string;
}) {
  const [importRows, exportRows, fuelRows, foodRows] = await Promise.all([
    fetchRows({
      reporterCode,
      cmdCode: "TOTAL",
      periods,
      frequency,
      flowCode: "M",
      apiKey,
    }),
    fetchRows({
      reporterCode,
      cmdCode: "TOTAL",
      periods,
      frequency,
      flowCode: "X",
      apiKey,
    }),
    fetchRows({
      reporterCode,
      cmdCode: "27",
      periods,
      frequency,
      flowCode: "M",
      apiKey,
    }),
    fetchGroupedRows({
      reporterCode,
      cmdCodes: foodCodes,
      periods,
      frequency,
      flowCode: "M",
      apiKey,
    }),
  ]);

  const importSeries = aggregateByPeriod(importRows);
  const exportSeries = aggregateByPeriod(exportRows);
  const fuelSeries = aggregateByPeriod(fuelRows);
  const foodSeries = aggregateByPeriod(foodRows);

  const latestImport = getLatestPoint(importSeries);
  const latestExport = getLatestPoint(exportSeries);

  if (!latestImport && !latestExport) {
    return null;
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
    exportAtPeriod && importAtPeriod ? exportAtPeriod.value - importAtPeriod.value : null;

  const previousTradeBalanceValue =
    previousExport && previousImport
      ? previousExport.value - previousImport.value
      : null;

  const tradeBalancePoint =
    tradeBalanceValue !== null && latestPeriod
      ? {
          period: latestPeriod,
          value: tradeBalanceValue,
        }
      : undefined;

  const previousTradeBalancePoint =
    previousTradeBalanceValue !== null && previousPeriod
      ? {
          period: previousPeriod,
          value: previousTradeBalanceValue,
        }
      : null;

  return {
    frequency,
    latestPeriod,
    previousPeriod,
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
  };
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ iso3: string }> }
) {
  const { iso3 } = await context.params;
  const country = normalizeIso3(iso3);
  const apiKey = process.env.COMTRADE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      configured: false,
      iso3: country,
      source: "UN Comtrade API",
      note: "COMTRADE_API_KEY is not configured.",
      reporterCode: null,
      frequency: null,
      latestPeriod: null,
      metrics: null,
    });
  }

  const reporterCode = getReporterCode(country);

  if (!reporterCode) {
    return NextResponse.json({
      configured: true,
      iso3: country,
      source: "UN Comtrade API",
      note: "Reporter code was not found for this ISO3 country code.",
      reporterCode: null,
      frequency: null,
      latestPeriod: null,
      metrics: null,
    });
  }

  const monthlyLayer = await getTradeLayer({
    reporterCode,
    frequency: "M",
    periods: buildMonthlyPeriods(36),
    apiKey,
  });

  const layer =
    monthlyLayer ??
    (await getTradeLayer({
      reporterCode,
      frequency: "A",
      periods: buildAnnualPeriods(8),
      apiKey,
    }));

  if (!layer) {
    return NextResponse.json({
      configured: true,
      iso3: country,
      source: "UN Comtrade API",
      note: "No monthly or annual import/export data was returned for this reporter.",
      reporterCode,
      frequency: null,
      latestPeriod: null,
      metrics: null,
    });
  }

  return NextResponse.json({
    configured: true,
    iso3: country,
    reporterCode,
    source: "UN Comtrade API",
    note:
      layer.frequency === "M"
        ? "Latest official monthly merchandise trade data."
        : "Monthly data was unavailable, so latest official annual merchandise trade data is shown.",
    frequency: layer.frequency,
    latestPeriod: layer.latestPeriod,
    previousPeriod: layer.previousPeriod,
    metrics: layer.metrics,
  });
}
