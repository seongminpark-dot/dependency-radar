import type { CountryRow, StatValue } from "@/lib/worldBank";

type IssueSlug =
  | "oil-shock"
  | "food-import-risk"
  | "tariff-pressure"
  | "supply-chain";

type StatKey =
  | "fuelImportShare"
  | "foodImportShare"
  | "importsGdp"
  | "tariffRate"
  | "energyImportPercent"
  | "logisticsIndex";

export type IssueExposureRow = {
  iso3: string;
  iso2: string;
  name: string;
  region: string;
  primaryValue: number;
  primaryYear: string;
  primaryLabel: string;
  primaryFormatted: string;
  secondaryStats: {
    label: string;
    value: string;
    year: string;
  }[];
};

const issueMetricConfig: Record<
  IssueSlug,
  {
    primaryKey: StatKey;
    primaryLabel: string;
    secondaryKeys: {
      key: StatKey;
      label: string;
    }[];
    methodology: string;
  }
> = {
  "oil-shock": {
    primaryKey: "fuelImportShare",
    primaryLabel: "Fuel import share",
    secondaryKeys: [
      { key: "energyImportPercent", label: "Energy net imports" },
      { key: "importsGdp", label: "Imports / GDP" },
    ],
    methodology:
      "연료 수입 비중이 높은 국가를 우선 표시하고, 에너지 순수입 및 수입/GDP를 보조 지표로 함께 보여줍니다.",
  },
  "food-import-risk": {
    primaryKey: "foodImportShare",
    primaryLabel: "Food import share",
    secondaryKeys: [
      { key: "importsGdp", label: "Imports / GDP" },
      { key: "logisticsIndex", label: "Logistics index" },
    ],
    methodology:
      "식량 수입 비중이 높은 국가를 우선 표시하고, 전체 수입 의존도와 물류지수를 보조 지표로 함께 보여줍니다.",
  },
  "tariff-pressure": {
    primaryKey: "tariffRate",
    primaryLabel: "Tariff rate",
    secondaryKeys: [
      { key: "importsGdp", label: "Imports / GDP" },
      { key: "logisticsIndex", label: "Logistics index" },
    ],
    methodology:
      "가중 평균 관세율이 높은 국가를 우선 표시하고, 수입/GDP 및 물류지수를 함께 확인합니다.",
  },
  "supply-chain": {
    primaryKey: "importsGdp",
    primaryLabel: "Imports / GDP",
    secondaryKeys: [
      { key: "fuelImportShare", label: "Fuel import share" },
      { key: "foodImportShare", label: "Food import share" },
      { key: "logisticsIndex", label: "Logistics index" },
    ],
    methodology:
      "수입/GDP가 높은 국가를 우선 표시하고, 연료·식량 수입 비중 및 물류지수를 함께 보여줍니다.",
  },
};

function formatStatValue(value: number, key: StatKey) {
  if (key === "logisticsIndex") {
    return value.toLocaleString("ko-KR", {
      maximumFractionDigits: 2,
    });
  }

  return `${value.toLocaleString("ko-KR", {
    maximumFractionDigits: 2,
  })}%`;
}

function getStat(row: CountryRow, key: StatKey): StatValue {
  return row[key];
}

function isUsableStat(stat: StatValue) {
  return typeof stat.value === "number" && Number.isFinite(stat.value);
}

export function getIssueMetricConfig(slug: string) {
  return issueMetricConfig[(slug as IssueSlug) || "supply-chain"] ?? issueMetricConfig["supply-chain"];
}

export function getIssueExposureRows(slug: string, rows: CountryRow[]) {
  const config = getIssueMetricConfig(slug);

  return rows
    .map((row): IssueExposureRow | null => {
      const primary = getStat(row, config.primaryKey);

      if (!isUsableStat(primary)) return null;

      const secondaryStats = config.secondaryKeys.map((item) => {
        const stat = getStat(row, item.key);

        return {
          label: item.label,
          value: isUsableStat(stat) ? formatStatValue(stat.value!, item.key) : "No official value",
          year: stat.year ?? "",
        };
      });

      return {
        iso3: row.iso3,
        iso2: row.iso2,
        name: row.name,
        region: row.region,
        primaryValue: primary.value!,
        primaryYear: primary.year ?? "",
        primaryLabel: config.primaryLabel,
        primaryFormatted: formatStatValue(primary.value!, config.primaryKey),
        secondaryStats,
      };
    })
    .filter((row): row is IssueExposureRow => Boolean(row))
    .sort((a, b) => b.primaryValue - a.primaryValue)
    .slice(0, 10);
}

export function flagEmoji(iso2: string) {
  if (!iso2 || iso2.length !== 2) return "";

  return iso2
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}
