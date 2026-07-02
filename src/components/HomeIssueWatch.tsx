"use client";

import { useEffect, useMemo, useState } from "react";
import { issueBriefs } from "@/lib/issueBriefs";

type SiteLanguage = "ko" | "en" | "ja" | "zh" | "es" | "fr" | "de";

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
  language: SiteLanguage;
  generatedAt: string;
  articles: NewsArticle[];
};

const fallbackCards: NewsArticle[] = [
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

function getCopy(language: SiteLanguage) {
  if (language === "ko") {
    return {
      kicker: "Live Global News",
      title: "최신 공식 뉴스를 바로 확인하세요.",
      description:
        "Datlora는 최신 글로벌 기사 링크를 불러오고, 각 기사를 관련 공식 데이터 이슈 페이지와 연결합니다.",
      loading: "최신 뉴스를 불러오는 중입니다.",
      liveLabel: "Latest News",
      trusted: "Trusted source",
      relatedIssue: "관련 이슈",
      openArticle: "기사 원문 바로가기",
      viewIssue: "이슈 브리프",
      previous: "이전",
      next: "다음",
      notice:
        "뉴스는 외부 기사 링크입니다. Datlora의 통계 수치는 공식 공개 데이터 기준입니다.",
      updated: "업데이트",
    };
  }

  return {
    kicker: "Live Global News",
    title: "Open the latest global news directly.",
    description:
      "Datlora pulls recent global news links and connects each article to official country-data issue briefs.",
    loading: "Loading latest news.",
    liveLabel: "Latest News",
    trusted: "Trusted source",
    relatedIssue: "Related issue",
    openArticle: "Open original article",
    viewIssue: "Issue brief",
    previous: "Prev",
    next: "Next",
    notice:
      "News links are external articles. Datlora statistics are based on official public datasets.",
    updated: "Updated",
  };
}

function getIssueCopy(slug: string, language: SiteLanguage) {
  const english: Record<string, { title: string; deck: string }> = {
    "oil-shock": {
      title: "Oil Shock",
      deck: "Track fuel imports, energy exposure, and oil-price related pressure.",
    },
    "food-import-risk": {
      title: "Food Risk",
      deck: "Connect food security news with food import dependency indicators.",
    },
    "tariff-pressure": {
      title: "Tariff Pressure",
      deck: "Follow trade-cost pressure through tariff and import indicators.",
    },
    "supply-chain": {
      title: "Supply Chain",
      deck: "Link logistics and shipping disruption news with structural import data.",
    },
  };

  const korean: Record<string, { title: string; deck: string }> = {
    "oil-shock": {
      title: "Oil Shock",
      deck: "연료 수입, 에너지 노출도, 유가 관련 압박을 확인합니다.",
    },
    "food-import-risk": {
      title: "Food Risk",
      deck: "식량 안보 뉴스를 식량 수입 의존도 지표와 연결합니다.",
    },
    "tariff-pressure": {
      title: "Tariff Pressure",
      deck: "관세와 수입 지표로 무역 비용 압박을 확인합니다.",
    },
    "supply-chain": {
      title: "Supply Chain",
      deck: "물류와 공급망 뉴스를 구조적 수입 데이터와 연결합니다.",
    },
  };

  return language === "ko" ? korean[slug] ?? english[slug] : english[slug] ?? korean[slug];
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

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(getLocale(language), {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function HomeIssueWatch({
  language = "en",
}: {
  language?: SiteLanguage;
}) {
  const copy = getCopy(language);
  const issueMap = useMemo(() => issueBriefs, []);
  const [activeIndex, setActiveIndex] = useState(0);
  const [articles, setArticles] = useState<NewsArticle[]>(fallbackCards);
  const [generatedAt, setGeneratedAt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const visibleArticles = articles.length > 0 ? articles : fallbackCards;
  const activeCard = visibleArticles[activeIndex % visibleArticles.length];

  useEffect(() => {
    let cancelled = false;

    async function loadNews() {
      setIsLoading(true);

      try {
        const response = await fetch(`/api/news?lang=${language}`, {
          cache: "no-store",
        });

        if (!response.ok) return;

        const data = (await response.json()) as NewsResponse;

        if (!cancelled && data.articles.length > 0) {
          setArticles(data.articles);
          setGeneratedAt(data.generatedAt);
          setActiveIndex(0);
        }
      } catch {
        // 외부 뉴스 호출 실패 시 공식 뉴스 링크 fallback을 유지합니다.
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadNews();

    const refreshTimer = window.setInterval(loadNews, 10 * 60 * 1000);

    return () => {
      cancelled = true;
      window.clearInterval(refreshTimer);
    };
  }, [language]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % visibleArticles.length);
    }, 4000);

    return () => {
      window.clearInterval(timer);
    };
  }, [visibleArticles.length]);

  function goPrevious() {
    setActiveIndex((current) => {
      return (current - 1 + visibleArticles.length) % visibleArticles.length;
    });
  }

  function goNext() {
    setActiveIndex((current) => {
      return (current + 1) % visibleArticles.length;
    });
  }

  return (
    <section className="mx-auto mt-8 max-w-7xl px-4 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950 p-6 text-white shadow-2xl shadow-black/20">
          <p className="text-xs font-black uppercase tracking-[0.26em] text-cyan-300">
            {copy.kicker}
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-[-0.07em]">
            {copy.title}
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-300">
            {copy.description}
          </p>

          <div className="mt-6 grid gap-3">
            {issueMap.map((issue) => {
              const issueCopy = getIssueCopy(issue.slug, language);

              return (
                <a
                  key={issue.slug}
                  href={`/issues/${issue.slug}`}
                  className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 transition hover:border-cyan-300/40"
                >
                  <strong className="block text-white">{issueCopy.title}</strong>
                  <span className="mt-1 block text-sm leading-6 text-slate-400">
                    {issueCopy.deck}
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 text-white shadow-2xl shadow-black/20">
          <div className="relative h-[430px]">
            <img
              src={activeCard.image}
              alt={activeCard.title}
              className="h-full w-full object-cover opacity-75"
              referrerPolicy="no-referrer"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src =
                  "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=1200&q=80";
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />

            <div className="absolute left-5 top-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-emerald-300/30 bg-emerald-300/15 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-emerald-200">
                {copy.liveLabel}
              </span>

              {activeCard.isTrustedSource ? (
                <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-100">
                  {copy.trusted}
                </span>
              ) : null}

              {isLoading ? (
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold text-slate-200">
                  {copy.loading}
                </span>
              ) : null}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300">
                {activeCard.source}
                {activeCard.sourceCountry ? ` · ${activeCard.sourceCountry}` : ""}
              </p>

              <a
                href={activeCard.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block max-w-xl text-3xl font-black leading-tight tracking-[-0.06em] text-white hover:text-emerald-200 md:text-4xl"
              >
                {activeCard.title}
              </a>

              <p className="mt-3 text-sm font-bold text-slate-300">
                {copy.relatedIssue}: {activeCard.issueLabel}
                {activeCard.publishedAt
                  ? ` · ${formatDate(activeCard.publishedAt, language)}`
                  : ""}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href={activeCard.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-black text-slate-950"
                >
                  {copy.openArticle}
                </a>

                <a
                  href={activeCard.issueHref}
                  className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-black text-white"
                >
                  {copy.viewIssue}
                </a>

                <button
                  type="button"
                  onClick={goPrevious}
                  className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-black text-white"
                >
                  {copy.previous}
                </button>

                <button
                  type="button"
                  onClick={goNext}
                  className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-black text-white"
                >
                  {copy.next}
                </button>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {visibleArticles.slice(0, 8).map((card, index) => (
                  <button
                    key={`${card.url}-${index}`}
                    type="button"
                    aria-label={card.issueLabel}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === activeIndex % visibleArticles.length
                        ? "w-10 bg-emerald-300"
                        : "w-2 bg-white/35"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 bg-slate-950 px-6 py-4 text-xs leading-6 text-slate-400">
            {copy.notice}
            {generatedAt ? (
              <span className="ml-2 text-slate-500">
                {copy.updated}: {formatDate(generatedAt, language)}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
