"use client";

import { useEffect, useMemo, useState } from "react";
import type { CountryRow, StatValue } from "@/lib/worldBank";
import RegionalInsightSection from "@/components/RegionalInsightSection";
import HistoricalTrendSection from "@/components/HistoricalTrendSection";
import LatestMonthlyTradePanel from "@/components/LatestMonthlyTradePanel";
import OfficialTariffPanel from "@/components/OfficialTariffPanel";
import { getFlagEmoji } from "@/lib/flags";

type Language = "ko" | "en" | "ja" | "zh" | "es" | "fr" | "de";

type MetricKey =
  | "energyImportPercent"
  | "fuelImportShare"
  | "foodImportShare"
  | "importsGdp"
  | "importUsd"
  | "tariffRate"
  | "logisticsIndex";

const languageLabels: Record<Language, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  zh: "中文",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
};

const enCopy = {
  back: "← Back to main dashboard",
  title: "Country detail",
  subtitle: "Country-level dependency and supply exposure indicators",
  source: "Data source",
  sourceValue: "World Bank API",
  region: "Region",
  income: "Income group",
  incomeOriginal: "World Bank label",
  dataCoverage: "Data coverage",
  latestYear: "Latest data year",
  downloadCsv: "Download country CSV",
  indicators: "Indicators",
  value: "Value",
  year: "Year",
  meaning: "Meaning",
  noData: "No data",
  relatedCountries: "Countries in the same region",
  contact: "Contact",
  disclaimer:
    "This page is for informational purposes only and is not investment, trade, customs, logistics, legal, or policy advice.",
  energy: "Energy net imports",
  fuel: "Fuel import share",
  food: "Food import share",
  importsGdp: "Imports/GDP",
  importsUsd: "Total imports",
  tariff: "Tariff rate",
  logistics: "Logistics index",
  energyDesc:
    "Net energy imports as a share of energy use. Positive values may indicate net import dependence, while negative values may indicate net exports.",
  fuelDesc:
    "Fuel imports as a share of merchandise imports. Higher values suggest greater fuel concentration in imports.",
  foodDesc:
    "Food imports as a share of merchandise imports. This helps indicate exposure to external food supply.",
  importsGdpDesc:
    "Imports of goods and services as a share of GDP. It shows import dependence relative to the size of the economy.",
  importsUsdDesc:
    "Total imports of goods and services in current US dollars. This shows the absolute import scale.",
  tariffDesc:
    "Weighted mean tariff rate on imported goods. Higher values may indicate stronger trade barriers.",
  logisticsDesc:
    "World Bank Logistics Performance Index. Usually ranges from 1 to 5; higher values indicate stronger logistics performance.",
};

const copy: Record<Language, typeof enCopy> = {
  en: enCopy,
  ko: {
    back: "← 메인 대시보드로 돌아가기",
    title: "국가 상세 통계",
    subtitle: "국가별 의존도와 공급망 노출 지표",
    source: "데이터 출처",
    sourceValue: "World Bank API",
    region: "지역",
    income: "소득 그룹",
    incomeOriginal: "World Bank 원문",
    dataCoverage: "데이터 제공 수",
    latestYear: "최신 데이터 연도",
    downloadCsv: "국가 CSV 다운로드",
    indicators: "지표",
    value: "값",
    year: "연도",
    meaning: "의미",
    noData: "데이터 없음",
    relatedCountries: "같은 지역 국가",
    contact: "문의",
    disclaimer:
      "이 페이지는 정보 제공용이며 투자, 무역, 관세, 물류, 법률, 정책 조언이 아닙니다.",
    energy: "에너지 순수입",
    fuel: "연료 수입 비중",
    food: "식량 수입 비중",
    importsGdp: "수입/GDP",
    importsUsd: "총 수입액",
    tariff: "관세율",
    logistics: "물류지수",
    energyDesc:
      "에너지 수입량에서 수출량을 뺀 순수입 비율입니다. 양수는 순수입국, 음수는 순수출국일 수 있습니다.",
    fuelDesc:
      "전체 상품 수입 중 연료가 차지하는 비중입니다. 값이 높을수록 수입 품목에서 연료 의존도가 큽니다.",
    foodDesc:
      "전체 상품 수입 중 식량이 차지하는 비중입니다. 식량 공급망의 외부 의존도를 보는 참고 지표입니다.",
    importsGdpDesc:
      "재화와 서비스 수입액이 GDP에서 차지하는 비율입니다. 경제 규모 대비 수입 의존도를 보여줍니다.",
    importsUsdDesc:
      "해당 국가의 총 재화·서비스 수입액입니다. 절대적인 수입 규모를 비교할 때 사용합니다.",
    tariffDesc:
      "수입 상품에 적용되는 평균 관세율입니다. 값이 높을수록 무역 장벽이 높을 수 있습니다.",
    logisticsDesc:
      "World Bank 물류성과지수입니다. 보통 1~5 범위이며, 값이 높을수록 물류 인프라와 효율성이 좋은 편입니다.",
  },
  ja: enCopy,
  zh: enCopy,
  es: enCopy,
  fr: enCopy,
  de: enCopy,
};

