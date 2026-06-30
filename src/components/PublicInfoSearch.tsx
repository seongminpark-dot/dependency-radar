"use client";

import { useMemo, useState } from "react";
import type { CountryRow } from "@/lib/worldBank";
import { getFlagEmoji } from "@/lib/flags";

type Language = "ko" | "en" | "ja" | "zh" | "es" | "fr" | "de";

type AnyRow = CountryRow & Record<string, any>;

const copy = {
  ko: {
    label: "Find country data",
    title: "국가를 검색해 무역, 에너지, 관세 의존도를 빠르게 확인하세요.",
    subtitle:
      "국가명이나 ISO 코드를 입력하면 국가별 상세 페이지로 바로 이동할 수 있습니다. 일반 방문자는 먼저 검색하고, 필요한 경우 지도와 표로 비교하면 됩니다.",
    placeholder: "예: 대한민국, Korea, KOR, United States, USA",
    popular: "인기 국가 바로가기",
    results: "검색 결과",
    noResults: "검색 결과가 없습니다.",
    open: "상세 보기",
    quickRankings: "빠른 비교",
    fuel: "연료 수입 비중이 높은 국가",
    food: "식량 수입 비중이 높은 국가",
    importsGdp: "수입/GDP 비중이 높은 국가",
    tariff: "관세율이 높은 국가",
    latestYear: "제공 연도",
    dataNote:
      "표시값은 각 공식 출처가 제공하는 최신 연도 기준입니다. 2026 값이 없으면 2025, 2024 또는 해당 지표의 최신 제공 연도가 표시됩니다.",
  },
  en: {
    label: "Find country data",
    title: "Search a country to check trade, energy, and tariff dependency quickly.",
    subtitle:
      "Enter a country name or ISO code to open a country detail page. Start with search, then use the map and table for comparison.",
    placeholder: "Example: Korea, KOR, United States, USA, Japan",
    popular: "Popular country shortcuts",
    results: "Search results",
    noResults: "No matching countries found.",
    open: "Open details",
    quickRankings: "Quick comparisons",
    fuel: "High fuel import share",
    food: "High food import share",
    importsGdp: "High imports/GDP",
    tariff: "High tariff rate",
    latestYear: "Source year",
    dataNote:
      "Values use the latest year available from each official source. If 2026 is unavailable, the site uses 2025, 2024, or the latest available source year.",
  },
};

const quickCodes = ["KOR", "USA", "JPN", "CHN", "DEU", "GBR", "FRA", "IND"];

const rankingConfig = [
  {
    key: "fuelImportShare",
    ko: "연료 수입 비중이 높은 국가",
    en: "High fuel import share",
    type: "percent",
  },
  {
    key: "foodImportShare",
    ko: "식량 수입 비중이 높은 국가",
    en: "High food import share",
    type: "percent",
  },
  {
    key: "importsGdp",
    ko: "수입/GDP 비중이 높은 국가",
    en: "High imports/GDP",
    type: "percent",
  },
  {
    key: "tariffRate",
    ko: "관세율이 높은 국가",
    en: "High tariff rate",
    type: "percent",
  },
];

function getName(row: AnyRow) {
  return String(row.name ?? row.countryName ?? row.displayName ?? row.iso3 ?? "");
}

function getRegion(row: AnyRow) {
  return String(row.region ?? row.regionName ?? "");
}

function getIso3(row: AnyRow) {
  return String(row.iso3 ?? "").toUpperCase();
}

function getIso2(row: AnyRow) {
  return String(row.iso2 ?? "").toUpperCase();
}

function getStat(row: AnyRow, key: string) {
  const stat = row[key];

  if (!stat || typeof stat !== "object") return null;

  const value = Number(stat.value);
  const year = stat.year ? String(stat.year) : "";

  if (Number.isNaN(value)) return null;

  return {
    value,
    year,
  };
}

function formatValue(value: number, language: Language) {
  return `${value.toLocaleString(language === "ko" ? "ko-KR" : "en-US", {
    maximumFractionDigits: 2,
  })}%`;
}

function rankingRows(rows: AnyRow[], key: string) {
  return [...rows]
    .map((row) => {
      const stat = getStat(row, key);

      return {
        row,
        stat,
      };
    })
    .filter((item): item is { row: AnyRow; stat: { value: number; year: string } } =>
      Boolean(item.stat)
    )
    .sort((a, b) => b.stat.value - a.stat.value)
    .slice(0, 3);
}

