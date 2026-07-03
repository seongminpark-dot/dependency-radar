"use client";

import { useEffect, useState } from "react";
import { getFlagEmoji } from "@/lib/flags";

type SiteLanguage = "ko" | "en";

type CountryNewsArticle = {
  title: string;
  url: string;
  image: string;
  source: string;
  sourceCountry: string;
  publishedAt: string;
  issueSlug: string;
  issueLabel: string;
  issueHref: string;
  language: string;
  isTrustedSource: boolean;
  sourceTier: "official" | "major" | "regional" | "general";
  sourceScore: number;
  isFallbackSearch?: boolean;
};

type CountryNewsResponse = {
  ok: boolean;
  language: string;
  generatedAt: string;
  articles: CountryNewsArticle[];
};

function getCopy(language: SiteLanguage) {
  if (language === "ko") {
    return {
      backHome: "홈",
      backCountry: "국가 데이터",
      title: "국가별 최신 뉴스",
      description:
        "선택한 국가와 관련된 무역, 에너지, 식량, 관세, 공급망 뉴스를 외부 원문 기사로 연결합니다.",
      loading: "뉴스를 불러오는 중입니다.",
      noNews:
        "현재 이 국가와 직접 관련된 최신 뉴스가 충분하지 않습니다. 전체 글로벌 뉴스에서 관련 이슈를 확인할 수 있습니다.",
      openArticle: "기사 원문 열기",
      openSearch: "뉴스 검색 열기",
      viewIssue: "이슈 브리프",
      trusted: "신뢰도 높은 출처",
      updated: "업데이트",
      compare: "국가 비교",
      allNews: "전체 뉴스",
      language: "언어",
    };
  }

  return {
    backHome: "Home",
    backCountry: "Country data",
    title: "Country latest news",
    description:
      "Open recent trade, energy, food, tariff, and supply-chain articles related to this country.",
    loading: "Loading country news.",
    noNews:
      "There are not enough recent country-specific articles right now. Open the global news desk for broader issue coverage.",
    openArticle: "Open article",
    openSearch: "Open news search",
    viewIssue: "Issue brief",
    trusted: "Trusted source",
    updated: "Updated",
    compare: "Compare country",
    allNews: "All news",
    language: "Language",
  };
}

function formatDate(value: string, language: SiteLanguage) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(language === "ko" ? "ko-KR" : "en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getPrettyCountryName(iso3: string, displayName: string, language: SiteLanguage) {
  const koNames: Record<string, string> = {
    KOR: "대한민국",
    JPN: "일본",
    USA: "미국",
    CHN: "중국",
    DEU: "독일",
    GBR: "영국",
    FRA: "프랑스",
    IND: "인도",
    CAN: "캐나다",
    AUS: "호주",
  };

  const enNames: Record<string, string> = {
    KOR: "South Korea",
    JPN: "Japan",
    USA: "United States",
    CHN: "China",
    DEU: "Germany",
    GBR: "United Kingdom",
    FRA: "France",
    IND: "India",
    CAN: "Canada",
    AUS: "Australia",
  };

  if (language === "ko" && koNames[iso3]) return koNames[iso3];
  if (enNames[iso3]) return enNames[iso3];

  return displayName
    .replace(/Korea, Rep\./gi, "South Korea")
    .replace(/, Rep\./gi, "")
    .replace(/, Dem\. Rep\./gi, "")
    .trim();
}

