"use client";

import LatestMonthlyTradePanel from "@/components/LatestMonthlyTradePanel";
import OfficialEnergyPanel from "@/components/OfficialEnergyPanel";
import OfficialTariffPanel from "@/components/OfficialTariffPanel";

type Language = "ko" | "en" | "ja" | "zh" | "es" | "fr" | "de";
type LooseCountryRow = Record<string, unknown>;

const supportedLanguages: Language[] = ["ko", "en", "ja", "zh", "es", "fr", "de"];

const metricConfigs = [
  {
    key: "importsGdp",
    labelKo: "수입/GDP",
    labelEn: "Imports/GDP",
    unit: "%",
    descKo: "경제 규모 대비 수입 의존도",
    descEn: "Import exposure relative to economic size",
  },
  {
    key: "fuelImportShare",
    labelKo: "연료 수입 비중",
    labelEn: "Fuel import share",
    unit: "%",
    descKo: "총 수입 중 연료가 차지하는 비중",
    descEn: "Fuel share of total imports",
  },
  {
    key: "foodImportShare",
    labelKo: "식량 수입 비중",
    labelEn: "Food import share",
    unit: "%",
    descKo: "총 수입 중 식량/농산물이 차지하는 비중",
    descEn: "Food and agricultural share of total imports",
  },
  {
    key: "tariffRate",
    labelKo: "관세율",
    labelEn: "Tariff rate",
    unit: "%",
    descKo: "가중평균 또는 fallback 관세 지표",
    descEn: "Weighted average or fallback tariff indicator",
  },
  {
    key: "logisticsIndex",
    labelKo: "물류지수",
    labelEn: "Logistics index",
    unit: "index",
    descKo: "물류 성과 참고 지표",
    descEn: "Logistics performance reference indicator",
  },
  {
    key: "energyImportPercent",
    labelKo: "에너지 순수입",
    labelEn: "Net energy imports",
    unit: "%",
    descKo: "에너지 수입 노출도 참고 지표",
    descEn: "Energy import exposure reference indicator",
  },
] as const;

const copy = {
  ko: {
    label: "Country profile",
    titleSuffix: "핵심 통계 요약",
    subtitle:
      "이 국가는 World Bank 장기 구조 지표와 UN Comtrade, EIA, WITS/WTO 공식 데이터 레이어를 함께 사용해 분석됩니다.",
    quickSummary: "핵심 지표",
    noEstimate: "공식값만 표시",
    noEstimateText: "값이 없는 항목은 임의 추정으로 채우지 않습니다.",
    latestRule: "최신 제공 연도",
    latestRuleText: "각 지표의 연도는 해당 출처가 실제로 제공하는 최신 연도입니다.",
    compare: "다른 국가와 비교",
    topics: "주제별 통계 보기",
    layerTitle: "공식 데이터 레이어",
    worldBank: "World Bank WDI",
    worldBankDesc: "장기 연간 구조 지표",
    comtrade: "UN Comtrade",
    comtradeDesc: "최신 공식 상품무역 데이터",
    eia: "EIA",
    eiaDesc: "국제 에너지 데이터",
    wits: "WITS / WTO",
    witsDesc: "관세 데이터",
    noData: "표시 가능한 핵심 지표가 아직 없습니다.",
    year: "제공 연도",
  },
  en: {
    label: "Country profile",
    titleSuffix: "Key statistics summary",
    subtitle:
      "This country page combines World Bank structural indicators with UN Comtrade, EIA, and WITS/WTO official data layers.",
    quickSummary: "Key indicators",
    noEstimate: "Official values only",
    noEstimateText: "Missing values are not filled with artificial estimates.",
    latestRule: "Latest source year",
    latestRuleText: "Each indicator year is the latest year available from its source.",
    compare: "Compare with another country",
    topics: "Explore topics",
    layerTitle: "Official data layers",
    worldBank: "World Bank WDI",
    worldBankDesc: "Annual structural baseline",
    comtrade: "UN Comtrade",
    comtradeDesc: "Latest official merchandise trade data",
    eia: "EIA",
    eiaDesc: "International energy data",
    wits: "WITS / WTO",
    witsDesc: "Tariff data",
    noData: "No key indicators are available yet.",
    year: "Source year",
  },
};

function normalizeLanguage(language?: string): Language {
  if (language && supportedLanguages.includes(language as Language)) {
    return language as Language;
  }

  return "en";
}

function getCopy(language: Language) {
  return language === "ko" ? copy.ko : copy.en;
}

