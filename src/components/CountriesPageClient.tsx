"use client";

import { useEffect, useMemo, useState } from "react";
import type { CountryRow } from "@/lib/worldBank";
import { getFlagEmoji } from "@/lib/flags";
import TrustMethodologyLinks from "@/components/TrustMethodologyLinks";

type Language = "ko" | "en";

type SortKey = "name" | "dataCompleteness" | "importsGdp" | "tariffRate";

const copy = {
  ko: {
    home: "홈",
    news: "뉴스",
    issues: "이슈",
    topics: "주제",
    compare: "비교",
    sources: "출처",
    language: "언어",
    label: "국가 목록",
    title: "공식 국가 데이터를 국가별로 탐색하세요.",
    description:
      "국가명, 지역, 소득 그룹, 데이터 제공 수를 기준으로 국가를 찾고, 각 국가의 데이터 페이지와 국가별 뉴스 페이지로 이동할 수 있습니다.",
    search: "국가명 또는 ISO 코드 검색",
    region: "지역",
    income: "소득 그룹",
    dataCount: "데이터 제공 수",
    sort: "정렬",
    allRegions: "전체 지역",
    allIncome: "전체 소득 그룹",
    allData: "전체",
    dataAtLeast: "개 이상",
    showing: "표시 중",
    countries: "개 국가",
    dataCoverage: "데이터 제공",
    latestYear: "최신 연도",
    countryData: "국가 데이터",
    countryNews: "국가 뉴스",
    compareCountry: "비교하기",
    noResult: "조건에 맞는 국가를 찾지 못했습니다.",
    sortName: "국가명",
    sortCompleteness: "데이터 제공 수",
    sortImports: "수입/GDP",
    sortTariff: "관세율",
    officialIndicators: "공식 지표",
    sourceNote:
      "국가 지표는 World Bank 등 공식 공개 데이터 기준이며, 지표별 최신 연도는 국가마다 다를 수 있습니다.",
  },
  en: {
    home: "Home",
    news: "News",
    issues: "Issues",
    topics: "Topics",
    compare: "Compare",
    sources: "Sources",
    language: "Language",
    label: "Countries",
    title: "Explore official country data by country.",
    description:
      "Search countries by name, region, income group, and data coverage. Open each country data page or country-specific news page.",
    search: "Search country name or ISO code",
    region: "Region",
    income: "Income group",
    dataCount: "Data coverage",
    sort: "Sort",
    allRegions: "All regions",
    allIncome: "All income groups",
    allData: "All",
    dataAtLeast: "or more",
    showing: "Showing",
    countries: "countries",
    dataCoverage: "Data coverage",
    latestYear: "Latest year",
    countryData: "Country data",
    countryNews: "Country news",
    compareCountry: "Compare",
    noResult: "No countries match the selected filters.",
    sortName: "Country name",
    sortCompleteness: "Data coverage",
    sortImports: "Imports/GDP",
    sortTariff: "Tariff rate",
    officialIndicators: "Official indicators",
    sourceNote:
      "Country indicators are based on official public data such as World Bank data. Latest available years may differ by country and indicator.",
  },
};

async function detectInitialLanguage(): Promise<Language> {
  const manual = localStorage.getItem("datlora-manual-language");
  const saved = localStorage.getItem("dependency-radar-language");

  if (manual === "true" && (saved === "ko" || saved === "en")) {
    return saved;
  }

  try {
    const response = await fetch("/api/geo", { cache: "no-store" });
    const data = await response.json();

    if (data?.country === "KR") {
      return "ko";
    }
  } catch {
    return "ko";
  }

  return saved === "ko" ? "ko" : "en";
}

function getLatestYear(row: CountryRow) {
  const years = [
    row.energyImportPercent.year,
    row.fuelImportShare.year,
    row.foodImportShare.year,
    row.importsGdp.year,
    row.importUsd.year,
    row.tariffRate.year,
    row.logisticsIndex.year,
  ]
    .filter(Boolean)
    .map((year) => Number(year));

  if (years.length === 0) {
    return "—";
  }

  return String(Math.max(...years));
}

