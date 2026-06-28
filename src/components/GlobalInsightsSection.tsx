"use client";

import type { CountryRow } from "@/lib/worldBank";

type Language = "ko" | "en" | "ja" | "zh" | "es" | "fr" | "de";

type MetricKey =
  | "energyImportPercent"
  | "fuelImportShare"
  | "foodImportShare"
  | "importsGdp"
  | "importUsd"
  | "tariffRate"
  | "logisticsIndex";

const enCopy = {
  sectionLabel: "Global Insights",
  title: "Global dependency snapshot",
  subtitle:
    "A quick ranking view of the countries with the highest values for each major indicator.",
  note:
    "Higher values do not always mean better or worse performance. Each indicator should be interpreted with its definition and context.",
  energyTitle: "Highest energy net imports",
  energyDesc:
    "Countries with the highest positive net energy import values.",
  fuelTitle: "Highest fuel import share",
  fuelDesc:
    "Countries where fuel takes a large share of merchandise imports.",
  foodTitle: "Highest food import share",
  foodDesc:
    "Countries where food takes a large share of merchandise imports.",
  importsGdpTitle: "Highest imports/GDP",
  importsGdpDesc:
    "Countries with high import exposure relative to the size of their economy.",
  importUsdTitle: "Largest total imports",
  importUsdDesc:
    "Countries with the largest total imports of goods and services.",
  tariffTitle: "Highest tariff rate",
  tariffDesc:
    "Countries with higher weighted mean tariff rates.",
  logisticsTitle: "Strongest logistics index",
  logisticsDesc:
    "Countries with higher World Bank logistics performance scores.",
  source: "Data source",
  sourceValue: "World Bank API",
  viewDetail: "View detail",
  noData: "No data",
};

const copy: Record<Language, typeof enCopy> = {
  en: enCopy,
  ko: {
    sectionLabel: "Global Insights",
    title: "글로벌 핵심 인사이트",
    subtitle:
      "주요 지표별로 값이 높은 국가를 빠르게 확인할 수 있는 요약 랭킹입니다.",
    note:
      "값이 높다고 항상 좋거나 나쁘다는 의미는 아닙니다. 각 지표의 정의와 국가별 맥락을 함께 해석해야 합니다.",
    energyTitle: "에너지 순수입 상위 국가",
    energyDesc:
      "에너지 순수입 값이 높은 국가입니다. 외부 에너지 공급 의존도를 볼 때 참고할 수 있습니다.",
    fuelTitle: "연료 수입 비중 상위 국가",
    fuelDesc:
      "전체 상품 수입 중 연료가 큰 비중을 차지하는 국가입니다.",
    foodTitle: "식량 수입 비중 상위 국가",
    foodDesc:
      "전체 상품 수입 중 식량이 큰 비중을 차지하는 국가입니다.",
    importsGdpTitle: "수입/GDP 상위 국가",
    importsGdpDesc:
      "경제 규모 대비 수입 비중이 높은 국가입니다.",
    importUsdTitle: "총 수입액 상위 국가",
    importUsdDesc:
      "재화와 서비스 총 수입액이 큰 국가입니다.",
    tariffTitle: "관세율 상위 국가",
    tariffDesc:
      "수입 상품에 적용되는 평균 관세율이 높은 국가입니다.",
    logisticsTitle: "물류지수 상위 국가",
    logisticsDesc:
      "World Bank 물류성과지수가 높은 국가입니다.",
    source: "데이터 출처",
    sourceValue: "World Bank API",
    viewDetail: "상세 보기",
    noData: "데이터 없음",
  },
  ja: enCopy,
  zh: enCopy,
  es: enCopy,
  fr: enCopy,
  de: enCopy,
};

function languageToLocale(language: Language) {
  const map: Record<Language, string> = {
    ko: "ko-KR",
    en: "en-US",
    ja: "ja-JP",
    zh: "zh-CN",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
  };

  return map[language];
}

function getLocalizedCountryName(row: CountryRow, language: Language) {
  try {
    const displayNames = new Intl.DisplayNames([languageToLocale(language)], {
      type: "region",
    });

    return displayNames.of(row.iso2) ?? row.name;
  } catch {
    return row.name;
  }
}

function formatValue(value: number, metric: MetricKey, language: Language) {
  if (metric === "importUsd") {
    return new Intl.NumberFormat(languageToLocale(language), {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(value);
  }

  if (metric === "logisticsIndex") {
    return value.toLocaleString(languageToLocale(language), {
      maximumFractionDigits: 2,
    });
  }

  return `${value.toLocaleString(languageToLocale(language), {
    maximumFractionDigits: 2,
  })}%`;
}

function getTopRows(rows: CountryRow[], metric: MetricKey) {
  return [...rows]
    .filter((row) => {
      const value = row[metric].value;
      return value !== null && !Number.isNaN(value);
    })
    .sort((a, b) => {
      return (b[metric].value ?? 0) - (a[metric].value ?? 0);
    })
    .slice(0, 5);
}

export default function GlobalInsightsSection({
  rows,
  language,
}: {
  rows: CountryRow[];
  language: Language;
}) {
  const t = copy[language];

  const cards: {
    key: MetricKey;
    title: string;
    description: string;
  }[] = [
    {
      key: "energyImportPercent",
      title: t.energyTitle,
      description: t.energyDesc,
    },
    {
      key: "fuelImportShare",
      title: t.fuelTitle,
      description: t.fuelDesc,
    },
    {
      key: "foodImportShare",
      title: t.foodTitle,
      description: t.foodDesc,
    },
    {
      key: "importsGdp",
      title: t.importsGdpTitle,
      description: t.importsGdpDesc,
    },
    {
      key: "importUsd",
      title: t.importUsdTitle,
      description: t.importUsdDesc,
    },
    {
      key: "tariffRate",
      title: t.tariffTitle,
      description: t.tariffDesc,
    },
    {
      key: "logisticsIndex",
      title: t.logisticsTitle,
      description: t.logisticsDesc,
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16">
      <div className="mb-6">
        <p className="text-sm font-medium text-indigo-300">
          {t.sectionLabel}
        </p>
        <h2 className="mt-2 text-3xl font-bold">{t.title}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
          {t.subtitle}
        </p>
        <p className="mt-3 max-w-3xl text-xs leading-5 text-slate-500">
          {t.note}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {cards.map((card) => {
          const topRows = getTopRows(rows, card.key);

          return (
            <div
              key={card.key}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
            >
              <div className="mb-4">
                <h3 className="text-lg font-bold">{card.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  {card.description}
                </p>
              </div>

              <div className="space-y-3">
                {topRows.length === 0 ? (
                  <p className="text-sm text-slate-500">{t.noData}</p>
                ) : (
                  topRows.map((row, index) => {
                    const stat = row[card.key];
                    const value = stat.value;

                    return (
                      <a
                        key={row.iso3}
                        href={`/country/${row.iso3}`}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#0b0f1c] px-4 py-3 hover:border-indigo-300/40 hover:bg-indigo-400/10"
                      >
                        <div>
                          <p className="text-sm font-semibold">
                            #{index + 1}{" "}
                            {getLocalizedCountryName(row, language)}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {row.name} · {row.iso3}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-bold text-white">
                            {value !== null
                              ? formatValue(value, card.key, language)
                              : "—"}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {stat.year ?? t.noData}
                          </p>
                        </div>
                      </a>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-xs text-slate-500">
        {t.source}: {t.sourceValue}
      </p>
    </section>
  );
}
