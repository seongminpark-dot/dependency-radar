"use client";

import { useMemo, useState } from "react";
import type { CountryRow } from "@/lib/worldBank";
import { getFlagEmoji } from "@/lib/flags";

type Language = "ko" | "en" | "ja" | "zh" | "es" | "fr" | "de";
type AnyRow = CountryRow & Record<string, unknown>;

const quickCountryCodes = ["KOR", "USA", "JPN", "CHN", "DEU", "GBR", "FRA", "IND"];

const topicLinks = [
  {
    href: "/topics/fuel-import-dependency",
    ko: "연료 수입 의존도",
    en: "Fuel imports",
  },
  {
    href: "/topics/food-import-dependency",
    ko: "식량 수입 의존도",
    en: "Food imports",
  },
  {
    href: "/topics/imports-gdp",
    ko: "수입/GDP",
    en: "Imports/GDP",
  },
  {
    href: "/topics/tariff-rate",
    ko: "관세율",
    en: "Tariffs",
  },
  {
    href: "/topics/energy-statistics",
    ko: "에너지 통계",
    en: "Energy",
  },
];

const compareLinks = [
  {
    href: "/compare?a=KOR&b=USA",
    ko: "한국 vs 미국",
    en: "Korea vs USA",
  },
  {
    href: "/compare?a=KOR&b=JPN",
    ko: "한국 vs 일본",
    en: "Korea vs Japan",
  },
  {
    href: "/compare?a=USA&b=CHN",
    ko: "미국 vs 중국",
    en: "USA vs China",
  },
];

const copy = {
  ko: {
    label: "Start here",
    title: "국가를 검색하거나, 주제별 통계를 바로 확인하세요.",
    subtitle:
      "무역, 에너지, 관세, 수입 의존도 지표를 공식 데이터 기준으로 빠르게 탐색할 수 있습니다.",
    searchPlaceholder: "예: 대한민국, Korea, KOR, United States, USA",
    popularCountries: "인기 국가",
    searchResults: "검색 결과",
    noResults: "검색 결과가 없습니다.",
    openCountry: "국가 상세 보기",
    topicsTitle: "주제별 통계",
    topicsDesc: "관심 있는 지표부터 바로 확인합니다.",
    compareTitle: "국가 간 비교",
    compareDesc: "두 국가를 선택해 핵심 지표를 한 화면에서 비교합니다.",
    sourcesTitle: "공식 출처와 방법론",
    sourcesDesc: "데이터 출처와 최신성 기준을 확인합니다.",
    allTopics: "모든 주제 보기",
    compareNow: "국가 비교하기",
    sources: "출처 보기",
    methodology: "방법론 보기",
  },
  en: {
    label: "Start here",
    title: "Search a country or explore statistics by topic.",
    subtitle:
      "Quickly check official trade, energy, tariff, logistics, and dependency indicators.",
    searchPlaceholder: "Example: Korea, KOR, United States, USA, Japan",
    popularCountries: "Popular countries",
    searchResults: "Search results",
    noResults: "No matching countries found.",
    openCountry: "Open country page",
    topicsTitle: "Explore by topic",
    topicsDesc: "Start from the indicator you care about.",
    compareTitle: "Compare countries",
    compareDesc: "Compare key indicators between two countries.",
    sourcesTitle: "Sources and methodology",
    sourcesDesc: "Check data sources and freshness rules.",
    allTopics: "View all topics",
    compareNow: "Compare now",
    sources: "Sources",
    methodology: "Methodology",
  },
};

function getIso3(row: AnyRow) {
  return String(row.iso3 ?? row.cca3 ?? row.countryiso3code ?? "").toUpperCase();
}

function getIso2(row: AnyRow) {
  return String(row.iso2 ?? row.cca2 ?? "").toUpperCase();
}

function getName(row: AnyRow) {
  return String(
    row.name ??
      row.countryName ??
      row.displayName ??
      row.nameEn ??
      row.officialName ??
      getIso3(row)
  );
}

function getRegion(row: AnyRow) {
  return String(row.region ?? row.regionName ?? row.incomeLevel ?? "");
}

