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

type StatKey =
  | "importsGdp"
  | "fuelImportShare"
  | "foodImportShare"
  | "tariffRate"
  | "logisticsIndex"
  | "energyImportPercent";

type ScenarioFactor = {
  key: StatKey;
  labelKo: string;
  transform: (value: number) => number;
  weight: number;
};

type Scenario = {
  key: string;
  labelKo: string;
  titleKo: string;
  descriptionKo: string;
  objectiveKo: string;
  factors: ScenarioFactor[];
};

const scenarios: Scenario[] = [
  {
    key: "oil-shock",
    labelKo: "Oil Shock",
    titleKo: "국제 유가 급등",
    descriptionKo:
      "연료 가격이 급등하고 에너지 수입 비용이 올라가는 상황입니다.",
    objectiveKo: "가장 에너지 충격에 노출된 국가를 고르세요.",
    factors: [
      {
        key: "fuelImportShare",
        labelKo: "연료 수입 비중",
        transform: (value) => value,
        weight: 0.55,
      },
      {
        key: "energyImportPercent",
        labelKo: "에너지 순수입",
        transform: (value) => Math.max(0, value),
        weight: 0.3,
      },
      {
        key: "importsGdp",
        labelKo: "수입/GDP",
        transform: (value) => value,
        weight: 0.15,
      },
    ],
  },
  {
    key: "food-shock",
    labelKo: "Food Shock",
    titleKo: "식량 가격 급등",
    descriptionKo:
      "곡물과 농산물 가격이 상승하고 식량 수입 부담이 커지는 상황입니다.",
    objectiveKo: "가장 식량 수입 충격에 노출된 국가를 고르세요.",
    factors: [
      {
        key: "foodImportShare",
        labelKo: "식량 수입 비중",
        transform: (value) => value * 3,
        weight: 0.55,
      },
      {
        key: "importsGdp",
        labelKo: "수입/GDP",
        transform: (value) => value,
        weight: 0.3,
      },
      {
        key: "logisticsIndex",
        labelKo: "물류 취약성",
        transform: (value) => Math.max(0, 5 - value) * 15,
        weight: 0.15,
      },
    ],
  },
  {
    key: "tariff-wall",
    labelKo: "Tariff Wall",
    titleKo: "관세 장벽 상승",
    descriptionKo:
      "주요 교역국의 관세와 무역 장벽이 상승하는 상황입니다.",
    objectiveKo: "무역 비용 충격에 더 노출된 국가를 고르세요.",
    factors: [
      {
        key: "tariffRate",
        labelKo: "관세율",
        transform: (value) => value * 5,
        weight: 0.45,
      },
      {
        key: "importsGdp",
        labelKo: "수입/GDP",
        transform: (value) => value,
        weight: 0.35,
      },
      {
        key: "logisticsIndex",
        labelKo: "물류 취약성",
        transform: (value) => Math.max(0, 5 - value) * 12,
        weight: 0.2,
      },
    ],
  },
  {
    key: "supply-freeze",
    labelKo: "Supply Freeze",
    titleKo: "글로벌 공급망 정체",
    descriptionKo:
      "항만 지연, 운송 병목, 중간재 공급 차질이 동시에 발생하는 상황입니다.",
    objectiveKo: "공급망 정체에 가장 취약한 국가를 고르세요.",
    factors: [
      {
        key: "importsGdp",
        labelKo: "수입/GDP",
        transform: (value) => value,
        weight: 0.4,
      },
      {
        key: "fuelImportShare",
        labelKo: "연료 수입 비중",
        transform: (value) => value,
        weight: 0.22,
      },
      {
        key: "foodImportShare",
        labelKo: "식량 수입 비중",
        transform: (value) => value * 2,
        weight: 0.18,
      },
      {
        key: "logisticsIndex",
        labelKo: "물류 취약성",
        transform: (value) => Math.max(0, 5 - value) * 15,
        weight: 0.2,
      },
    ],
  },
  {
    key: "import-squeeze",
    labelKo: "Import Squeeze",
    titleKo: "수입 비용 압박",
    descriptionKo:
      "환율, 운임, 원자재 가격이 동시에 올라 수입 비용이 커지는 상황입니다.",
    objectiveKo: "수입 비용 압박에 가장 노출된 국가를 고르세요.",
    factors: [
      {
        key: "importsGdp",
        labelKo: "수입/GDP",
        transform: (value) => value,
        weight: 0.5,
      },
      {
        key: "fuelImportShare",
        labelKo: "연료 수입 비중",
        transform: (value) => value,
        weight: 0.25,
      },
      {
        key: "foodImportShare",
        labelKo: "식량 수입 비중",
        transform: (value) => value * 2,
        weight: 0.15,
      },
      {
        key: "tariffRate",
        labelKo: "관세율",
        transform: (value) => value * 4,
        weight: 0.1,
      },
    ],
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

  return [
    "importsGdp",
    "fuelImportShare",
    "foodImportShare",
    "tariffRate",
    "logisticsIndex",
    "energyImportPercent",
  ].some((key) => {
    const stat = row[key];
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
        // ignore
      }
    }

    return [];
  } catch {
    return [];
  }
}

