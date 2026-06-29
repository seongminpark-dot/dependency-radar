export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";

type EiaMetric = {
  code: string;
  label: string;
  unit: string;
  latestPeriod: string | null;
  latestValue: number | null;
  observations: {
    period: string;
    value: number;
  }[];
  source: string;
  debugStatus?: string;
};

const eiaSeries = [
  {
    code: "petroleum_liquids",
    label: "Petroleum and other liquids",
    activityId: "1",
    productId: "81",
    unit: "TBPD",
  },
  {
    code: "total_energy",
    label: "Total energy",
    activityId: "2",
    productId: "4413",
    unit: "QBTU",
  },
  {
    code: "natural_gas",
    label: "Natural gas",
    activityId: "8",
    productId: "4002",
    unit: "MMTCD",
  },
];

const iso3Overrides: Record<string, string> = {
  KOR: "KOR",
  USA: "USA",
  JPN: "JPN",
  CHN: "CHN",
  DEU: "DEU",
  FRA: "FRA",
  GBR: "GBR",
  CAN: "CAN",
  AUS: "AUS",
  MEX: "MEX",
  BRA: "BRA",
  IND: "IND",
};

function normalizeIso3(value: string) {
  const code = value.trim().toUpperCase();
  return iso3Overrides[code] ?? code;
}

function toNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return null;

  const numberValue = Number(value);

  return Number.isNaN(numberValue) ? null : numberValue;
}

function getRows(json: unknown): Record<string, unknown>[] {
  if (
    typeof json === "object" &&
    json !== null &&
    "response" in json &&
    typeof json.response === "object" &&
    json.response !== null &&
    "data" in json.response &&
    Array.isArray(json.response.data)
  ) {
    return json.response.data as Record<string, unknown>[];
  }

  if (
    typeof json === "object" &&
    json !== null &&
    "data" in json &&
    Array.isArray(json.data)
  ) {
    return json.data as Record<string, unknown>[];
  }

  return [];
}

async function fetchEiaSeries({
  iso3,
  apiKey,
  series,
}: {
  iso3: string;
  apiKey: string;
  series: (typeof eiaSeries)[number];
}): Promise<EiaMetric> {
  const params = new URLSearchParams();

  params.append("api_key", apiKey);
  params.append("frequency", "annual");
  params.append("data[0]", "value");
  params.append("facets[activityId][]", series.activityId);
  params.append("facets[productId][]", series.productId);
  params.append("facets[countryRegionId][]", iso3);
  params.append("facets[unit][]", series.unit);
  params.append("sort[0][column]", "period");
  params.append("sort[0][direction]", "desc");
  params.append("offset", "0");
  params.append("length", "100");

  const url = `https://api.eia.gov/v2/international/data/?${params.toString()}`;

  try {
    const response = await fetch(url, {
      next: {
        revalidate: 86400,
      },
    });

    const debugStatus = `${response.status} ${response.statusText}`;

    if (!response.ok) {
      return {
        code: series.code,
        label: series.label,
        unit: series.unit,
        latestPeriod: null,
        latestValue: null,
        observations: [],
        source: "EIA Open Data API",
        debugStatus,
      };
    }

    const json = await response.json();
    const rows = getRows(json);

    const observations = rows
      .map((row) => ({
        period: String(row.period ?? ""),
        value: toNumber(row.value),
      }))
      .filter(
        (row): row is { period: string; value: number } =>
          row.period.length > 0 && row.value !== null
      )
      .sort((a, b) => a.period.localeCompare(b.period));

    const latest = observations[observations.length - 1];
    const sample = rows[0] ?? {};

    const label = [
      sample.productName,
      sample.activityName,
    ]
      .filter(Boolean)
      .join(" - ");

    return {
      code: series.code,
      label: label || series.label,
      unit: String(sample.unit ?? series.unit),
      latestPeriod: latest?.period ?? null,
      latestValue: latest?.value ?? null,
      observations,
      source: "EIA Open Data API",
      debugStatus,
    };
  } catch {
    return {
      code: series.code,
      label: series.label,
      unit: series.unit,
      latestPeriod: null,
      latestValue: null,
      observations: [],
      source: "EIA Open Data API",
      debugStatus: "Fetch failed",
    };
  }
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ iso3: string }> }
) {
  const { iso3 } = await context.params;
  const country = normalizeIso3(iso3);
  const apiKey = process.env.EIA_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      configured: false,
      iso3: country,
      source: "EIA Open Data API",
      note: "EIA_API_KEY is missing.",
      metrics: [],
    });
  }

  const metrics = await Promise.all(
    eiaSeries.map((series) =>
      fetchEiaSeries({
        iso3: country,
        apiKey,
        series,
      })
    )
  );

  return NextResponse.json({
    configured: true,
    iso3: country,
    source: "EIA Open Data API",
    note: "International energy data from the U.S. Energy Information Administration.",
    metrics,
  });
}
