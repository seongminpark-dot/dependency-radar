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

type CountryMetric = ChallengeItem & {
  metricKey: string;
  metricLabelKo: string;
  metricLabelEn: string;
  formattedValue: string;
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
        // 일부 함수는 인자가 필요할 수 있어서 무시
      }
    }

    return [];
  } catch {
    return [];
  }
}

function readStat(row: LocalCountryRow, key: string) {
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

function getCountryMetrics(row: LocalCountryRow) {
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
    .filter(
      (item): item is { metric: MetricConfig; value: number; year: string } =>
        Boolean(item)
    );

  if (metrics.length < 3) return null;

  return {
    iso3,
    iso2: meta.iso2,
    countryName: getCountryName(row, iso3),
    metrics,
  };
}

function pickRandom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
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

    left = pickRandom(selected.items);
    right = pickRandom(selected.items);
  }

  const correct = left.value >= right.value ? "left" : "right";

  return {
    ok: true,
    mode: "higher-lower",
    metric: selected.metric,
    questionKo: selected.metric.questionKo,
    questionEn: selected.metric.questionEn,
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
    explanationEn:
      correct === "left"
        ? `${left.countryName} has a higher ${selected.metric.labelEn}.`
        : `${right.countryName} has a higher ${selected.metric.labelEn}.`,
  };
}

function buildCountryDuel(rows: LocalCountryRow[]) {
  const countriesWithMetrics = rows
    .map(getCountryMetrics)
    .filter(
      (
        item
      ): item is NonNullable<ReturnType<typeof getCountryMetrics>> =>
        Boolean(item)
    );

  if (countriesWithMetrics.length < 2) return null;

  let left = pickRandom(countriesWithMetrics);
  let right = pickRandom(countriesWithMetrics);

  for (let i = 0; i < 30; i += 1) {
    if (left.iso3 !== right.iso3) break;
    right = pickRandom(countriesWithMetrics);
  }

  const commonMetrics = metricConfigs
    .map((metric) => {
      const leftMetric = left.metrics.find((item) => item.metric.key === metric.key);
      const rightMetric = right.metrics.find((item) => item.metric.key === metric.key);

      if (!leftMetric || !rightMetric) return null;

      const winner =
        leftMetric.value > rightMetric.value
          ? "left"
          : rightMetric.value > leftMetric.value
            ? "right"
            : "tie";

      return {
        key: metric.key,
        labelKo: metric.labelKo,
        labelEn: metric.labelEn,
        unit: metric.unit,
        leftValue: leftMetric.value,
        rightValue: rightMetric.value,
        leftFormatted: formatValue(leftMetric.value, metric.unit),
        rightFormatted: formatValue(rightMetric.value, metric.unit),
        leftYear: leftMetric.year,
        rightYear: rightMetric.year,
        winner,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const leftScore = commonMetrics.filter((metric) => metric.winner === "left").length;
  const rightScore = commonMetrics.filter((metric) => metric.winner === "right").length;

  if (leftScore === rightScore) {
    return buildCountryDuel(rows);
  }

  const correct = leftScore > rightScore ? "left" : "right";

  return {
    ok: true,
    mode: "duel",
    questionKo: "어느 나라가 더 많은 지표에서 높은 값을 가질까요?",
    questionEn: "Which country has higher values across more indicators?",
    left: {
      iso3: left.iso3,
      iso2: left.iso2,
      countryName: left.countryName,
      score: leftScore,
    },
    right: {
      iso3: right.iso3,
      iso2: right.iso2,
      countryName: right.countryName,
      score: rightScore,
    },
    metrics: commonMetrics,
    correct,
    explanationKo:
      correct === "left"
        ? `${left.countryName}이 ${leftScore}:${rightScore}로 더 많은 지표에서 높은 값을 보였습니다.`
        : `${right.countryName}이 ${rightScore}:${leftScore}로 더 많은 지표에서 높은 값을 보였습니다.`,
    explanationEn:
      correct === "left"
        ? `${left.countryName} has higher values in more indicators.`
        : `${right.countryName} has higher values in more indicators.`,
  };
}

function buildDataDetective(rows: LocalCountryRow[]) {
  const candidates = rows
    .map(getCountryMetrics)
    .filter(
      (
        item
      ): item is NonNullable<ReturnType<typeof getCountryMetrics>> =>
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
    questionKo: "아래 공식 지표를 보고 어느 나라인지 맞혀보세요.",
    questionEn: "Guess the country from these official indicators.",
    target: {
      iso3: target.iso3,
      iso2: target.iso2,
      countryName: target.countryName,
    },
    clues: clues.map((item) => ({
      labelKo: item.metric.labelKo,
      labelEn: item.metric.labelEn,
      value: item.value,
      formattedValue: formatValue(item.value, item.metric.unit),
      year: item.year,
    })),
    options,
    correct: target.iso3,
    explanationKo: `정답은 ${target.countryName}입니다.`,
    explanationEn: `The correct answer is ${target.countryName}.`,
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("mode") ?? "higher-lower";
  const requestedMetric = url.searchParams.get("metric");

  const rows = await getLocalWorldBankRows();

  const payload =
    mode === "duel"
      ? buildCountryDuel(rows)
      : mode === "detective"
        ? buildDataDetective(rows)
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