export default function CountryNewsPageClient({
  iso3,
  iso2,
  countryName,
  displayName,
}: {
  iso3: string;
  iso2: string;
  countryName: string;
  displayName: string;
}) {
  const [language, setLanguage] = useState<SiteLanguage>("en");
  const [articles, setArticles] = useState<CountryNewsArticle[]>([]);
  const [generatedAt, setGeneratedAt] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const copy = getCopy(language);
  const prettyName = getPrettyCountryName(iso3, displayName, language);

  async function loadNews(nextLanguage = language) {
    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        iso3,
        countryName,
        lang: nextLanguage,
      });

      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), 12000);

      const response = await fetch(`/api/country-news?${params.toString()}`, {
        cache: "no-store",
        signal: controller.signal,
      });

      window.clearTimeout(timer);

      if (!response.ok) return;

      const data = (await response.json()) as CountryNewsResponse;

      setArticles(data.articles ?? []);
      setGeneratedAt(data.generatedAt ?? "");
    } catch {
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadNews(language);
  }, [language]);

  const compareBase = iso3 === "USA" ? "KOR" : "USA";
  const externalSearchUrl = `https://news.google.com/search?q=${encodeURIComponent(`${countryName} trade energy tariff supply chain`)}`;

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050816]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-6 py-4">
          <a href="/" className="text-base font-black tracking-tight text-white">
            Datlora
          </a>

          <nav className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-300">
            <a href="/" className="hover:text-white">{copy.backHome}</a>
            <a href="/news" className="hover:text-white">{copy.allNews}</a>
            <a href="/issues" className="hover:text-white">Issues</a>
            <a href="/topics" className="hover:text-white">Topics</a>
            <a href={`/compare?a=${iso3}&b=${compareBase}`} className="hover:text-white">
              Compare
            </a>
            <a href={`/country/${iso3}`} className="text-emerald-300">
              {copy.backCountry}
            </a>
          </nav>

          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value as SiteLanguage)}
            className="rounded-full border border-white/15 bg-[#111524] px-4 py-2 text-sm text-white outline-none"
          >
            <option value="en">English</option>
            <option value="ko">한국어</option>
          </select>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">
          Country News Desk
        </p>

        <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.98] tracking-[-0.075em] md:text-7xl">
          {getFlagEmoji(iso2)} {prettyName} · {copy.title}
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          {copy.description}
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href={`/country/${iso3}`}
            className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white"
          >
            {copy.backCountry}
          </a>

          <a
            href={`/compare?a=${iso3}&b=${compareBase}`}
            className="rounded-full bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950"
          >
            {copy.compare}
          </a>

          <a
            href="/news"
            className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white"
          >
            {copy.allNews}
          </a>

          <a
            href={externalSearchUrl}
            className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-5 py-3 text-sm font-black text-emerald-100"
          >
            Google News
          </a>
        </div>

        {generatedAt ? (
          <p className="mt-4 text-xs font-semibold text-slate-500">
            {copy.updated}: {formatDate(generatedAt, language)}
          </p>
        ) : null}

        {isLoading ? (
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-8 text-slate-300">
            {copy.loading}
          </div>
        ) : articles.length === 0 ? (
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-8 text-slate-300">
            {copy.noNews}
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {articles.map((article, index) => (
              <article
                key={`${article.url}-${index}`}
                className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 shadow-2xl shadow-black/20"
              >
                <a href={article.url}>
                  <img
                    src={article.image}
                    alt={article.title}
                    className="h-56 w-full object-cover opacity-80 transition hover:opacity-100"
                    referrerPolicy="no-referrer"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src =
                        "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=1200&q=80";
                    }}
                  />
                </a>

                <div className="p-5">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-xs font-black text-emerald-100">
                      {article.issueLabel}
                    </span>

                    {article.isTrustedSource ? (
                      <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-xs font-black text-cyan-100">
                        {copy.trusted}
                      </span>
                    ) : null}
                  </div>

                  <a
                    href={article.url}
                   
                   
                    className="mt-4 block text-2xl font-black leading-tight tracking-[-0.05em] hover:text-emerald-200"
                  >
                    {article.title}
                  </a>

                  <p className="mt-3 text-sm font-bold text-slate-400">
                    {article.source}
                    {article.sourceCountry ? ` · ${article.sourceCountry}` : ""}
                    {article.publishedAt
                      ? ` · ${formatDate(article.publishedAt, language)}`
                      : ""}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <a
                      href={article.url}
                     
                     
                      className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-black text-slate-950"
                    >
                      {article.isFallbackSearch ? copy.openSearch : copy.openArticle}
                    </a>

                    <a
                      href={article.issueHref}
                      className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-black text-white"
                    >
                      {article.isFallbackSearch ? copy.allNews : copy.viewIssue}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