function formatPercent(value: number | null, language: Language) {
  if (value === null) {
    return "—";
  }

  return `${value.toLocaleString(language === "ko" ? "ko-KR" : "en-US", {
    maximumFractionDigits: 1,
  })}%`;
}

export default function CountriesPageClient({ rows }: { rows: CountryRow[] }) {
  const [language, setLanguage] = useState<Language>("ko");
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("all");
  const [income, setIncome] = useState("all");
  const [minimumDataCount, setMinimumDataCount] = useState(0);
  const [sortKey, setSortKey] = useState<SortKey>("dataCompleteness");

  useEffect(() => {
    async function init() {
      const next = await detectInitialLanguage();
      setLanguage(next);
      setReady(true);
    }

    init();
  }, []);

  function changeLanguage(next: Language) {
    setLanguage(next);
    localStorage.setItem("dependency-radar-language", next);
    localStorage.setItem("datlora-manual-language", "true");
  }

  const t = copy[language];

  const regions = useMemo(() => {
    return Array.from(new Set(rows.map((row) => row.region).filter(Boolean))).sort();
  }, [rows]);

  const incomeGroups = useMemo(() => {
    return Array.from(new Set(rows.map((row) => row.incomeLevel).filter(Boolean))).sort();
  }, [rows]);

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return rows
      .filter((row) => {
        const matchesQuery =
          normalizedQuery.length === 0 ||
          row.name.toLowerCase().includes(normalizedQuery) ||
          row.iso2.toLowerCase().includes(normalizedQuery) ||
          row.iso3.toLowerCase().includes(normalizedQuery);

        const matchesRegion = region === "all" || row.region === region;
        const matchesIncome = income === "all" || row.incomeLevel === income;
        const matchesDataCount = row.dataCompleteness >= minimumDataCount;

        return matchesQuery && matchesRegion && matchesIncome && matchesDataCount;
      })
      .sort((a, b) => {
        if (sortKey === "name") {
          return a.name.localeCompare(b.name);
        }

        if (sortKey === "importsGdp") {
          return (b.importsGdp.value ?? -999999) - (a.importsGdp.value ?? -999999);
        }

        if (sortKey === "tariffRate") {
          return (b.tariffRate.value ?? -999999) - (a.tariffRate.value ?? -999999);
        }

        return b.dataCompleteness - a.dataCompleteness || a.name.localeCompare(b.name);
      });
  }, [rows, query, region, income, minimumDataCount, sortKey]);

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050816]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-6 py-4">
          <a href="/" className="text-base font-black tracking-tight text-white">
            Datlora
          </a>

          <nav className="hidden flex-wrap items-center gap-4 text-sm font-bold text-slate-300 md:flex">
            <a href="/" className="hover:text-white">{t.home}</a>
            <a href="/news" className="hover:text-white">{t.news}</a>
            <a href="/issues" className="hover:text-white">{t.issues}</a>
            <a href="/topics" className="hover:text-white">{t.topics}</a>
            <a href="/compare?a=KOR&b=USA" className="hover:text-white">{t.compare}</a>
            <a href="/sources" className="hover:text-white">{t.sources}</a>
          </nav>

          <select
            value={language}
            onChange={(event) => changeLanguage(event.target.value as Language)}
            className="rounded-full border border-white/15 bg-[#111524] px-4 py-2 text-sm text-white outline-none"
            aria-label={t.language}
          >
            <option value="ko">한국어</option>
            <option value="en">English</option>
          </select>
        </div>
      </header>

      <section className={`mx-auto max-w-7xl px-6 py-14 ${ready ? "" : "opacity-0"}`}>
        <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">
          {t.label}
        </p>

        <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.98] tracking-[-0.075em] md:text-7xl">
          {t.title}
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          {t.description}
        </p>

        <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-5">
          <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_0.8fr_0.9fr]">
            <label className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                {t.search}
              </span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Korea, KOR, US..."
                className="w-full bg-transparent text-sm font-bold text-white outline-none placeholder:text-slate-600"
              />
            </label>

            <label className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                {t.region}
              </span>
              <select
                value={region}
                onChange={(event) => setRegion(event.target.value)}
                className="w-full bg-slate-950 text-sm font-bold text-white outline-none"
              >
                <option value="all">{t.allRegions}</option>
                {regions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                {t.income}
              </span>
              <select
                value={income}
                onChange={(event) => setIncome(event.target.value)}
                className="w-full bg-slate-950 text-sm font-bold text-white outline-none"
              >
                <option value="all">{t.allIncome}</option>
                {incomeGroups.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                {t.dataCount}
              </span>
              <select
                value={minimumDataCount}
                onChange={(event) => setMinimumDataCount(Number(event.target.value))}
                className="w-full bg-slate-950 text-sm font-bold text-white outline-none"
              >
                <option value={0}>{t.allData}</option>
                {[1, 2, 3, 4, 5, 6, 7].map((count) => (
                  <option key={count} value={count}>
                    {count} / 7 {t.dataAtLeast}
                  </option>
                ))}
              </select>
            </label>

            <label className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                {t.sort}
              </span>
              <select
                value={sortKey}
                onChange={(event) => setSortKey(event.target.value as SortKey)}
                className="w-full bg-slate-950 text-sm font-bold text-white outline-none"
              >
                <option value="dataCompleteness">{t.sortCompleteness}</option>
                <option value="name">{t.sortName}</option>
                <option value="importsGdp">{t.sortImports}</option>
                <option value="tariffRate">{t.sortTariff}</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold text-slate-200">
              {t.showing} {filteredRows.length.toLocaleString(language === "ko" ? "ko-KR" : "en-US")} /{" "}
              {rows.length.toLocaleString(language === "ko" ? "ko-KR" : "en-US")} {t.countries}
            </p>
            <p className="mt-2 text-xs leading-6 text-slate-500">
              {t.sourceNote}
            </p>
          </div>

          <a
            href="/compare?a=KOR&b=USA"
            className="w-fit rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-200"
          >
            {t.compare} →
          </a>
        </div>

        {filteredRows.length === 0 ? (
          <div className="mt-8 rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6 text-amber-100">
            {t.noResult}
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredRows.map((row) => (
              <article
                key={row.iso3}
                className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/20 transition hover:-translate-y-0.5 hover:border-emerald-300/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black tracking-[-0.05em]">
                      {getFlagEmoji(row.iso2)} {row.name}
                    </h2>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      {row.iso3} · {row.region}
                    </p>
                  </div>

                  <span className="rounded-full border border-white/10 bg-slate-950/75 px-3 py-1 text-xs font-black text-slate-300">
                    {row.dataCompleteness} / 7
                  </span>
                </div>

                <div className="mt-5 grid gap-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                      {t.income}
                    </p>
                    <p className="mt-2 text-sm font-bold text-slate-100">
                      {row.incomeLevel}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                        {t.sortImports}
                      </p>
                      <p className="mt-2 text-sm font-bold text-slate-100">
                        {formatPercent(row.importsGdp.value, language)}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                        {t.sortTariff}
                      </p>
                      <p className="mt-2 text-sm font-bold text-slate-100">
                        {formatPercent(row.tariffRate.value, language)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                      {t.latestYear}
                    </p>
                    <p className="mt-2 text-sm font-bold text-slate-100">
                      {getLatestYear(row)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-2">
                  <a
                    href={`/country/${row.iso3}`}
                    className="rounded-2xl bg-emerald-400 px-4 py-3 text-center text-sm font-black text-slate-950 transition hover:bg-emerald-300"
                  >
                    {t.countryData} →
                  </a>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`/news/country/${row.iso3}`}
                      className="rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 text-center text-xs font-black text-white transition hover:border-cyan-300/40"
                    >
                      {t.countryNews}
                    </a>

                    <a
                      href={`/compare?a=${row.iso3}&b=USA`}
                      className="rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 text-center text-xs font-black text-white transition hover:border-violet-300/40"
                    >
                      {t.compareCountry}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <TrustMethodologyLinks language={language} />
    </main>
  );
}
