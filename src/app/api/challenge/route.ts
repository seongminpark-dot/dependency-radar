import { NextResponse } from "next/server";
import countries from "world-countries";

export const dynamic = "force-dynamic";

type CountryRecord = {
  cca2?: string;
  cca3?: string;
  name?: {
    common?: string;
  };
};

type LocalCountryRow = Record<string, unknown>;

type MetricConfig = {
  key: string;
  labelKo: string;
  labelEn: string;
  unit: "%" | "index" | "usd";
  questionKo: string;
  questionEn: string;
};

type ChallengeItem = {
  iso3: string;
  iso2: string;
  countryName: string;
  value: number;
  year: string;
};

type StatEntry = {
  metric: MetricConfig;
  value: number;
  year: string;
};

const metricConfigs: MetricConfig[] = [
  {
    key: "importsGdp",
    labelKo: "수입/GDP",
    labelEn: "Imports/GDP",
    unit: "%",
    questionKo: "어느 나라의 수입/GDP 비중이 더 높을까요?",
    questionEn: "Which country has a higher imports/GDP ratio?",
  },
  {
    key: "fuelImportShare",
    labelKo: "연료 수입 비중",
    labelEn: "Fuel import share",
    unit: "%",
    questionKo: "어느 나라의 연료 수입 비중이 더 높을까요?",
    questionEn: "Which country has a higher fuel import share?",
  },
  {
    key: "foodImportShare",
    labelKo: "식량 수입 비중",
    labelEn: "Food import share",
    unit: "%",
    questionKo: "어느 나라의 식량 수입 비중이 더 높을까요?",
    questionEn: "Which country has a higher food import share?",
  },
  {
    key: "tariffRate",
    labelKo: "관세율",
    labelEn: "Tariff rate",
    unit: "%",
    questionKo: "어느 나라의 관세율이 더 높을까요?",
    questionEn: "Which country has a higher tariff rate?",
  },
  {
    key: "energyImportPercent",
    labelKo: "에너지 순수입",
    labelEn: "Net energy imports",
    unit: "%",
    questionKo: "어느 나라의 에너지 수입 노출도가 더 높을까요?",
    questionEn: "Which country has higher net energy import exposure?",
  },
  {
    key: "logisticsIndex",
    labelKo: "물류지수",
    labelEn: "Logistics index",
    unit: "index",
    questionKo: "어느 나라의 물류지수가 더 높을까요?",
    questionEn: "Which country has a higher logistics index?",
  },
];

const shockScenarios = [
  {
    key: "fuel-shock",
    labelKo: "Oil Shock",
    titleKo: "국제 유가가 급등한다면 어느 나라가 더 노출될까요?",
    descKo: "연료 수입 비중과 에너지 순수입 비중을 중심으로 비교합니다.",
    weights: {
      fuelImportShare: 0.55,
      energyImportPercent: 0.3,
      importsGdp: 0.15,
    },
  },
  {
    key: "food-shock",
    labelKo: "Food Shock",
    titleKo: "식량 가격이 급등한다면 어느 나라가 더 노출될까요?",
    descKo: "식량 수입 비중과 수입/GDP 비중을 중심으로 비교합니다.",
    weights: {
      foodImportShare: 0.65,
      importsGdp: 0.25,
      energyImportPercent: 0.1,
    },
  },
  {
    key: "supply-shock",
    labelKo: "Supply Shock",
    titleKo: "글로벌 공급망 충격이 온다면 어느 나라가 더 노출될까요?",
    descKo: "수입/GDP, 연료 수입 비중, 식량 수입 비중을 함께 비교합니다.",
    weights: {
      importsGdp: 0.45,
      fuelImportShare: 0.3,
      foodImportShare: 0.25,
    },
  },
];

const countryMeta = new Map(
  (countries as CountryRecord[])
    .filter((country) => country.cca3 && country.cca2)
    .map((country) => [
      country.cca3!.toUpperCase(),
      {
        iso2: country.cca2!.toUpperCase(),
        name: country.name?.common ?? country.cca3!,
      },
    ])
);

