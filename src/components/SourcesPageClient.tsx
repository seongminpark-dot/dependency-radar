"use client";

import { useEffect, useState } from "react";

type Language = "ko" | "en";

const copy = {
  ko: {
    navHome: "홈",
    navNews: "뉴스",
    navIssues: "이슈",
    navTopics: "주제",
    navMethodology: "방법론",
    language: "언어",
    label: "데이터 출처",
    title: "Datlora는 뉴스와 공식 통계를 분리해서 표시합니다.",
    description:
      "국가 통계는 공식 공개 데이터 기준으로 표시하고, 뉴스는 외부 원문 기사 또는 뉴스 검색 링크로 제공합니다. 두 영역은 서로 연결되지만 같은 출처로 취급하지 않습니다.",
    sourceLayer: "출처 레이어",
    groups: [
      {
        title: "World Bank",
        type: "공식 통계",
        description:
          "수입/GDP, 연료 수입 비중, 식량 수입 비중, 관세율, 물류지수, 국가 메타데이터 같은 연간 구조 지표에 사용됩니다.",
        note: "지표와 국가에 따라 최신 제공 연도가 다를 수 있습니다.",
      },
      {
        title: "UN Comtrade",
        type: "공식 무역 데이터",
        description:
          "가능한 경우 최신 무역 데이터 레이어에 사용되며, 연간 구조 지표와 분리해서 표시합니다.",
        note: "무역 값은 공식 무역 기록으로 읽어야 하며 Datlora의 예측값이 아닙니다.",
      },
      {
        title: "WITS",
        type: "무역 및 관세 참고",
        description:
          "관세와 무역 관련 출처 맥락이 필요한 경우 참고 레이어로 사용됩니다.",
        note: "국가와 지표에 따라 범위와 업데이트 시점이 다를 수 있습니다.",
      },
      {
        title: "EIA",
        type: "에너지 참고",
        description:
          "에너지 시장 맥락이 필요한 경우 에너지 관련 참고 출처로 사용됩니다.",
        note: "에너지 데이터는 출처 연도와 국가별 제공 범위를 함께 확인해야 합니다.",
      },
      {
        title: "GDELT / 외부 뉴스 링크",
        type: "뉴스 맥락",
        description:
          "무역, 에너지, 식량, 관세, 공급망과 관련된 최근 글로벌 뉴스 기사 또는 뉴스 검색 페이지를 찾고 연결하는 데 사용됩니다.",
        note: "뉴스 링크는 외부 참고 맥락입니다. Datlora는 기사 전문을 재게시하지 않습니다.",
      },
    ],
    notDoTitle: "Datlora가 하지 않는 것",
    notDo: [
      "Datlora는 특정 뉴스가 통계 지표의 직접 원인이라고 단정하지 않습니다.",
      "Datlora는 공식 관세, 법률, 무역, 정책, 투자 조언을 대체하지 않습니다.",
      "Datlora는 방법론을 숨긴 임의의 위험 점수를 만들지 않습니다.",
    ],
  },
  en: {
    navHome: "Home",
    navNews: "News",
    navIssues: "Issues",
    navTopics: "Topics",
    navMethodology: "Methodology",
    language: "Language",
    label: "Data Sources",
    title: "Datlora separates news context from official statistics.",
    description:
      "Country statistics are shown from official public data sources, while news is provided through external article links or news search links. They are connected, but they are not treated as the same source layer.",
    sourceLayer: "Source layer",
    groups: [
      {
        title: "World Bank",
        type: "Official statistics",
        description:
          "Used for annual structural indicators such as imports/GDP, fuel import share, food import share, tariff rate, logistics index, and related country metadata.",
        note: "Values may use different latest available years by indicator and country.",
      },
      {
        title: "UN Comtrade",
        type: "Official trade data",
        description:
          "Used for newer trade-data layers where available, separated from annual structural indicators.",
        note: "Trade values should be read as official trade records, not as Datlora predictions.",
      },
      {
        title: "WITS",
        type: "Trade and tariff reference",
        description:
          "Used as a reference layer for tariff and trade-related source context where applicable.",
        note: "Coverage and update timing may differ by country and indicator.",
      },
      {
        title: "EIA",
        type: "Energy reference",
        description:
          "Used as an energy-related reference source where energy market context is required.",
        note: "Energy data should be interpreted with source year and country coverage in mind.",
      },
      {
        title: "GDELT / External news links",
        type: "News context",
        description:
          "Used to discover and link recent global news articles or search pages related to trade, energy, food, tariffs, and supply chains.",
        note: "News links are external context. Datlora does not republish full article text.",
      },
    ],
    notDoTitle: "What Datlora does not do",
    notDo: [
      "Datlora does not claim that a news article directly causes a statistical indicator.",
      "Datlora does not replace official customs, legal, trade, policy, or investment advice.",
      "Datlora does not hide methodology behind a private risk score.",
    ],
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

export default function SourcesPageClient() {
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
            <a href="/methodology" className="hover:text-white">{t.navMethodology}</a>
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
        <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
          {t.label}
        </p>

        <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.98] tracking-[-0.075em] md:text-7xl">
          {t.title}
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          {t.description}
        </p>

        <div className="mt-10 grid gap-5">
          {t.groups.map((source) => (
            <article
              key={source.title}
              className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/20"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
                    {source.type}
                  </p>
                  <h2 className="mt-3 text-3xl font-black tracking-[-0.06em]">
                    {source.title}
                  </h2>
                </div>

                <span className="w-fit rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-xs font-black text-slate-300">
                  {t.sourceLayer}
                </span>
              </div>

              <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-300">
                {source.description}
              </p>

              <p className="mt-4 rounded-2xl border border-white/10 bg-slate-950/55 p-4 text-xs leading-6 text-slate-400">
                {source.note}
              </p>
            </article>
          ))}
        </div>

        <section className="mt-10 rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-6">
          <h2 className="text-3xl font-black tracking-[-0.06em]">
            {t.notDoTitle}
          </h2>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {t.notDo.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-slate-950/55 p-4 text-sm leading-7 text-slate-300"
              >
                {item}
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
