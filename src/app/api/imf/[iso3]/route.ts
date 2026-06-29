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

function extractYearValuesFromNode(node: unknown) {
  const result: Record<string, number | string | null> = {};

  if (!isObject(node)) return result;

  for (const year of periods) {
    const value = node[year];

    if (typeof value === "number" || typeof value === "string") {
      result[year] = value;
    }
  }

  return result;
}

function walkForYearValues(node: unknown, depth = 0): Record<string, number | string | null> {
  if (depth > 10) return {};

  const direct = extractYearValuesFromNode(node);

  if (Object.keys(direct).length > 0) {
    return direct;
  }

  if (!isObject(node)) return {};

  for (const value of Object.values(node)) {
    const nested = walkForYearValues(value, depth + 1);

    if (Object.keys(nested).length > 0) {
      return nested;
    }
  }

  return {};
}

function extractValues(json: unknown, indicatorCode: string, indicatorId: string, iso3: string) {
  if (!isObject(json)) return {};

  const values = isObject(json.values) ? json.values : null;

  const candidates: unknown[] = [
    values?.[indicatorId],
    values?.[indicatorCode],
    isObject(values?.[indicatorId]) ? values?.[indicatorId]?.[iso3] : null,
    isObject(values?.[indicatorCode]) ? values?.[indicatorCode]?.[iso3] : null,
    values,
    json,
  ];

  for (const candidate of candidates) {
    const found = walkForYearValues(candidate);

    if (Object.keys(found).length > 0) {
      return found;
    }
  }

  return {};
}

async function fetchIMFIndicator(iso3: string, indicator: IMFIndicator) {
  const periodQuery = periods.join(",");
  const idsToTry = [`${indicator.code}@WEO`, indicator.code];

  const headers = {
    Accept: "application/json,text/plain,*/*",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/129.0 Safari/537.36",
    Referer: "https://www.imf.org/external/datamapper/datasets/WEO",
  };

  let lastStatus = "";

  for (const indicatorId of idsToTry) {
    const encodedIndicator = encodeURIComponent(indicatorId);

    const urls = [
      `https://www.imf.org/external/datamapper/api/v2/${encodedIndicator}/${iso3}?periods=${periodQuery}`,
      `https://www.imf.org/external/datamapper/api/v2/${encodedIndicator}/${iso3}`,
      `https://www.imf.org/external/datamapper/api/v1/${encodedIndicator}/${iso3}?periods=${periodQuery}`,
      `https://www.imf.org/external/datamapper/api/v1/${encodedIndicator}/${iso3}`,
    ];

    for (const url of urls) {
      try {
        const response = await fetch(url, {
          headers,
          next: {
            revalidate: 86400,
          },
        });

        lastStatus = `${response.status} ${response.statusText}`;

        if (!response.ok) {
          continue;
        }

        const json = await response.json();
        const values = extractValues(json, indicator.code, indicatorId, iso3);

        if (Object.keys(values).length > 0) {
          return {
            ...indicator,
            values,
            debugStatus: lastStatus,
            indicatorId,
          };
        }
      } catch {
        continue;
      }
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