function CountryPill({ row }: { row: AnyRow }) {
  const iso2 = getIso2(row);
  const iso3 = getIso3(row);
  const name = getName(row);

  return (
    <a
      href={`/country/${iso3}`}
      className="rounded-2xl border border-white/10 bg-[#0b0f1c] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.07]"
    >
      <span className="mr-2">{getFlagEmoji(iso2)}</span>
      {name}
      <span className="ml-2 text-xs text-slate-500">{iso3}</span>
    </a>
  );
}

function RankingCard({
  title,
  rows,
  language,
}: {
  title: string;
  rows: {
    row: AnyRow;
    stat: {
      value: number;
      year: string;
    };
  }[];
  language: Language;
}) {
  const t = language === "ko" ? copy.ko : copy.en;

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0b0f1c] p-5">
      <p className="text-sm font-semibold text-white">{title}</p>

      <div className="mt-4 space-y-3">
        {rows.map((item, index) => {
          const iso2 = getIso2(item.row);
          const iso3 = getIso3(item.row);
          const name = getName(item.row);

          return (
            <a
              key={`${title}-${iso3}`}
              href={`/country/${iso3}`}
              className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 transition hover:bg-white/[0.08]"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  #{index + 1} {getFlagEmoji(iso2)} {name}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {iso3} · {t.latestYear}: {item.stat.year || "—"}
                </p>
              </div>

              <p className="shrink-0 text-sm font-bold text-indigo-200">
                {formatValue(item.stat.value, language)}
              </p>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default function PublicInfoSearch({
  rows,
  language,
}: {
  rows: CountryRow[];
  language: Language;
}) {
  const [query, setQuery] = useState("");
  const t = language === "ko" ? copy.ko : copy.en;
  const normalizedRows = rows as AnyRow[];

  const quickCountries = useMemo(() => {
    return quickCodes
      .map((code) => normalizedRows.find((row) => getIso3(row) === code))
      .filter(Boolean) as AnyRow[];
  }, [normalizedRows]);

  const searchResults = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) return [];

    return normalizedRows
      .filter((row) => {
        const haystack = [
          getName(row),
          getIso2(row),
          getIso3(row),
          getRegion(row),
          String(row.incomeLevel ?? ""),
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(value);
      })
      .slice(0, 8);
  }, [query, normalizedRows]);

  const rankings = useMemo(() => {
    return rankingConfig.map((config) => ({
      ...config,
      rows: rankingRows(normalizedRows, config.key),
    }));
  }, [normalizedRows]);

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16">
      <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.025] p-6 lg:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
          {t.label}
        </p>

        <div className="mt-4 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <h2 className="max-w-4xl text-4xl font-bold leading-tight text-white">
              {t.title}
            </h2>

            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
              {t.subtitle}
            </p>

            <div className="mt-6">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.placeholder}
                className="w-full rounded-2xl border border-white/10 bg-[#0b0f1c] px-5 py-4 text-base font-medium text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/70 focus:ring-4 focus:ring-emerald-400/10"
              />
            </div>

            <div className="mt-5 rounded-2xl border border-blue-400/20 bg-blue-400/10 p-4 text-sm leading-6 text-blue-50/80">
              {t.dataNote}
            </div>

            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-slate-300">
                {query ? t.results : t.popular}
              </p>

              {query ? (
                searchResults.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {searchResults.map((row) => (
                      <a
                        key={getIso3(row)}
                        href={`/country/${getIso3(row)}`}
                        className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-4 transition hover:bg-white/[0.07]"
                      >
                        <p className="text-base font-bold text-white">
                          {getFlagEmoji(getIso2(row))} {getName(row)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {getIso3(row)} · {getRegion(row)}
                        </p>
                        <p className="mt-3 text-sm font-semibold text-indigo-300">
                          {t.open} →
                        </p>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-4 text-sm text-slate-400">
                    {t.noResults}
                  </div>
                )
              ) : (
                <div className="flex flex-wrap gap-3">
                  {quickCountries.map((row) => (
                    <CountryPill key={getIso3(row)} row={row} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-slate-300">
              {t.quickRankings}
            </p>

            <div className="grid gap-4">
              {rankings.map((ranking) => (
                <RankingCard
                  key={ranking.key}
                  title={language === "ko" ? ranking.ko : ranking.en}
                  rows={ranking.rows}
                  language={language}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
