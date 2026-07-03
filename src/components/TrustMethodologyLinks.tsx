"use client";

import { useEffect, useState } from "react";

type Language =
  | "ko"
  | "en"
  | "ja"
  | "zh"
  | "es"
  | "fr"
  | "de";

type DisplayLanguage = "ko" | "en";

const copy = {
  ko: {
    label: "Trust & methodology",
    title: "뉴스와 공식 통계의 기준을 확인하세요.",
    description:
      "Datlora는 외부 뉴스 링크와 공식 공개 통계를 분리해서 표시합니다. 데이터 출처, 지표 연도, 뉴스 연결 방식은 별도 페이지에서 확인할 수 있습니다.",
    methodologyTitle: "방법론",
    methodologyDesc:
      "뉴스, 이슈 브리프, 국가 지표가 어떻게 연결되는지 설명합니다.",
    sourcesTitle: "데이터 출처",
    sourcesDesc:
      "World Bank, UN Comtrade, WITS, EIA, GDELT의 역할을 구분해서 설명합니다.",
    disclaimerTitle: "정보 이용 기준",
    disclaimerDesc:
      "Datlora는 정보 조사용 서비스이며, 법률·투자·무역·정책 조언을 대체하지 않습니다.",
    open: "열기",
  },
  en: {
    label: "Trust & methodology",
    title: "Check how news and official statistics are separated.",
    description:
      "Datlora separates external news links from official public statistics. Source layers, indicator years, and news-linking rules are explained in dedicated pages.",
    methodologyTitle: "Methodology",
    methodologyDesc:
      "See how news, issue briefs, and country indicators are connected.",
    sourcesTitle: "Data sources",
    sourcesDesc:
      "Review how World Bank, UN Comtrade, WITS, EIA, and GDELT are used.",
    disclaimerTitle: "Use of information",
    disclaimerDesc:
      "Datlora is for informational research and does not replace legal, trade, policy, or investment advice.",
    open: "Open",
  },
};

async function detectLanguage(): Promise<DisplayLanguage> {
  const manual = localStorage.getItem("datlora-manual-language");
  const saved = localStorage.getItem("dependency-radar-language");

  if (manual === "true") {
    return saved === "ko" ? "ko" : "en";
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

export default function TrustMethodologyLinks({
  language,
}: {
  language?: Language;
}) {
  const [displayLanguage, setDisplayLanguage] = useState<DisplayLanguage>(
    language === "ko" ? "ko" : "en"
  );

  useEffect(() => {
    if (language) {
      setDisplayLanguage(language === "ko" ? "ko" : "en");
      return;
    }

    let cancelled = false;

    async function init() {
      const next = await detectLanguage();

      if (!cancelled) {
        setDisplayLanguage(next);
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [language]);

  const t = copy[displayLanguage];

  const cards = [
    {
      title: t.methodologyTitle,
      description: t.methodologyDesc,
      href: "/methodology",
    },
    {
      title: t.sourcesTitle,
      description: t.sourcesDesc,
      href: "/sources",
    },
    {
      title: t.disclaimerTitle,
      description: t.disclaimerDesc,
      href: "/disclaimer",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 pb-12">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/20">
        <p className="text-xs font-black uppercase tracking-[0.26em] text-emerald-300">
          {t.label}
        </p>

        <div className="mt-4 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <h2 className="text-3xl font-black tracking-[-0.06em] text-white">
              {t.title}
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-300">
              {t.description}
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {cards.map((card) => (
              <a
                key={card.href}
                href={card.href}
                className="rounded-2xl border border-white/10 bg-slate-950/65 p-4 transition hover:-translate-y-0.5 hover:border-emerald-300/40 hover:bg-emerald-300/10"
              >
                <strong className="block text-base font-black text-white">
                  {card.title}
                </strong>

                <span className="mt-2 block text-xs leading-6 text-slate-400">
                  {card.description}
                </span>

                <span className="mt-4 inline-flex rounded-full bg-white px-3 py-2 text-xs font-black text-slate-950">
                  {t.open} →
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