function countryToLanguage(countryCode: string): Language {
  const code = countryCode.toUpperCase();

  if (code === "KR") return "ko";
  if (code === "JP") return "ja";
  if (["CN", "TW", "HK", "MO", "SG"].includes(code)) return "zh";
  if (
    [
      "ES",
      "MX",
      "AR",
      "CL",
      "CO",
      "PE",
      "VE",
      "EC",
      "UY",
      "PY",
      "BO",
      "CR",
      "PA",
      "DO",
      "GT",
      "HN",
      "NI",
      "SV",
    ].includes(code)
  )
    return "es";
  if (["FR", "BE", "CH", "CA", "LU", "MC"].includes(code)) return "fr";
  if (["DE", "AT"].includes(code)) return "de";

  return "en";
}

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

function getIncomeGroupLabel(incomeLevel: string, language: Language) {
  const normalized = incomeLevel.toLowerCase();

  const labelsKo = {
    high: {
      title: "고소득 국가",
      description: "World Bank 기준 고소득 경제권",
    },
    upperMiddle: {
      title: "중상위 소득 국가",
      description: "고소득 직전 단계의 중상위 소득 경제권",
    },
    lowerMiddle: {
      title: "중하위 소득 국가",
      description: "저소득과 중상위 소득 사이의 경제권",
    },
    low: {
      title: "저소득 국가",
      description: "World Bank 기준 저소득 경제권",
    },
    notClassified: {
      title: "소득 분류 없음",
      description: "World Bank 소득 그룹이 지정되지 않음",
    },
  };

  const labelsEn = {
    high: {
      title: "High-income economy",
      description: "World Bank high-income group",
    },
    upperMiddle: {
      title: "Upper-middle-income economy",
      description: "Economies between high and lower-middle income",
    },
    lowerMiddle: {
      title: "Lower-middle-income economy",
      description: "Economies between low and upper-middle income",
    },
    low: {
      title: "Low-income economy",
      description: "World Bank low-income group",
    },
    notClassified: {
      title: "Not classified",
      description: "No World Bank income classification",
    },
  };

  const labels = language === "ko" ? labelsKo : labelsEn;

  if (normalized.includes("high income")) return labels.high;
  if (normalized.includes("upper middle")) return labels.upperMiddle;
  if (normalized.includes("lower middle")) return labels.lowerMiddle;
  if (normalized.includes("low income")) return labels.low;

  return labels.notClassified;
}

function getRowStatList(row: CountryRow) {
  return [
    row.energyImportPercent,
    row.fuelImportShare,
    row.foodImportShare,
    row.importsGdp,
    row.importUsd,
    row.tariffRate,
    row.logisticsIndex,
  ];
}

function getLatestAvailableYear(row: CountryRow) {
  const years = getRowStatList(row)
    .map((stat) => (stat.year ? Number(stat.year) : null))
    .filter((year): year is number => year !== null && !Number.isNaN(year));

  if (years.length === 0) return null;

  return Math.max(...years);
}

