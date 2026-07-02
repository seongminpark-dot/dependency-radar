"use client";

import { useMemo, useState } from "react";
import type { CountryRow } from "@/lib/worldBank";
import { getFlagEmoji } from "@/lib/flags";

type Language = "ko" | "en" | "ja" | "zh" | "es" | "fr" | "de";
type AnyRow = CountryRow & Record<string, unknown>;

const quickCountryCodes = ["KOR", "USA", "JPN", "CHN", "DEU", "IND", "GBR", "FRA"];

const topicLinks = [
  {
    href: "/topics/fuel-import-dependency",
    ko: "연료 수입",
    en: "Fuel imports",
  },
  {
    href: "/topics/food-import-dependency",
    ko: "식량 수입",
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
    ko: "에너지",
    en: "Energy",
  },
];

const copy = {
  ko: {
    label: "Country Data Search",
    title: "국가를 검색하고 공식 지표를 바로 확인하세요.",
    subtitle:
      "국가별 무역, 에너지, 식량, 관세, 물류, 수입 의존도 데이터를 빠르게 열람할 수 있습니다.",
    searchPlaceholder: "국가명 또는 ISO 코드 입력: Korea, KOR, United States, USA",
    searchHint: "Enter를 누르면 첫 번째 검색 결과로 이동합니다.",
    popularCountries: "빠른 국가 링크",
    searchResults: "검색 결과",
    noResults: "검색 결과가 없습니다. 영문명 또는 ISO 코드를 입력해 보세요.",
    openCountry: "국가 페이지 열기",
    newsTitle: "Latest News",
    newsDesc: "최신 글로벌 뉴스와 관련 이슈를 확인합니다.",
    issuesTitle: "Issue Briefs",
    issuesDesc: "Oil, Food, Tariff, Supply Chain 이슈를 공식 지표로 봅니다.",
    compareTitle: "Compare",
    compareDesc: "두 국가의 핵심 지표를 한 화면에서 비교합니다.",
    topicsTitle: "Topics",
    topicsDesc: "관심 있는 지표부터 바로 탐색합니다.",
    openNews: "뉴스 보기",
    openIssues: "이슈 보기",
    openCompare: "비교하기",
    openTopics: "주제 보기",
  },
  en: {
    label: "Country Data Search",
    title: "Search countries and open official indicators instantly.",
    subtitle:
      "Explore trade, energy, food, tariff, logistics, and import-dependency indicators by country.",
    searchPlaceholder: "Type a country or ISO code: Korea, KOR, United States, USA",
    searchHint: "Press Enter to open the first matching country.",
    popularCountries: "Quick country links",
    searchResults: "Search results",
    noResults: "No matching countries. Try an English name or ISO code.",
    openCountry: "Open country page",
    newsTitle: "Latest News",
    newsDesc: "Open current global news linked to Datlora issue briefs.",
    issuesTitle: "Issue Briefs",
    issuesDesc: "Read oil, food, tariff, and supply-chain briefs with official data.",
    compareTitle: "Compare",
    compareDesc: "Compare key indicators between two countries.",
    topicsTitle: "Topics",
    topicsDesc: "Start from the indicator you care about.",
    openNews: "View news",
    openIssues: "View issues",
    openCompare: "Compare",
    openTopics: "View topics",
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

function getIncomeLevel(row: AnyRow) {
  return String(row.incomeLevel ?? "");
}

function CountryCard({ row, label }: { row: AnyRow; label?: string }) {
  const iso3 = getIso3(row);
  const iso2 = getIso2(row);
  const name = getName(row);
  const region = getRegion(row);

  return (
    <a
      href={`/country/${iso3}`}
      className="group rounded-2xl border border-white/10 bg-slate-950/70 p-4 transition hover:-translate-y-0.5 hover:border-emerald-300/40 hover:bg-white/[0.06]"
    >
      {label ? (
        <p className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-300">
          {label}
        </p>
      ) : null}

      <p className="truncate text-base font-black text-white">
        {getFlagEmoji(iso2)} {name}
      </p>

      <p className="mt-1 truncate text-xs font-semibold text-slate-500">
        {iso3}
        {region ? ` · ${region}` : ""}
      </p>
    </a>
  );
}

function ActionCard({
  href,
  title,
  description,
  cta,
  tone,
}: {
  href: string;
  title: string;
  description: string;
  cta: string;
  tone: "emerald" | "cyan" | "blue" | "violet";
}) {
  const toneClass =
    tone === "emerald"
      ? "border-emerald-300/20 bg-emerald-300/10 hover:border-emerald-300/45"
      : tone === "cyan"
        ? "border-cyan-300/20 bg-cyan-300/10 hover:border-cyan-300/45"
        : tone === "blue"
          ? "border-blue-300/20 bg-blue-300/10 hover:border-blue-300/45"
          : "border-violet-300/20 bg-violet-300/10 hover:border-violet-300/45";

  return (
    <a
      href={href}
      className={`rounded-3xl border p-5 transition hover:-translate-y-0.5 ${toneClass}`}
    >
      <strong className="block text-lg font-black text-white">{title}</strong>
      <span className="mt-2 block text-sm leading-6 text-slate-300">
        {description}
      </span>
      <span className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-black text-slate-950">
        {cta} →
      </span>
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
          getIncomeLevel(row),
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(value);
      })
      .slice(0, 8);
  }, [query, data]);

  function openFirstResult() {
    const first = searchResults[0];

    if (!first) return;

    window.location.href = `/country/${getIso3(first)}`;
  }

  return (
    <section id="country-search" className="mx-auto max-w-7xl px-6 pb-14">
      <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.075] to-white/[0.025] p-6 shadow-2xl shadow-black/20 lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.26em] text-emerald-300">
              {t.label}
            </p>

            <h2 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-[-0.06em] text-white md:text-5xl">
              {t.title}
            </h2>

            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
              {t.subtitle}
            </p>

            <div className="mt-6 rounded-[1.5rem] border border-emerald-300/20 bg-slate-950/80 p-3 shadow-xl shadow-black/20">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    openFirstResult();
                  }
                }}
                placeholder={t.searchPlaceholder}
                className="w-full rounded-2xl border border-white/10 bg-[#0b0f1c] px-5 py-4 text-base font-bold text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/70 focus:ring-4 focus:ring-emerald-400/10"
              />

              <p className="mt-3 px-2 text-xs font-semibold text-slate-500">
                {t.searchHint}
              </p>
            </div>

            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-black text-slate-200">
                  {query ? t.searchResults : t.popularCountries}
                </p>

                {query && searchResults[0] ? (
                  <a
                    href={`/country/${getIso3(searchResults[0])}`}
                    className="text-xs font-black text-emerald-300 hover:text-emerald-200"
                  >
                    {t.openCountry} →
                  </a>
                ) : null}
              </div>

              {query ? (
                searchResults.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {searchResults.map((row, index) => (
                      <CountryCard
                        key={getIso3(row)}
                        row={row}
                        label={index === 0 ? "Best match" : undefined}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-5 text-sm font-semibold text-slate-400">
                    {t.noResults}
                  </div>
                )
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {quickCountries.map((row) => (
                    <CountryCard key={getIso3(row)} row={row} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4">
            <ActionCard
              href="/news"
              title={t.newsTitle}
              description={t.newsDesc}
              cta={t.openNews}
              tone="emerald"
            />

            <ActionCard
              href="/issues"
              title={t.issuesTitle}
              description={t.issuesDesc}
              cta={t.openIssues}
              tone="cyan"
            />

            <ActionCard
              href="/compare?a=KOR&b=USA"
              title={t.compareTitle}
              description={t.compareDesc}
              cta={t.openCompare}
              tone="blue"
            />

            <div className="rounded-3xl border border-violet-300/20 bg-violet-300/10 p-5">
              <strong className="block text-lg font-black text-white">
                {t.topicsTitle}
              </strong>

              <span className="mt-2 block text-sm leading-6 text-slate-300">
                {t.topicsDesc}
              </span>

              <div className="mt-4 flex flex-wrap gap-2">
                {topicLinks.map((topic) => (
                  <a
                    key={topic.href}
                    href={topic.href}
                    className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-2 text-xs font-black text-slate-100 transition hover:border-violet-300/40 hover:bg-white/[0.07]"
                  >
                    {isKo ? topic.ko : topic.en}
                  </a>
                ))}
              </div>

              <a
                href="/topics"
                className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-black text-slate-950"
              >
                {t.openTopics} →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
