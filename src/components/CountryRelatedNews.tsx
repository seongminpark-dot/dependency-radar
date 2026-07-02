"use client";

import { useEffect, useState } from "react";

type SiteLanguage = "ko" | "en" | "ja" | "zh" | "es" | "fr" | "de";

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
      label: "Country news",
      title: "관련 최신 뉴스",
      description:
        "이 국가와 관련된 무역, 에너지, 식량, 관세, 공급망 뉴스를 외부 원문 기사로 연결합니다.",
      loading: "뉴스를 불러오는 중입니다.",
      noNews:
        "현재 이 국가와 직접 관련된 최신 뉴스가 충분하지 않습니다. 전체 뉴스 페이지에서 글로벌 이슈를 확인할 수 있습니다.",
      openArticle: "기사 원문 열기",
      viewIssue: "이슈 브리프",
      trusted: "신뢰도 높은 출처",
      updated: "업데이트",
      viewAll: "전체 뉴스 보기",
    };
  }

  return {
    label: "Country news",
    title: "Related latest news",
    description:
      "Open recent trade, energy, food, tariff, and supply-chain articles related to this country.",
    loading: "Loading country news.",
    noNews:
      "There are not enough recent country-specific articles right now. You can still open the global news desk.",
    openArticle: "Open article",
    viewIssue: "Issue brief",
    trusted: "Trusted source",
    updated: "Updated",
    viewAll: "View all news",
  };
}

function getLocale(language: SiteLanguage) {
  if (language === "ko") return "ko-KR";
  if (language === "ja") return "ja-JP";
  if (language === "zh") return "zh-CN";
  if (language === "es") return "es-ES";
  if (language === "fr") return "fr-FR";
  if (language === "de") return "de-DE";
  return "en-US";
}

function formatDate(value: string, language: SiteLanguage) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(getLocale(language), {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function CountryRelatedNews({
  iso3,
  countryName,
  displayName,
  language,
}: {
  iso3: string;
  countryName: string;
  displayName: string;
  language: SiteLanguage;
}) {
  const copy = getCopy(language);
  const [articles, setArticles] = useState<CountryNewsArticle[]>([]);
  const [generatedAt, setGeneratedAt] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadNews() {
      setIsLoading(true);

      try {
        const params = new URLSearchParams({
          iso3,
          countryName,
          lang: language,
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

        if (!cancelled) {
          setArticles(data.articles ?? []);
          setGeneratedAt(data.generatedAt ?? "");
        }
      } catch {
        if (!cancelled) {
          setArticles([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadNews();

    return () => {
      cancelled = true;
    };
  }, [iso3, countryName, language]);

  return (
    <section className="mx-auto max-w-7xl px-6 pb-12">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.26em] text-emerald-300">
              {copy.label}
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.06em] text-white md:text-4xl">
              {displayName} · {copy.title}
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
              {copy.description}
            </p>

            {generatedAt ? (
              <p className="mt-2 text-xs font-semibold text-slate-500">
                {copy.updated}: {formatDate(generatedAt, language)}
              </p>
            ) : null}
          </div>

          <a
            href={`/news/country/${iso3}`}
            className="w-fit rounded-full bg-emerald-400 px-4 py-2 text-sm font-black text-slate-950"
          >
            {copy.viewAll}
          </a>
        </div>

        {isLoading ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/70 p-5 text-sm font-bold text-slate-300">
            {copy.loading}
          </div>
        ) : articles.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/70 p-5 text-sm leading-7 text-slate-300">
            {copy.noNews}
          </div>
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {articles.slice(0, 6).map((article, index) => (
              <article
                key={`${article.url}-${index}`}
                className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70"
              >
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="h-44 w-full object-cover opacity-80 transition hover:opacity-100"
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
                    <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-[11px] font-black text-emerald-100">
                      {article.issueLabel}
                    </span>

                    {article.isTrustedSource ? (
                      <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-[11px] font-black text-cyan-100">
                        {copy.trusted}
                      </span>
                    ) : null}
                  </div>

                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 block text-xl font-black leading-tight tracking-[-0.04em] text-white hover:text-emerald-200"
                  >
                    {article.title}
                  </a>

                  <p className="mt-3 text-xs font-bold text-slate-500">
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
                      className="rounded-full bg-emerald-400 px-4 py-2 text-xs font-black text-slate-950"
                    >
                      {copy.openArticle}
                    </a>

                    <a
                      href={article.issueHref}
                      className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black text-white"
                    >
                      {copy.viewIssue}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
