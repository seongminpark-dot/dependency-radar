"use client";

import { useEffect, useMemo, useState } from "react";

type SiteLanguage = "ko" | "en";

type NewsArticle = {
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
  isTrustedSource?: boolean;
};

type NewsResponse = {
  ok: boolean;
  language: string;
  generatedAt: string;
  articles: NewsArticle[];
};

const fallbackArticles: NewsArticle[] = [
  {
    title: "Reuters Energy News",
    url: "https://www.reuters.com/business/energy/",
    image:
      "https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=1200&q=80",
    source: "reuters.com",
    sourceCountry: "",
    publishedAt: "",
    issueSlug: "oil-shock",
    issueLabel: "Oil Shock",
    issueHref: "/issues/oil-shock",
    language: "english",
    isTrustedSource: true,
  },
  {
    title: "AP Food Security News",
    url: "https://apnews.com/hub/food-security",
    image:
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80",
    source: "apnews.com",
    sourceCountry: "",
    publishedAt: "",
    issueSlug: "food-import-risk",
    issueLabel: "Food Import Risk",
    issueHref: "/issues/food-import-risk",
    language: "english",
    isTrustedSource: true,
  },
  {
    title: "WTO Latest Trade News",
    url: "https://www.wto.org/english/news_e/news_e.htm",
    image:
      "https://images.unsplash.com/photo-1494412685616-a5d310fbb07d?auto=format&fit=crop&w=1200&q=80",
    source: "wto.org",
    sourceCountry: "",
    publishedAt: "",
    issueSlug: "tariff-pressure",
    issueLabel: "Tariff Pressure",
    issueHref: "/issues/tariff-pressure",
    language: "english",
    isTrustedSource: true,
  },
  {
    title: "Reuters Supply Chain News",
    url: "https://www.reuters.com/business/",
    image:
      "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=1200&q=80",
    source: "reuters.com",
    sourceCountry: "",
    publishedAt: "",
    issueSlug: "supply-chain",
    issueLabel: "Supply Chain",
    issueHref: "/issues/supply-chain",
    language: "english",
    isTrustedSource: true,
  },
];

const issueFilters = [
  { value: "all", label: "All issues" },
  { value: "oil-shock", label: "Oil Shock" },
  { value: "food-import-risk", label: "Food Risk" },
  { value: "tariff-pressure", label: "Tariff" },
  { value: "supply-chain", label: "Supply Chain" },
];

function getCopy(language: SiteLanguage) {
  if (language === "ko") {
    return {
      title: "최신 글로벌 뉴스",
      description:
        "무역, 에너지, 식량, 관세, 공급망 관련 최신 기사 링크를 Datlora 이슈 브리프와 함께 확인하세요.",
      search: "기사 제목, 출처, 이슈 검색",
      refresh: "새로고침",
      openArticle: "기사 원문 열기",
      viewIssue: "관련 이슈 보기",
      trusted: "신뢰도 높은 출처",
      loading: "뉴스를 불러오는 중입니다.",
      updated: "업데이트",
      noResults: "조건에 맞는 뉴스가 없습니다.",
      languageLabel: "언어",
    };
  }

  return {
    title: "Latest Global News",
    description:
      "Track trade, energy, food, tariff, and supply-chain news with Datlora issue briefs.",
    search: "Search title, source, or issue",
    refresh: "Refresh",
    openArticle: "Open original article",
    viewIssue: "View issue brief",
    trusted: "Trusted source",
    loading: "Loading news.",
    updated: "Updated",
    noResults: "No matching news articles.",
    languageLabel: "Language",
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

export default function LiveNewsBoard() {
  const [language, setLanguage] = useState<SiteLanguage>("en");
  const [issue, setIssue] = useState("all");
  const [search, setSearch] = useState("");
  const [articles, setArticles] = useState<NewsArticle[]>(fallbackArticles);
  const [generatedAt, setGeneratedAt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const copy = getCopy(language);

  async function loadNews() {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/news?lang=${language}`, {
        cache: "no-store",
      });

      if (!response.ok) return;

      const data = (await response.json()) as NewsResponse;

      if (data.articles.length > 0) {
        setArticles(data.articles);
        setGeneratedAt(data.generatedAt);
      }
    } catch {
      // API 실패 시 fallback 공식 링크를 유지합니다.
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadNews();

    const timer = window.setInterval(loadNews, 10 * 60 * 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [language]);

  const filteredArticles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesIssue = issue === "all" || article.issueSlug === issue;

      const matchesSearch =
        query.length === 0 ||
        article.title.toLowerCase().includes(query) ||
        article.source.toLowerCase().includes(query) ||
        article.issueLabel.toLowerCase().includes(query);

      return matchesIssue && matchesSearch;
    });
  }, [articles, issue, search]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 text-white">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">
              Live News Desk
            </p>
            <h1 className="mt-4 text-5xl font-black tracking-[-0.075em]">
              {copy.title}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
              {copy.description}
            </p>
          </div>

          <button
            type="button"
            onClick={loadNews}
            className="w-fit rounded-full bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950"
          >
            {isLoading ? copy.loading : copy.refresh}
          </button>
        </div>

        <div className="mt-7 grid gap-3 lg:grid-cols-[1fr_180px_180px]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={copy.search}
            className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
          />

          <select
            value={issue}
            onChange={(event) => setIssue(event.target.value)}
            className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
          >
            {issueFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>

          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value as SiteLanguage)}
            className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
          >
            <option value="en">English</option>
            <option value="ko">한국어</option>
          </select>
        </div>

        {generatedAt ? (
          <p className="mt-4 text-xs text-slate-500">
            {copy.updated}: {formatDate(generatedAt, language)}
          </p>
        ) : null}
      </div>

      {filteredArticles.length === 0 ? (
        <div className="mt-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-slate-300">
          {copy.noResults}
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {filteredArticles.map((article, index) => (
            <article
              key={`${article.url}-${index}`}
              className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 text-white shadow-2xl shadow-black/20"
            >
              <a href={article.url} target="_blank" rel="noopener noreferrer">
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
                  <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-xs font-black text-emerald-200">
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
                  target="_blank"
                  rel="noopener noreferrer"
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
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-black text-slate-950"
                  >
                    {copy.openArticle}
                  </a>

                  <a
                    href={article.issueHref}
                    className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-black text-white"
                  >
                    {copy.viewIssue}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <p className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-xs leading-6 text-amber-100">
        News links open external articles. Datlora does not republish full news
        text; statistics and issue rankings are based on official public
        datasets.
      </p>
    </section>
  );
}