function getString(row: LooseCountryRow | null | undefined, keys: string[]) {
  if (!row) return null;

  for (const key of keys) {
    const value = row[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

function getFlagEmoji(iso2: string | null) {
  if (!iso2 || iso2.length !== 2) return "";

  return iso2
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
}

function readStat(row: LooseCountryRow | null | undefined, key: string) {
  if (!row) return null;

  const raw = row[key];

  if (raw === null || raw === undefined) return null;

  if (typeof raw === "number") {
    if (!Number.isFinite(raw)) return null;

    return {
      value: raw,
      year: "",
    };
  }

  if (typeof raw !== "object") return null;

  const stat = raw as Record<string, unknown>;
  const value = Number(stat.value);

  if (!Number.isFinite(value)) return null;

  const year =
    typeof stat.year === "string" || typeof stat.year === "number"
      ? String(stat.year)
      : "";

  return {
    value,
    year,
  };
}

function formatStat(value: number, unit: string, language: Language) {
  const locale = language === "ko" ? "ko-KR" : "en-US";

  if (unit === "%") {
    return `${value.toLocaleString(locale, {
      maximumFractionDigits: 2,
    })}%`;
  }

  if (unit === "usd") {
    return `US$${value.toLocaleString(locale, {
      maximumFractionDigits: 2,
    })}`;
  }

  return value.toLocaleString(locale, {
    maximumFractionDigits: 2,
  });
}

function StatCard({
  label,
  description,
  value,
  year,
  unit,
  language,
}: {
  label: string;
  description: string;
  value: number;
  year: string;
  unit: string;
  language: Language;
}) {
  const t = getCopy(language);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-5">
      <p className="text-sm font-semibold text-slate-300">{label}</p>
      <p className="mt-3 text-3xl font-bold text-white">
        {formatStat(value, unit, language)}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
      <p className="mt-4 text-xs font-semibold text-indigo-300">
        {year ? `${t.year}: ${year}` : t.year}
      </p>
    </div>
  );
}

function DataLayerCard({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-5">
      <p className="text-sm font-semibold text-white">{name}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}

function CountrySummaryCards({
  row,
  language,
}: {
  row?: LooseCountryRow | null;
  language: Language;
}) {
  const t = getCopy(language);

  const stats = metricConfigs
    .map((metric) => {
      const stat = readStat(row, metric.key);

      if (!stat) return null;

      return {
        ...metric,
        ...stat,
      };
    })
    .filter(
      (
        item
      ): item is (typeof metricConfigs)[number] & {
        value: number;
        year: string;
      } => Boolean(item)
    );

  if (stats.length === 0) {
    return (
      <div className="mt-8 rounded-3xl border border-white/10 bg-[#0b0f1c] p-6 text-sm text-slate-400">
        {t.noData}
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-white">{t.quickSummary}</h3>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <StatCard
            key={stat.key}
            label={language === "ko" ? stat.labelKo : stat.labelEn}
            description={language === "ko" ? stat.descKo : stat.descEn}
            value={stat.value}
            year={stat.year}
            unit={stat.unit}
            language={language}
          />
        ))}
      </div>
    </div>
  );
}

export default function CountryOfficialDataStack({
  row,
  iso3,
  countryName,
  language,
  includePanels = true,
}: {
  row?: LooseCountryRow | null;
  iso3?: string;
  countryName?: string;
  language?: string;
  includePanels?: boolean;
}) {
  const lang = normalizeLanguage(language);
  const t = getCopy(lang);

  const resolvedIso3 =
    iso3 ??
    getString(row, ["iso3", "cca3", "countryCode", "id"]) ??
    "";

  const iso2 = getString(row, ["iso2", "cca2"]);
  const flag = getFlagEmoji(iso2);

  const resolvedCountryName =
    countryName ??
    getString(row, [
      "name",
      "countryName",
      "displayName",
      "nameEn",
      "officialName",
    ]) ??
    resolvedIso3;

  const displayName = `${flag ? `${flag} ` : ""}${resolvedCountryName}`;

  if (!resolvedIso3) {
    return null;
  }

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 lg:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
            {t.label}
          </p>

          <div className="mt-4 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <h2 className="max-w-4xl text-4xl font-bold leading-tight text-white">
                {displayName} · {t.titleSuffix}
              </h2>

              <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-300">
                {t.subtitle}
              </p>
            </div>

            <div className="grid gap-3">
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                <p className="text-sm font-semibold text-emerald-100">
                  {t.noEstimate}
                </p>
                <p className="mt-2 text-xs leading-5 text-emerald-50/75">
                  {t.noEstimateText}
                </p>
              </div>

              <div className="rounded-2xl border border-blue-400/20 bg-blue-400/10 p-4">
                <p className="text-sm font-semibold text-blue-100">
                  {t.latestRule}
                </p>
                <p className="mt-2 text-xs leading-5 text-blue-50/75">
                  {t.latestRuleText}
                </p>
              </div>
            </div>
          </div>

          <CountrySummaryCards row={row} language={lang} />

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`/compare?a=${resolvedIso3}&b=USA`}
              className="rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-bold text-[#06130d]"
            >
              {t.compare} →
            </a>
            <a
              href="/topics"
              className="rounded-2xl border border-white/10 bg-[#0b0f1c] px-5 py-3 text-sm font-semibold text-white hover:bg-white/[0.07]"
            >
              {t.topics} →
            </a>
          </div>

          <div className="mt-10">
            <h3 className="text-2xl font-bold text-white">{t.layerTitle}</h3>

            <div className="mt-5 grid gap-4 lg:grid-cols-4">
              <DataLayerCard name={t.worldBank} description={t.worldBankDesc} />
              <DataLayerCard name={t.comtrade} description={t.comtradeDesc} />
              <DataLayerCard name={t.eia} description={t.eiaDesc} />
              <DataLayerCard name={t.wits} description={t.witsDesc} />
            </div>
          </div>
        </div>
      </section>

      {includePanels ? (
        <>
          <LatestMonthlyTradePanel
            iso3={resolvedIso3}
            countryName={displayName}
            language={lang}
          />

          <OfficialEnergyPanel
            iso3={resolvedIso3}
            countryName={displayName}
            language={lang}
          />

          <OfficialTariffPanel
            iso3={resolvedIso3}
            countryName={displayName}
            language={lang}
          />
        </>
      ) : null}
    </>
  );
}