function readStat(row: LocalCountryRow, key: StatKey) {
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

function formatValue(value: number, key: StatKey) {
  if (key === "logisticsIndex") {
    return value.toLocaleString("ko-KR", {
      maximumFractionDigits: 2,
    });
  }

  return `${value.toLocaleString("ko-KR", {
    maximumFractionDigits: 2,
  })}%`;
}

function pickRandom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function scoreCountry(row: LocalCountryRow, scenario: Scenario) {
  const iso3 = getStringValue(row, ["iso3", "cca3", "countryiso3code"]).toUpperCase();
  const meta = countryMeta.get(iso3);

  if (!meta) return null;

  const countryName =
    getStringValue(row, ["name", "countryName", "displayName", "nameEn"]) ||
    meta.name;

  const factors = scenario.factors
    .map((factor) => {
      const stat = readStat(row, factor.key);

      if (!stat) return null;

      const transformed = factor.transform(stat.value);
      const contribution = transformed * factor.weight;

      if (!Number.isFinite(contribution)) return null;

      return {
        key: factor.key,
        labelKo: factor.labelKo,
        value: stat.value,
        formattedValue: formatValue(stat.value, factor.key),
        year: stat.year,
        weight: factor.weight,
        contribution,
      };
    })
    .filter(
      (
        item
      ): item is {
        key: StatKey;
        labelKo: string;
        value: number;
        formattedValue: string;
        year: string;
        weight: number;
        contribution: number;
      } => Boolean(item)
    );

  if (factors.length < 2) return null;

  const score = factors.reduce((sum, factor) => sum + factor.contribution, 0);

  if (!Number.isFinite(score) || score <= 0) return null;

  return {
    iso3,
    iso2: meta.iso2,
    countryName,
    score,
    scoreLabel: `${score.toLocaleString("ko-KR", {
      maximumFractionDigits: 1,
    })} risk`,
    factors: factors.sort((a, b) => b.contribution - a.contribution),
  };
}

export async function GET() {
  const rows = await getLocalWorldBankRows();
  const scenario = pickRandom(scenarios);

  const candidates = rows
    .map((row) => scoreCountry(row, scenario))
    .filter(
      (
        item
      ): item is NonNullable<ReturnType<typeof scoreCountry>> =>
        Boolean(item)
    );

  if (candidates.length < 3) {
    return NextResponse.json(
      {
        ok: false,
        message: "Not enough scenario data available.",
      },
      { status: 200 }
    );
  }

  const selected = shuffle(candidates).slice(0, 3);
  const correct = [...selected].sort((a, b) => b.score - a.score)[0];

  return NextResponse.json(
    {
      ok: true,
      scenario: {
        key: scenario.key,
        labelKo: scenario.labelKo,
        titleKo: scenario.titleKo,
        descriptionKo: scenario.descriptionKo,
        objectiveKo: scenario.objectiveKo,
      },
      countries: selected.map((item) => ({
        iso3: item.iso3,
        iso2: item.iso2,
        countryName: item.countryName,
        score: item.score,
        scoreLabel: item.scoreLabel,
        factors: item.factors,
      })),
      correctIso3: correct.iso3,
      explanationKo: `${correct.countryName}이 이번 시나리오에서 가장 높은 노출 점수를 보였습니다.`,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
