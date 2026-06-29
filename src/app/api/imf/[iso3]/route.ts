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

function readYearMap(node: unknown) {
  if (!isObject(node)) return null;

  const result: Record<string, number | string | null> = {};
  let found = false;

  for (const year of periods) {
    const value = node[year];

    if (typeof value === "number" || typeof value === "string") {
      result[year] = value;
      found = true;
    }
  }

  return found ? result : null;
}

function findYearMap(node: unknown, depth = 0): Record<string, number | string | null> | null {
  if (depth > 8) return null;

  const direct = readYearMap(node);
  if (direct) return direct;

  if (!isObject(node)) return null;

  for (const value of Object.values(node)) {
    const nested = findYearMap(value, depth + 1);
    if (nested) return nested;
  }

  return null;
}

function extractValues(json: unknown, indicatorCode: string, iso3: string) {
  if (!isObject(json)) return {};

  const values = isObject(json.values) ? json.values : null;

  const candidates = [
    values?.[indicatorCode],
    isObject(values?.[indicatorCode]) ? values?.[indicatorCode]?.[iso3] : null,
    values?.[iso3],
    isObject(values?.[iso3]) ? values?.[iso3]?.[indicatorCode] : null,
    values,
    json,
  ];

  for (const candidate of candidates) {
    const found = findYearMap(candidate);
    if (found) return found;
  }

  return {};
}

async function fetchIMFIndicator(iso3: string, indicator: IMFIndicator) {
  const periodQuery = periods.join(",");
  const urls = [
    `https://www.imf.org/external/datamapper/api/v2/${indicator.code}/${iso3}?periods=${periodQuery}`,
    `https://www.imf.org/external/datamapper/api/v1/${indicator.code}/${iso3}?periods=${periodQuery}`,
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        next: {
          revalidate: 86400,
        },
      });

      if (!response.ok) continue;

      const json = await response.json();
      const values = extractValues(json, indicator.code, iso3);

      if (Object.keys(values).length > 0) {
        return {
          ...indicator,
          values,
        };
      }
    } catch {
      continue;
    }
  }

  return {
    ...indicator,
    values: {},
  };
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ iso3: string }> }
) {
  const { iso3 } = await context.params;
  const country = normalizeIso3(iso3);

  try {
    const results = await Promise.all(
      indicators.map((indicator) => fetchIMFIndicator(country, indicator))
    );

    return NextResponse.json({
      source: "IMF DataMapper / World Economic Outlook",
      note: "2025 and 2026 values may be IMF estimates or forecasts depending on the indicator and country.",
      iso3: country,
      indicators: results,
    });
  } catch {
    return NextResponse.json({
      source: "IMF DataMapper / World Economic Outlook",
      note: "Unable to load IMF outlook data.",
      iso3: country,
      indicators: [],
    });
  }
}