function getStringValue(row: LocalCountryRow | null | undefined, keys: string[]) {
  if (!row) return "";

  for (const key of keys) {
    const value = row[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function isCountryRow(value: unknown): value is LocalCountryRow {
  if (!value || typeof value !== "object") return false;

  const row = value as LocalCountryRow;
  const iso3 = getStringValue(row, ["iso3", "cca3", "countryiso3code"]);

  if (!iso3) return false;

  return metricConfigs.some((metric) => {
    const stat = row[metric.key];
    return Boolean(stat && typeof stat === "object");
  });
}

function findRowsInValue(value: unknown, depth = 0): LocalCountryRow[] {
  if (depth > 3) return [];

  if (Array.isArray(value)) {
    if (value.some(isCountryRow)) {
      return value.filter(isCountryRow);
    }

    for (const item of value) {
      const nested = findRowsInValue(item, depth + 1);
      if (nested.length > 0) return nested;
    }

    return [];
  }

  if (value && typeof value === "object") {
    const objectValue = value as Record<string, unknown>;

    for (const key of ["rows", "data", "countries", "countryRows", "worldBankRows"]) {
      const nested = findRowsInValue(objectValue[key], depth + 1);
      if (nested.length > 0) return nested;
    }
  }

  return [];
}

async function getLocalWorldBankRows() {
  try {
    const module = await import("@/lib/worldBank");
    const values = Object.values(module as Record<string, unknown>);

    for (const value of values) {
      const rows = findRowsInValue(value);
      if (rows.length > 0) return rows;
    }

    for (const value of values) {
      if (typeof value !== "function") continue;

      try {
        const result = await (value as () => unknown | Promise<unknown>)();
        const rows = findRowsInValue(result);

        if (rows.length > 0) return rows;
      } catch {
        // ignore functions that require arguments
      }
    }

    return [];
  } catch {
    return [];
  }
}

function readStat(row: LocalCountryRow, key: string): { value: number; year: string } | null {
  const raw = row[key];

  if (!raw || typeof raw !== "object") return null;

  const stat = raw as Record<string, unknown>;
  const value = Number(stat.value);

  if (!Number.isFinite(value)) return null;
  if (Math.abs(value) < 0.000001) return null;

  const year =
    typeof stat.year === "string" || typeof stat.year === "number"
      ? String(stat.year)
      : "";

  return {
    value,
    year,
  };
}

function getCountryName(row: LocalCountryRow, iso3: string) {
  return (
    getStringValue(row, ["name", "countryName", "displayName", "nameEn"]) ||
    countryMeta.get(iso3)?.name ||
    iso3
  );
}

function formatValue(value: number, unit: MetricConfig["unit"]) {
  if (unit === "usd") {
    return `US$${value.toLocaleString("en-US", {
      maximumFractionDigits: 0,
    })}`;
  }

  if (unit === "%") {
    return `${value.toLocaleString("ko-KR", {
      maximumFractionDigits: 2,
    })}%`;
  }

  return value.toLocaleString("ko-KR", {
    maximumFractionDigits: 2,
  });
}

function pickRandom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function getItemsForMetric(rows: LocalCountryRow[], metric: MetricConfig): ChallengeItem[] {
  return rows
    .map((row) => {
      const iso3 = getStringValue(row, ["iso3", "cca3", "countryiso3code"]).toUpperCase();
      const meta = countryMeta.get(iso3);
      const stat = readStat(row, metric.key);

      if (!meta || !stat) return null;

      return {
        iso3,
        iso2: meta.iso2,
        countryName: getCountryName(row, iso3),
        value: stat.value,
        year: stat.year,
      };
    })
    .filter((item): item is ChallengeItem => Boolean(item));
}

function getCountryMetricEntries(row: LocalCountryRow) {
  const iso3 = getStringValue(row, ["iso3", "cca3", "countryiso3code"]).toUpperCase();
  const meta = countryMeta.get(iso3);

  if (!meta) return null;

  const metrics = metricConfigs
    .map((metric) => {
      const stat = readStat(row, metric.key);

      if (!stat) return null;

      return {
        metric,
        value: stat.value,
        year: stat.year,
      };
    })
    .filter((item): item is StatEntry => Boolean(item));

  if (metrics.length < 3) return null;

  return {
    iso3,
    iso2: meta.iso2,
    countryName: getCountryName(row, iso3),
    metrics,
  };
}

function buildHigherLower(rows: LocalCountryRow[], requestedMetric: string | null) {
  const available = metricConfigs
    .map((metric) => ({
      metric,
      items: getItemsForMetric(rows, metric),
    }))
    .filter((entry) => entry.items.length >= 2);

  if (available.length === 0) return null;

  const selected =
    available.find((entry) => entry.metric.key === requestedMetric) ??
    pickRandom(available);

  let left = pickRandom(selected.items);
  let right = pickRandom(selected.items);

  for (let i = 0; i < 30; i += 1) {
    if (left.iso3 !== right.iso3 && left.value !== right.value) break;
    right = pickRandom(selected.items);
  }

  const correct = left.value >= right.value ? "left" : "right";

  return {
    ok: true,
    mode: "higher-lower",
    badgeKo: selected.metric.labelKo,
    questionKo: selected.metric.questionKo,
    left: {
      ...left,
      formattedValue: formatValue(left.value, selected.metric.unit),
    },
    right: {
      ...right,
      formattedValue: formatValue(right.value, selected.metric.unit),
    },
    correct,
    explanationKo:
      correct === "left"
        ? `${left.countryName}의 ${selected.metric.labelKo} 값이 더 높습니다.`
        : `${right.countryName}의 ${selected.metric.labelKo} 값이 더 높습니다.`,
  };
}

function buildDetective(rows: LocalCountryRow[]) {
  const candidates = rows
    .map(getCountryMetricEntries)
    .filter((item): item is NonNullable<ReturnType<typeof getCountryMetricEntries>> =>
      Boolean(item)
    );

  if (candidates.length < 4) return null;

  const target = pickRandom(candidates);
  const clues = shuffle(target.metrics).slice(0, 3);

  const wrongOptions = shuffle(
    candidates.filter((item) => item.iso3 !== target.iso3)
  ).slice(0, 3);

  const options = shuffle([
    {
      iso3: target.iso3,
      iso2: target.iso2,
      countryName: target.countryName,
    },
    ...wrongOptions.map((item) => ({
      iso3: item.iso3,
      iso2: item.iso2,
      countryName: item.countryName,
    })),
  ]);

  return {
    ok: true,
    mode: "detective",
    badgeKo: "Data Detective",
    questionKo: "아래 공식 지표를 보고 어느 나라인지 맞혀보세요.",
    clues: clues.map((item) => ({
      labelKo: item.metric.labelKo,
      formattedValue: formatValue(item.value, item.metric.unit),
      year: item.year,
    })),
    options,
    correct: target.iso3,
    explanationKo: `정답은 ${target.countryName}입니다.`,
  };
}

function buildRankRush(rows: LocalCountryRow[]) {
  const available = metricConfigs
    .map((metric) => ({
      metric,
      items: getItemsForMetric(rows, metric),
    }))
    .filter((entry) => entry.items.length >= 4);

  if (available.length === 0) return null;

  const selected = pickRandom(available);
  const options = shuffle(selected.items).slice(0, 4);
  const correctItem = [...options].sort((a, b) => b.value - a.value)[0];

  return {
    ok: true,
    mode: "rank-rush",
    badgeKo: "Rank Rush",
    questionKo: `다음 4개 국가 중 ${selected.metric.labelKo}이 가장 높은 국가는 어디일까요?`,
    metric: selected.metric,
    options: options.map((item) => ({
      ...item,
      formattedValue: formatValue(item.value, selected.metric.unit),
    })),
    correct: correctItem.iso3,
    explanationKo: `${correctItem.countryName}의 ${selected.metric.labelKo} 값이 가장 높습니다.`,
  };
}

function getMetricByKey(metrics: StatEntry[], key: string) {
  return metrics.find((item) => item.metric.key === key);
}

function buildShockScenario(rows: LocalCountryRow[]) {
  const scenario = pickRandom(shockScenarios);

  const candidates = rows
    .map(getCountryMetricEntries)
    .filter((item): item is NonNullable<ReturnType<typeof getCountryMetricEntries>> =>
      Boolean(item)
    )
    .map((item) => {
      let score = 0;
      const factors: {
        labelKo: string;
        formattedValue: string;
        year: string;
        weight: number;
      }[] = [];

      for (const [key, weight] of Object.entries(scenario.weights)) {
        const metric = getMetricByKey(item.metrics, key);

        if (!metric) continue;

        const normalizedValue = Math.max(0, metric.value);
        score += normalizedValue * weight;

        factors.push({
          labelKo: metric.metric.labelKo,
          formattedValue: formatValue(metric.value, metric.metric.unit),
          year: metric.year,
          weight,
        });
      }

      if (factors.length < 2) return null;

      return {
        iso3: item.iso3,
        iso2: item.iso2,
        countryName: item.countryName,
        score,
        formattedValue: `${score.toLocaleString("ko-KR", {
          maximumFractionDigits: 1,
        })} pts`,
        year: "Datlora scenario score",
        factors,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  if (candidates.length < 2) return null;

  let left = pickRandom(candidates);
  let right = pickRandom(candidates);

  for (let i = 0; i < 30; i += 1) {
    if (left.iso3 !== right.iso3 && Math.abs(left.score - right.score) > 0.1) break;
    right = pickRandom(candidates);
  }

  const correct = left.score >= right.score ? "left" : "right";

  return {
    ok: true,
    mode: "shock",
    badgeKo: scenario.labelKo,
    questionKo: scenario.titleKo,
    scenarioKo: scenario.descKo,
    left,
    right,
    correct,
    explanationKo:
      correct === "left"
        ? `${left.countryName}의 시나리오 노출 점수가 더 높습니다.`
        : `${right.countryName}의 시나리오 노출 점수가 더 높습니다.`,
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("mode") ?? "higher-lower";
  const requestedMetric = url.searchParams.get("metric");

  const rows = await getLocalWorldBankRows();

  const payload =
    mode === "detective"
      ? buildDetective(rows)
      : mode === "rank-rush"
        ? buildRankRush(rows)
        : mode === "shock"
          ? buildShockScenario(rows)
          : buildHigherLower(rows, requestedMetric);

  if (!payload) {
    return NextResponse.json(
      {
        ok: false,
        message: "No challenge data available.",
      },
      { status: 200 }
    );
  }

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
