"use client";

import { useEffect, useState } from "react";

type Language = "ko" | "en";

const copy = {
  ko: {
    navHome: "홈",
    navNews: "뉴스",
    navIssues: "이슈",
    navTopics: "주제",
    navCompare: "비교",
    navSources: "출처",
    label: "방법론",
    title: "뉴스와 공식 통계를 구분해서 연결합니다.",
    description:
      "Datlora는 뉴스 사이트가 아니라, 글로벌 뉴스 흐름을 공식 국가 지표와 연결해 읽을 수 있게 돕는 데이터 플랫폼입니다. 뉴스 링크와 통계 데이터는 서로 다른 출처와 역할을 가집니다.",
    language: "언어",
    blocks: [
      {
        title: "뉴스는 외부 참고 맥락입니다",
        description:
          "Datlora는 외부 뉴스 기사와 뉴스 검색 페이지로 연결합니다. 기사 전문을 재게시하지 않으며, 뉴스 제목을 공식 통계 근거로 취급하지 않습니다.",
      },
      {
        title: "통계는 공식 공개 지표입니다",
        description:
          "국가 지표는 World Bank, UN Comtrade, WITS, EIA 등 공식 공개 데이터셋을 기준으로 표시합니다.",
      },
      {
        title: "이슈 브리프는 구조화된 해석입니다",
        description:
          "이슈 페이지는 유가 충격, 식량 수입 리스크, 관세 압박, 공급망 노출 같은 주제를 관련 공식 지표와 묶어서 보여줍니다.",
      },
      {
        title: "출처 연도와 지표값을 함께 표시합니다",
        description:
          "국가별 지표는 제공 연도가 서로 다를 수 있으므로, Datlora는 값과 함께 출처 연도를 표시합니다.",
      },
    ],
    workflowTitle: "Datlora가 정보를 연결하는 방식",
    workflow: [
      "사용자가 글로벌 뉴스 또는 국가 페이지를 확인합니다.",
      "Datlora는 해당 맥락을 관련 이슈 브리프와 연결합니다.",
      "이슈 브리프는 공식 지표와 노출도가 높은 국가를 보여줍니다.",
      "국가 페이지는 값, 연도, 관련 뉴스, 비교 링크를 함께 제공합니다.",
    ],
    notice:
      "Datlora는 정보 조사용 서비스입니다. 투자, 무역, 관세, 물류, 법률, 정책 조언이 아닙니다. 외부 뉴스 링크는 참고 맥락이며, 통계 수치는 가능한 범위에서 공식 공개 데이터셋을 기준으로 합니다.",
  },
  en: {
    navHome: "Home",
    navNews: "News",
    navIssues: "Issues",
    navTopics: "Topics",
    navCompare: "Compare",
    navSources: "Sources",
    label: "Methodology",
    title: "Datlora separates news context from official statistics.",
    description:
      "Datlora is not a news publisher. It connects global news context with official country indicators so users can read issues through data. News links and statistical values have different sources and roles.",
    language: "Language",
    blocks: [
      {
        title: "News is external context",
        description:
          "Datlora links to external news articles and news search pages. It does not republish full news text, and it does not treat news headlines as official statistical evidence.",
      },
      {
        title: "Statistics are official public indicators",
        description:
          "Country indicators are based on public datasets such as World Bank, UN Comtrade, WITS, EIA, and related official sources where available.",
      },
      {
        title: "Issue briefs are structured interpretations",
        description:
          "Issue pages group relevant official indicators around topics such as oil shock, food import risk, tariff pressure, and supply-chain exposure.",
      },
      {
        title: "Source years are shown with values",
        description:
          "Country indicators may have different latest available years, so Datlora shows the value together with the source year.",
      },
    ],
    workflowTitle: "How Datlora connects information",
    workflow: [
      "A user reads a global news article or opens a country page.",
      "Datlora connects that context to relevant issue briefs.",
      "Issue briefs show official indicators and exposed countries.",
      "Country pages show values, years, related news, and comparison links.",
    ],
    notice:
      "Datlora is for informational research only. It is not investment, trade, customs, logistics, legal, or policy advice. External news links are provided as context, while statistical values are based on official public datasets where available.",
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

export default function MethodologyPageClient() {
  const [language, setLanguage] = useState<Language>("ko");
  const [ready, setReady] = useState(false);

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

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050816]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-6 py-4">
          <a href="/" className="text-base font-black tracking-tight text-white">
            Datlora
          </a>

          <nav className="hidden flex-wrap items-center gap-4 text-sm font-bold text-slate-300 md:flex">
            <a href="/" className="hover:text-white">{t.navHome}</a>
            <a href="/news" className="hover:text-white">{t.navNews}</a>
            <a href="/issues" className="hover:text-white">{t.navIssues}</a>
            <a href="/topics" className="hover:text-white">{t.navTopics}</a>
            <a href="/compare?a=KOR&b=USA" className="hover:text-white">{t.navCompare}</a>
            <a href="/sources" className="hover:text-white">{t.navSources}</a>
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

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {t.blocks.map((block) => (
            <article
              key={block.title}
              className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/20"
            >
              <h2 className="text-2xl font-black tracking-[-0.05em]">
                {block.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                {block.description}
              </p>
            </article>
          ))}
        </div>

        <section className="mt-10 rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-6">
          <h2 className="text-3xl font-black tracking-[-0.06em]">
            {t.workflowTitle}
          </h2>

          <div className="mt-6 grid gap-3">
            {t.workflow.map((item, index) => (
              <div
                key={item}
                className="grid gap-4 rounded-2xl border border-white/10 bg-slate-950/55 p-4 md:grid-cols-[48px_1fr]"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-400 text-lg font-black text-slate-950">
                  {index + 1}
                </div>
                <p className="self-center text-sm font-bold leading-7 text-slate-100">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-5 text-sm leading-7 text-amber-100">
          {t.notice}
        </section>
      </section>
    </main>
  );
}