function formatValue(stat: StatValue, metric: MetricKey, language: Language) {
  if (stat.value === null) return "—";

  if (metric === "importUsd") {
    return new Intl.NumberFormat(languageToLocale(language), {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(stat.value);
  }

  if (metric === "logisticsIndex") {
    return stat.value.toLocaleString(languageToLocale(language), {
      maximumFractionDigits: 2,
    });
  }

  return `${stat.value.toLocaleString(languageToLocale(language), {
    maximumFractionDigits: 2,
  })}%`;
}

function escapeCsvValue(value: unknown) {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function getMetricRows(t: typeof enCopy) {
  return [
    {
      key: "energyImportPercent" as const,
      label: t.energy,
      description: t.energyDesc,
    },
    {
      key: "fuelImportShare" as const,
      label: t.fuel,
      description: t.fuelDesc,
    },
    {
      key: "foodImportShare" as const,
      label: t.food,
      description: t.foodDesc,
    },
    {
      key: "importsGdp" as const,
      label: t.importsGdp,
      description: t.importsGdpDesc,
    },
    {
      key: "importUsd" as const,
      label: t.importsUsd,
      description: t.importsUsdDesc,
    },
    {
      key: "tariffRate" as const,
      label: t.tariff,
      description: t.tariffDesc,
    },
    {
      key: "logisticsIndex" as const,
      label: t.logistics,
      description: t.logisticsDesc,
    },
  ];
}

export default function CountryDetailClient({
  row,
  rows,
}: {
  row: CountryRow;
  rows: CountryRow[];
}) {
  const [language, setLanguage] = useState<Language>("ko");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    async function initialize() {
      const savedLanguage = localStorage.getItem("dependency-radar-language");

      if (
        savedLanguage === "ko" ||
        savedLanguage === "en" ||
        savedLanguage === "ja" ||
        savedLanguage === "zh" ||
        savedLanguage === "es" ||
        savedLanguage === "fr" ||
        savedLanguage === "de"
      ) {
        setLanguage(savedLanguage);
        setMounted(true);
        return;
      }

      try {
        const response = await fetch("/api/geo");
        const data = await response.json();

        if (data.country) {
          setLanguage(countryToLanguage(data.country));
        }
      } catch {
        setLanguage("en");
      }

      setMounted(true);
    }

    initialize();
  }, []);

  function changeLanguage(nextLanguage: Language) {
    setLanguage(nextLanguage);
    localStorage.setItem("dependency-radar-language", nextLanguage);
  }

  const t = copy[language];
  const income = getIncomeGroupLabel(row.incomeLevel, language);
  const metricRows = getMetricRows(t);

  const relatedRows = useMemo(() => {
    return rows
      .filter((item) => item.region === row.region && item.iso3 !== row.iso3)
      .sort((a, b) => b.dataCompleteness - a.dataCompleteness)
      .slice(0, 8);
  }, [rows, row]);

  function downloadCountryCsv() {
    const headers = [
      "Country",
      "Original country name",
      "ISO2",
      "ISO3",
      "Region",
      "Income group",
      "Income group original",
      "Indicator",
      "Value",
      "Year",
      "Source",
    ];

    const csvRows = metricRows.map((metric) => {
      const stat = row[metric.key];

      return [
        getLocalizedCountryName(row, language),
        row.name,
        row.iso2,
        row.iso3,
        row.region,
        income.title,
        row.incomeLevel,
        metric.label,
        stat.value ?? "",
        stat.year ?? "",
        "World Bank API",
      ];
    });

    const csv =
      "\uFEFF" +
      [headers, ...csvRows]
        .map((csvRow) => csvRow.map(escapeCsvValue).join(","))
        .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `dependency-radar-${row.iso3}-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  if (!mounted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070914] text-white">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
          <p className="text-xl font-bold">Dependency Radar</p>
          <p className="mt-3 text-sm text-slate-400">Preparing country data.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070914] text-white">
      <header className="border-b border-white/10 bg-[#070914]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <a href="/" className="text-lg font-bold hover:text-indigo-200">
              Dependency Radar
            </a>
            <p className="text-xs text-slate-400">{t.subtitle}</p>
          </div>

          <select
            value={language}
            onChange={(event) => changeLanguage(event.target.value as Language)}
            className="rounded-full border border-white/15 bg-[#111524] px-4 py-2 text-sm text-white outline-none"
          >
            {Object.entries(languageLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <a href="/" className="text-sm text-indigo-300 hover:text-white">
          {t.back}
        </a>

        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-300">{t.title}</p>
            <h1 className="mt-3 text-5xl font-bold tracking-tight">
              {getFlagEmoji(row.iso2)} {getLocalizedCountryName(row, language)}
            </h1>
            <p className="mt-3 text-slate-400">
              {row.name} · {row.iso2} · {row.iso3}
            </p>
          </div>

          <button
            onClick={downloadCountryCsv}
            className="rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-400"
          >
            {t.downloadCsv}
          </button>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">{t.region}</p>
            <p className="mt-2 text-xl font-bold">{row.region}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">{t.income}</p>
            <p className="mt-2 text-xl font-bold">{income.title}</p>
            <p className="mt-2 text-xs text-slate-500">{income.description}</p>
            <p className="mt-2 text-xs text-slate-600">
              {t.incomeOriginal}: {row.incomeLevel}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">{t.dataCoverage}</p>
            <p className="mt-2 text-xl font-bold">{row.dataCompleteness} / 7</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">{t.latestYear}</p>
            <p className="mt-2 text-xl font-bold">
              {getLatestAvailableYear(row) ?? "—"}
            </p>
          </div>
        </div>
      </section>



      <LatestMonthlyTradePanel
        iso3={row.iso3}
        countryName={`${getFlagEmoji(row.iso2)} ${getLocalizedCountryName(row, language)}`}
        language={language}
      />
      <OfficialTariffPanel
        iso3={row.iso3}
        countryName={`${getFlagEmoji(row.iso2)} ${getLocalizedCountryName(row, language)}`}
        language={language}
      />

      <HistoricalTrendSection
        iso3={row.iso3}
        countryName={`${getFlagEmoji(row.iso2)} ${getLocalizedCountryName(row, language)}`}
        language={language}
      />

      <RegionalInsightSection row={row} rows={rows} language={language} />

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-bold">{t.indicators}</h2>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="bg-white/[0.06] text-slate-400">
                <tr>
                  <th className="px-5 py-4">{t.indicators}</th>
                  <th className="px-5 py-4">{t.value}</th>
                  <th className="px-5 py-4">{t.year}</th>
                  <th className="px-5 py-4">{t.meaning}</th>
                </tr>
              </thead>
              <tbody>
                {metricRows.map((metric) => {
                  const stat = row[metric.key];

                  return (
                    <tr key={metric.key} className="border-t border-white/10">
                      <td className="px-5 py-4 font-semibold">
                        {metric.label}
                      </td>
                      <td className="px-5 py-4">
                        {formatValue(stat, metric.key, language)}
                      </td>
                      <td className="px-5 py-4 text-slate-400">
                        {stat.year ?? t.noData}
                      </td>
                      <td className="px-5 py-4 text-slate-400">
                        {metric.description}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            {t.source}: {t.sourceValue}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-bold">{t.relatedCountries}</h2>

          <div className="mt-5 grid gap-3 md:grid-cols-4">
            {relatedRows.map((related) => (
              <a
                key={related.iso3}
                href={`/country/${related.iso3}`}
                className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-4 hover:border-indigo-300/40 hover:bg-indigo-400/10"
              >
                <p className="font-semibold">
                  {getFlagEmoji(related.iso2)} {getLocalizedCountryName(related, language)}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {related.name} · {related.iso3}
                </p>
                <p className="mt-3 text-xs text-slate-400">
                  {t.dataCoverage}: {related.dataCompleteness} / 7
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-7xl border-t border-white/10 px-6 py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm text-slate-400">{t.disclaimer}</p>

            <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
              <a href="/sources" className="hover:text-white">
                Data Sources
              </a>
              <a href="/privacy" className="hover:text-white">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-white">
                Terms of Use
              </a>
              <a href="/disclaimer" className="hover:text-white">
                Disclaimer
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
            <p className="text-xs text-slate-500">{t.contact}</p>
            <a
              href="mailto:kevinsmp123@gmail.com"
              className="text-lg font-semibold text-indigo-200 hover:text-white"
            >
              kevinsmp123@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
