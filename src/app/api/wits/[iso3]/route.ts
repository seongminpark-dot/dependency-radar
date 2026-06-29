import { NextResponse } from "next/server";

type Observation = {
  year: string;
  value: number;
};

type MetricResult = {
  code: string;
  label: string;
  unit: string;
  source: string;
  latestYear: string | null;
  latestValue: number | null;
  observations: Observation[];
  debugStatus?: string;
};

const indicators = [
  {
    code: "AHS-WGHTD-AVRG",
    label: "Effectively applied weighted average tariff",
    unit: "%",
    source: "WITS / UNCTAD TRAINS / WTO",
  },
  {
    code: "AHS-SMPL-AVRG",
    label: "Effectively applied simple average tariff",
    unit: "%",
    source: "WITS / UNCTAD TRAINS / WTO",
  },
  {
    code: "MFN-SMPL-AVRG",
    label: "Most favored nation simple average tariff",
    unit: "%",
    source: "WITS / WTO",
  },
  {
    code: "AHS-TTL-TRFF-LNS",
    label: "Number of tariff lines",
    unit: "lines",
    source: "WITS / UNCTAD TRAINS / WTO",
  },
];

function normalizeIso3(value: string) {
  return value.trim().toLowerCase();
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return null;

  const numberValue = Number(value);

  return Number.isNaN(numberValue) ? null : numberValue;
}

function collectObservations(node: unknown, output: Observation[] = []) {
  if (Array.isArray(node)) {
    for (const item of node) {
      collectObservations(item, output);
    }

    return output;
  }

  if (!isObject(node)) return output;

  const possibleYear =
    node.TIME_PERIOD ??
    node.timePeriod ??
    node.year ??
    node.Year ??
    node.YEAR ??
    node["@TIME_PERIOD"] ??
    node["@year"];

  const possibleValue =
    node.OBS_VALUE ??
    node.obsValue ??
    node.value ??
    node.Value ??
    node.VALUE ??
    node["@OBS_VALUE"] ??
    node["@value"];

  const year = possibleYear === undefined ? null : String(possibleYear);
  const value = toNumber(possibleValue);

  if (year && value !== null && /^\d{4}$/.test(year)) {
    output.push({
      year,
      value,
    });
  }

  for (const valueNode of Object.values(node)) {
    if (isObject(valueNode) || Array.isArray(valueNode)) {
      collectObservations(valueNode, output);
    }
  }

  return output;
}

function dedupeAndSort(observations: Observation[]) {
  const map = new Map<string, number>();

  for (const observation of observations) {
    if (!map.has(observation.year)) {
      map.set(observation.year, observation.value);
    }
  }

  return Array.from(map.entries())
    .map(([year, value]) => ({
      year,
      value,
    }))
    .sort((a, b) => a.year.localeCompare(b.year));
}

async function fetchWitsIndicator(iso3: string, indicator: (typeof indicators)[number]) {
  const reporter = normalizeIso3(iso3);

  const urls = [
    `https://wits.worldbank.org/API/V1/SDMX/V21/datasource/tradestats-tariff/reporter/${reporter}/year/all/partner/wld/product/total/indicator/${indicator.code}?format=JSON`,
    `https://wits.worldbank.org/API/V1/SDMX/V21/datasource/tradestats-tariff/reporter/${reporter}/year/all/partner/all/product/total/indicator/${indicator.code}?format=JSON`,
    `https://wits.worldbank.org/API/V1/SDMX/V21/datasource/tradestats-tariff/reporter/${reporter}/year/all/partner/wld/product/all/indicator/${indicator.code}?format=JSON`,
    `https://wits.worldbank.org/API/V1/SDMX/V21/datasource/tradestats-tariff/reporter/${reporter}/year/all/partner/all/product/all/indicator/${indicator.code}?format=JSON`,
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
      const observations = dedupeAndSort(collectObservations(json));
      const latest = observations[observations.length - 1];

      if (latest) {
        return {
          ...indicator,
          latestYear: latest.year,
          latestValue: latest.value,
          observations,
          debugStatus: lastStatus,
        } satisfies MetricResult;
      }
    } catch {
      continue;
    }
  }

  return {
    ...indicator,
    latestYear: null,
    latestValue: null,
    observations: [],
    debugStatus: lastStatus,
  } satisfies MetricResult;
}

async function fetchWorldBankTariffFallback(iso3: string) {
  const series = [
    {
      code: "TM.TAX.MRCH.WM.AR.ZS",
      label: "World Bank WDI applied weighted mean tariff",
      unit: "%",
      source: "World Bank WDI / WITS / WTO / UNCTAD",
    },
    {
      code: "TM.TAX.MRCH.SM.AR.ZS",
      label: "World Bank WDI applied simple mean tariff",
      unit: "%",
      source: "World Bank WDI / WITS / WTO / UNCTAD",
    },
  ];

  const results: MetricResult[] = [];

  for (const item of series) {
    try {
      const url = `https://api.worldbank.org/v2/country/${iso3.toUpperCase()}/indicator/${item.code}?format=json&per_page=100`;
      const response = await fetch(url, {
        next: {
          revalidate: 86400,
        },
      });

      if (!response.ok) {
        results.push({
          ...item,
          latestYear: null,
          latestValue: null,
          observations: [],
          debugStatus: `${response.status} ${response.statusText}`,
        });
        continue;
      }

      const json = await response.json();
      const rows = Array.isArray(json?.[1]) ? json[1] : [];

      const observations = rows
        .map((row: Record<string, unknown>) => ({
          year: String(row.date ?? ""),
          value: toNumber(row.value),
        }))
        .filter(
          (row: { year: string; value: number | null }) =>
            /^\d{4}$/.test(row.year) && row.value !== null
        )
        .map((row: { year: string; value: number | null }) => ({
          year: row.year,
          value: Number(row.value),
        }))
        .sort((a: Observation, b: Observation) => a.year.localeCompare(b.year));

      const latest = observations[observations.length - 1];

      results.push({
        ...item,
        latestYear: latest?.year ?? null,
        latestValue: latest?.value ?? null,
        observations,
        debugStatus: "200 OK",
      });
    } catch {
      results.push({
        ...item,
        latestYear: null,
        latestValue: null,
        observations: [],
        debugStatus: "Fetch failed",
      });
    }
  }

  return results;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ iso3: string }> }
) {
  const { iso3 } = await context.params;
  const country = iso3.trim().toUpperCase();

  const witsResults = await Promise.all(
    indicators.map((indicator) => fetchWitsIndicator(country, indicator))
  );

  const hasWitsData = witsResults.some((item) => item.latestValue !== null);
  const fallbackResults = hasWitsData ? [] : await fetchWorldBankTariffFallback(country);

  return NextResponse.json({
    iso3: country,
    source: hasWitsData
      ? "WITS Trade Stats Tariff API"
      : "World Bank WDI tariff fallback",
    note: hasWitsData
      ? "Tariff data retrieved from WITS Trade Stats Tariff API."
      : "WITS returned no tariff observations, so World Bank WDI tariff indicators are shown as fallback.",
    metrics: hasWitsData ? witsResults : fallbackResults,
  });
}