function CountryLink({ row }: { row: AnyRow }) {
  const iso3 = getIso3(row);
  const iso2 = getIso2(row);
  const name = getName(row);
  const region = getRegion(row);

  return (
    <a
      href={`/country/${iso3}`}
      className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-4 transition hover:bg-white/[0.07]"
    >
      <p className="truncate text-base font-bold text-white">
        {getFlagEmoji(iso2)} {name}
      </p>
      <p className="mt-1 truncate text-xs text-slate-500">
        {iso3}
        {region ? ` · ${region}` : ""}
      </p>
    </a>
  );
}

function SmallLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="rounded-2xl border border-white/10 bg-[#0b0f1c] px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/[0.07]"
    >
      {children}
    </a>
  );
}

export default function HomeActionHub({
  rows,
  language,
}: {
  rows: CountryRow[];
  language: Language;
}) {
  const [query, setQuery] = useState("");
  const isKo = language === "ko";
  const t = isKo ? copy.ko : copy.en;
  const data = rows as AnyRow[];

  const quickCountries = useMemo(() => {
    return quickCountryCodes
      .map((code) => data.find((row) => getIso3(row) === code))
      .filter(Boolean) as AnyRow[];
  }, [data]);

  const searchResults = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) return [];

    return data
      .filter((row) => {
        const haystack = [
          getName(row),
          getIso3(row),
          getIso2(row),
          getRegion(row),
          String(row.incomeLevel ?? ""),
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(value);
      })
      .slice(0, 8);
  }, [query, data]);

  return (
    <section id="country-search" className="mx-auto max-w-7xl px-6 pb-14">
      <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.075] to-white/[0.025] p-6 shadow-2xl shadow-black/20 lg:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
          {t.label}
        </p>

        <div className="mt-4 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
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
                placeholder={t.searchPlaceholder}
                className="w-full rounded-2xl border border-white/10 bg-[#0b0f1c] px-5 py-4 text-base font-medium text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/70 focus:ring-4 focus:ring-emerald-400/10"
              />
            </div>

            <div className="mt-5">
              <p className="mb-3 text-sm font-semibold text-slate-300">
                {query ? t.searchResults : t.popularCountries}
              </p>

              {query ? (
                searchResults.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {searchResults.map((row) => (
                      <CountryLink key={getIso3(row)} row={row} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-4 text-sm text-slate-400">
                    {t.noResults}
                  </div>
                )
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {quickCountries.map((row) => (
                    <CountryLink key={getIso3(row)} row={row} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5">
              <p className="text-lg font-bold text-white">{t.topicsTitle}</p>
              <p className="mt-2 text-sm leading-6 text-cyan-50/75">
                {t.topicsDesc}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {topicLinks.map((topic) => (
                  <SmallLink key={topic.href} href={topic.href}>
                    {isKo ? topic.ko : topic.en}
                  </SmallLink>
                ))}
              </div>

              <a
                href="/topics"
                className="mt-4 inline-flex rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-bold text-[#06131a]"
              >
                {t.allTopics} →
              </a>
            </div>

            <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
              <p className="text-lg font-bold text-white">{t.compareTitle}</p>
              <p className="mt-2 text-sm leading-6 text-emerald-50/75">
                {t.compareDesc}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {compareLinks.map((item) => (
                  <SmallLink key={item.href} href={item.href}>
                    {isKo ? item.ko : item.en}
                  </SmallLink>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href="/compare?a=KOR&b=USA"
                  className="inline-flex rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-bold text-[#06130d]"
                >
                  {t.compareNow} →
                </a>
                <a
                  href="/challenge"
                  className="inline-flex rounded-2xl border border-white/10 bg-[#0b0f1c] px-4 py-3 text-sm font-semibold text-white hover:bg-white/[0.07]"
                >
                  {isKo ? "데이터 챌린지" : "Data Challenge"} →
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-indigo-400/20 bg-indigo-400/10 p-5">
              <p className="text-lg font-bold text-white">{t.sourcesTitle}</p>
              <p className="mt-2 text-sm leading-6 text-indigo-50/75">
                {t.sourcesDesc}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <SmallLink href="/sources">{t.sources}</SmallLink>
                <SmallLink href="/methodology">{t.methodology}</SmallLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
