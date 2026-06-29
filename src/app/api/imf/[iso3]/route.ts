import { NextResponse } from "next/server";

type IMFIndicator = {
  code: string;
  label: string;
  unit: string;
};

const indicators: IMFIndicator[] = [
  { code: "NGDP_RPCH", label: "Real GDP growth", unit: "%" },
  { code: "PCPIPCH", label: "Inflation", unit: "%" },
  { code: "BCA_NGDPD", label: "Current account balance", unit: "% of GDP" },
  { code: "GGXWDG_NGDP", label: "Government debt", unit: "% of GDP" },
  { code: "LUR", label: "Unemployment rate", unit: "%" },
  { code: "NGDPD", label: "GDP, current prices", unit: "Billion USD" },
];

const periods = ["2024", "2025", "2026"];

function normalizeIso3(value: string) {
  return value.trim().toUpperCase();
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function exactExtract(json: unknown, indicatorCode: string, iso3: string) {
  if (!isObject(json)) return {};

  const values = isObject(json.values) ? json.values : null;
  const byIndicator = values && isObject(values[indicatorCode])
    ? values[indicatorCode]
    : null;
  const byCountry = byIndicator && isObject(byIndicator[iso3])
    ? byIndicator[iso3]
    : null;

  if (!byCountry) return {};

  const result: Record<string, number | string | null> = {};

  for (const year of periods) {
    const value = byCountry[year];

    if (typeof value === "number" || typeof value === "string") {
      result[year] = value;
    }
  }

  return result;
}

function looseExtract(json: unknown) {
  const result: Record<string, number | string | null> = {};

  function walk(node: unknown, depth = 0) {
    if (depth > 8 || !isObject(node)) return;

    for (const year of periods) {
      const value = node[year];

      if (typeof value === "number" || typeof value === "string") {
        result[year] = value;
      }
    }

    if (Object.keys(result).length > 0) return;

    for (const value of Object.values(node)) {
      walk(value, depth + 1);
      if (Object.keys(result).length > 0) return;
    }
  }

  walk(json);

  return result;
}

async function fetchIMFIndicator(iso3: string, indicator: IMFIndicator) {
  const periodQuery = periods.join(",");
  const urls = [
    `https://www.imf.org/external/datamapper/api/v1/${indicator.code}/${iso3}?periods=${periodQuery}`,
    `https://www.imf.org/external/datamapper/api/v1/${indicator.code}/${iso3}`,
    `https://www.imf.org/external/datamapper/api/v2/${indicator.code}/${iso3}?periods=${periodQuery}`,
    `https://www.imf.org/external/datamapper/api/v2/${indicator.code}/${iso3}`,
  ];

  let lastStatus = "";

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        next: {
          revalidate: 86400,
        },
      });

      lastStatus = `${response.status} ${response.statusText}`;

      if (!response.ok) continue;

      const json = await response.json();
      const exact = exactExtract(json, indicator.code, iso3);
      const values = Object.keys(exact).length > 0 ? exact : looseExtract(json);

      if (Object.keys(values).length > 0) {
        return {
          ...indicator,
          values,
          debugStatus: lastStatus,
        };
      }
    } catch {
      continue;
    }
  }

  return {
    ...indicator,
    values: {},
    debugStatus: lastStatus,
  };
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ iso3: string }> }
) {
  const { iso3 } = await context.params;
  const country = normalizeIso3(iso3);

  const results = await Promise.all(
    indicators.map((indicator) => fetchIMFIndicator(country, indicator))
  );

  return NextResponse.json({
    source: "IMF DataMapper / World Economic Outlook",
    note: "2025 and 2026 values may be IMF estimates or forecasts depending on the indicator and country.",
    iso3: country,
    indicators: results,
  });
}
