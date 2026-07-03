"use client";

import { useEffect, useState } from "react";
import UnifiedTopNav from "@/components/UnifiedTopNav";

type Language = "ko" | "en";

const copy = {
  ko: {
    language: "언어",
    label: "페이지를 찾을 수 없습니다",
    title: "요청한 Datlora 페이지를 찾지 못했습니다.",
    description:
      "주소가 변경되었거나, 아직 만들어지지 않은 국가/뉴스/이슈 페이지일 수 있습니다. 아래 주요 페이지로 이동해 다시 탐색해 보세요.",
    home: "홈으로 이동",
    countries: "국가 목록",
    news: "뉴스",
    issues: "이슈",
    sources: "데이터 출처",
    methodology: "방법론",
    helpTitle: "다음 중 하나를 확인해 보세요",
    checks: [
      "국가 페이지는 /country/KOR 같은 ISO3 코드 형식입니다.",
      "국가별 뉴스 페이지는 /news/country/KOR 형식입니다.",
      "이슈 페이지는 /issues/oil-shock 같은 고정 주소를 사용합니다.",
    ],
  },
  en: {
    language: "Language",
    label: "Page not found",
    title: "The requested Datlora page could not be found.",
    description:
      "The address may have changed, or the country, news, or issue page may not exist yet. Use the main links below to continue exploring.",
    home: "Go home",
    countries: "Countries",
    news: "News",
    issues: "Issues",
    sources: "Data sources",
    methodology: "Methodology",
    helpTitle: "Check one of the following",
    checks: [
      "Country pages use ISO3 codes such as /country/KOR.",
      "Country news pages use paths such as /news/country/KOR.",
      "Issue pages use fixed paths such as /issues/oil-shock.",
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

export default function NotFoundClient() {
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

  const cards = [
    { href: "/", label: t.home },
    { href: "/countries", label: t.countries },
    { href: "/news", label: t.news },
    { href: "/issues", label: t.issues },
    { href: "/sources", label: t.sources },
    { href: "/methodology", label: t.methodology },
  ];

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050816]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-6 py-4">
          <a href="/" className="text-base font-black tracking-tight text-white">
            Datlora
          </a>

          <UnifiedTopNav language={language} />

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

      <section className={`mx-auto max-w-7xl px-6 py-16 ${ready ? "" : "opacity-0"}`}>
        <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.045] p-8 shadow-2xl shadow-black/30 md:p-12">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-300">
            404 · {t.label}
          </p>

          <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.98] tracking-[-0.075em] md:text-7xl">
            {t.title}
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            {t.description}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <a
                key={card.href}
                href={card.href}
                className="rounded-2xl border border-white/10 bg-slate-950/65 p-5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:border-emerald-300/40 hover:bg-emerald-300/10"
              >
                {card.label} →
              </a>
            ))}
          </div>
        </div>

        <section className="mt-8 rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-6">
          <h2 className="text-2xl font-black tracking-[-0.05em]">
            {t.helpTitle}
          </h2>

          <div className="mt-5 grid gap-3">
            {t.checks.map((item) => (
              <p
                key={item}
                className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm leading-7 text-slate-300"
              >
                {item}
              </p>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
