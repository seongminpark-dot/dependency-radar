import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type WorldBankApiRow = {
  date?: string;
  value?: number | null;
  countryiso3code?: string;
};

const metricMap = {
  importsGdp: {
    indicator: "NE.IMP.GNFS.ZS",
    labelKo: "수입/GDP",
    labelEn: "Imports/GDP",
    unit: "%",
    source: "World Bank WDI",
  },
  importUsd: {
    indicator: "NE.IMP.GNFS.CD",
    labelKo: "총 수입액",
    labelEn: "Imports of goods and services",
    unit: "current US$",
    source: "World Bank WDI",
  },
  fuelImportShare: {
    indicator: "TM.VAL.FUEL.ZS.UN",
    labelKo: "연료 수입 비중",
    labelEn: "Fuel imports",
    unit: "%",
    source: "World Bank WDI / UN Comtrade",
  },
  foodImportShare: {
    indicator: "TM.VAL.FOOD.ZS.UN",
    labelKo: "식량 수입 비중",
    labelEn: "Food imports",
    unit: "%",
    source: "World Bank WDI / UN Comtrade",
  },
  energyImportPercent: {
    indicator: "EG.IMP.CONS.ZS",
    labelKo: "에너지 순수입",
    labelEn: "Energy imports, net",
    unit: "%",
    source: "World Bank WDI / IEA",
  },
  tariffRate: {
    indicator: "TM.TAX.MRCH.WM.AR.ZS",
    labelKo: "관세율",
    labelEn: "Tariff rate",
    unit: "%",
    source: "World Bank WDI / WITS",
  },
  logisticsIndex: {
    indicator: "LP.LPI.OVRL.XQ",
    labelKo: "물류지수",
    labelEn: "Logistics Performance Index",
    unit: "index",
    source: "World Bank WDI",
  },
} as const;

type MetricKey = keyof typeof metricMap;

function normalizeMetric(value: string | null): MetricKey {
  const key = value ?? "importsGdp";

  if (key in metricMap) {
    return key as MetricKey;
  }

  return "importsGdp";
}

function isValidNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return false;

  const numberValue = Number(value);

  return Number.isFinite(numberValue);
}

export async function GET(
  request: Request,
  context: { params: Promise<{ iso3: string }> }
) {
  const { iso3 } = await context.params;
  const url = new URL(request.url);

  const metric = normalizeMetric(
    url.searchParams.get("metric") ?? url.searchParams.get("indicator")
  );

  const config = metricMap[metric];
  const country = iso3.trim().toUpperCase();

  const worldBankUrl =
    `https://api.worldbank.org/v2/country/${encodeURIComponent(country)}` +
    `/indicator/${encodeURIComponent(config.indicator)}` +
    `?format=json&per_page=20000&date=1960:2026`;

  try {
    const response = await fetch(worldBankUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "User-Agent": "Trade Dependency Atlas",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          iso3: country,
          metric,
          indicator: config.indicator,
          labelKo: config.labelKo,
          labelEn: config.labelEn,
          unit: config.unit,
          source: config.source,
          observations: [],
          latestValue: null,
          latestYear: null,
          message: `World Bank API returned ${response.status}`,
        },
        { status: 200 }
      );
    }

    const json = await response.json();
    const rawRows: WorldBankApiRow[] = Array.isArray(json?.[1]) ? json[1] : [];

    const observations = rawRows
      .filter((row) => isValidNumber(row.value) && row.date)
      .map((row) => ({
        year: String(row.date),
        value: Number(row.value),
      }))
      .filter((row) => Number(row.year) >= 1960)
      .sort((a, b) => Number(a.year) - Number(b.year));

    const latest = observations.length > 0 ? observations[observations.length - 1] : null;

    return NextResponse.json(
      {
        ok: true,
        iso3: country,
        metric,
        indicator: config.indicator,
        labelKo: config.labelKo,
        labelEn: config.labelEn,
        unit: config.unit,
        source: config.source,
        observations,
        latestValue: latest?.value ?? null,
        latestYear: latest?.year ?? null,
        count: observations.length,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        iso3: country,
        metric,
        indicator: config.indicator,
        labelKo: config.labelKo,
        labelEn: config.labelEn,
        unit: config.unit,
        source: config.source,
        observations: [],
        latestValue: null,
        latestYear: null,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 200 }
    );
  }
}
