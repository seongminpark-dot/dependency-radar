import { NextResponse } from "next/server";

type ReporterRecord = {
  id?: number | string;
  reporterCode?: number | string;
  text?: string;
  reporterDesc?: string;
  country?: string;
  iso3?: string;
  iso_3?: string;
  reporterISO?: string;
  ISO3?: string;
};

type ComtradeRow = Record<string, unknown>;

type SeriesPoint = {
  period: string;
  value: number;
};

const COMTRADE_BASE_URL = "https://comtradeapi.un.org/data/v1/get/C/M/HS";
const REPORTERS_URL = "https://comtradeapi.un.org/files/v1/app/reference/Reporters.json";

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

function buildRecentMonthlyPeriods(monthCount = 30) {
  const periods: string[] = [];
  const current = new Date();

  current.setDate(1);
  current.setMonth(current.getMonth() - 1);

  for (let index = 0; index < monthCount; index += 1) {
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, "0");

    periods.push(`${year}${month}`);
    current.setMonth(current.getMonth() - 1);
  }

  return periods;
}

function getNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return null;

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) return null;

  return numberValue;
}

function readTradeValue(row: ComtradeRow) {
  return (
    getNumber(row.primaryValue) ??
    getNumber(row.cifValue) ??
    getNumber(row.fobValue) ??
    getNumber(row.tradeValue) ??
    getNumber(row.TradeValue) ??
    getNumber(row.value) ??
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
    const value = readTradeValue(row);

    if (!period || value <= 0) continue;

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
    .filter((point) => point.value > 0)
    .sort((a, b) => b.period.localeCompare(a.period))[0];
}

function getPreviousYearPeriod(period: string) {
  if (!/^\d{6}$/.test(period)) return null;

  const year = Number(period.slice(0, 4));
  const month = period.slice(4, 6);

  return `${year - 1}${month}`;
}

function getPointByPeriod(points: SeriesPoint[], period: string | null) {
  if (!period) return null;

  return points.find((point) => point.period === period) ?? null;
}

function getYoYChange(latest: SeriesPoint | undefined, previous: SeriesPoint | null) {
  if (!latest || !previous || previous.value === 0) return null;

  return ((latest.value - previous.value) / previous.value) * 100;
}

async function getReporterCode(iso3: string) {
  const response = await fetch(REPORTERS_URL, {
    next: {
      revalidate: 86400,
    },
  });

  if (!response.ok) return null;

  const json = await response.json();

  const records: ReporterRecord[] = Array.isArray(json)
    ? json
    : Array.isArray(json.results)
      ? json.results
      : Array.isArray(json.data)
        ? json.data
        : [];

  const match = records.find((record) => {
    const possibleIso3 = String(
      record.iso3 ??
        record.iso_3 ??
        record.reporterISO ??
        record.ISO3 ??
        ""
    ).toUpperCase();

    return possibleIso3 === iso3;
  });

  const code = match?.id ?? match?.reporterCode;

  if (code === undefined || code === null) return null;

  return String(code);
}

async function fetchComtradeRows({
  reporterCode,
  cmdCode,
  periods,
  apiKey,
}: {
  reporterCode: string;
  cmdCode: string;
  periods: string[];
  apiKey: string;
}) {
  const params = new URLSearchParams({
    reporterCode,
    partnerCode: "0",
    flowCode: "M",
    cmdCode,
    period: periods.join(","),
    maxrecords: "5000",
    includeDesc: "true",
    "subscription-key": apiKey,
  });

  const response = await fetch(`${COMTRADE_BASE_URL}?${params.toString()}`, {
    headers: {
      "Ocp-Apim-Subscription-Key": apiKey,
    },
    next: {
      revalidate: 21600,
    },
  });

  if (!response.ok) {
    return [];
  }

  const json = await response.json();

  return Array.isArray(json.data) ? json.data : [];
}

async function fetchFoodRows({
  reporterCode,
  periods,
  apiKey,
}: {
  reporterCode: string;
  periods: string[];
  apiKey: string;
}) {
  const combinedRows = await fetchComtradeRows({
    reporterCode,
    cmdCode: foodCodes.join(","),
    periods,
    apiKey,
  });

  if (combinedRows.length > 0) {
    return combinedRows;
  }

  const firstSixPeriods = periods.slice(0, 18);
  const rows: ComtradeRow[] = [];

  for (const code of foodCodes) {
    const chapterRows = await fetchComtradeRows({
      reporterCode,
      cmdCode: code,
      periods: firstSixPeriods,
      apiKey,
    });

    rows.push(...chapterRows);
  }

  return rows;
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
      latestPeriod: null,
      metrics: null,
    });
  }

  const reporterCode = await getReporterCode(country);

  if (!reporterCode) {
    return NextResponse.json({
      configured: true,
      iso3: country,
      source: "UN Comtrade API",
      note: "Reporter code was not found for this ISO3 country code.",
      latestPeriod: null,
      metrics: null,
    });
  }

  const periods = buildRecentMonthlyPeriods(30);

  const [totalRows, fuelRows, foodRows] = await Promise.all([
    fetchComtradeRows({
      reporterCode,
      cmdCode: "TOTAL",
      periods,
      apiKey,
    }),
    fetchComtradeRows({
      reporterCode,
      cmdCode: "27",
      periods,
      apiKey,
    }),
    fetchFoodRows({
      reporterCode,
      periods,
      apiKey,
    }),
  ]);

  const totalSeries = aggregateByPeriod(totalRows);
  const fuelSeries = aggregateByPeriod(fuelRows);
  const foodSeries = aggregateByPeriod(foodRows);

  const latestTotal = getLatestPoint(totalSeries);
  const latestPeriod = latestTotal?.period ?? null;
  const previousYearPeriod = getPreviousYearPeriod(latestPeriod ?? "");

  const latestFuel = latestPeriod
    ? getPointByPeriod(fuelSeries, latestPeriod)
    : getLatestPoint(fuelSeries);

  const latestFood = latestPeriod
    ? getPointByPeriod(foodSeries, latestPeriod)
    : getLatestPoint(foodSeries);

  const previousTotal = getPointByPeriod(totalSeries, previousYearPeriod);
  const previousFuel = getPointByPeriod(fuelSeries, previousYearPeriod);
  const previousFood = getPointByPeriod(foodSeries, previousYearPeriod);

  const totalValue = latestTotal?.value ?? null;
  const fuelValue = latestFuel?.value ?? null;
  const foodValue = latestFood?.value ?? null;

  return NextResponse.json({
    configured: true,
    iso3: country,
    reporterCode,
    source: "UN Comtrade API",
    note: "Monthly merchandise import data. Country reporting schedules differ, so latest months may vary by country.",
    latestPeriod,
    previousYearPeriod,
    metrics: {
      totalImports: {
        value: totalValue,
        period: latestPeriod,
        previousYearValue: previousTotal?.value ?? null,
        yoyChange: getYoYChange(latestTotal, previousTotal),
      },
      fuelImports: {
        value: fuelValue,
        period: latestFuel?.period ?? null,
        shareOfTotal:
          totalValue && fuelValue !== null ? (fuelValue / totalValue) * 100 : null,
        previousYearValue: previousFuel?.value ?? null,
        yoyChange: getYoYChange(latestFuel ?? undefined, previousFuel),
      },
      foodImports: {
        value: foodValue,
        period: latestFood?.period ?? null,
        shareOfTotal:
          totalValue && foodValue !== null ? (foodValue / totalValue) * 100 : null,
        previousYearValue: previousFood?.value ?? null,
        yoyChange: getYoYChange(latestFood ?? undefined, previousFood),
      },
    },
  });
}
