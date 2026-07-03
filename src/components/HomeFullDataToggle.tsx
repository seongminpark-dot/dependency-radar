"use client";

import { useEffect, useState, type ReactNode } from "react";

type Language = "ko" | "en" | "ja" | "zh" | "es" | "fr" | "de";

function getCopy(language: Language) {
  if (language === "ko") {
    return {
      label: "Full data explorer",
      title: "전체 데이터 탐색기는 필요할 때만 열어보세요.",
      description:
        "홈 상단은 뉴스, 이슈, 국가 검색에 집중하고, 지도·공식 데이터 패널·전체 표는 아래 버튼을 눌렀을 때 표시합니다.",
      open: "전체 데이터 열기",
      close: "전체 데이터 접기",
      news: "뉴스",
      issues: "이슈",
      country: "국가 검색",
      compare: "국가 비교",
      note: "이 영역을 열면 World Bank 구조 지표, 지도, 비교표, 전체 데이터 테이블이 표시됩니다.",
    };
  }

  return {
    label: "Full data explorer",
    title: "Open the full data explorer only when needed.",
    description:
      "The homepage now focuses on news, issue briefs, and country search first. Maps, official data panels, comparison tables, and the full dataset load after opening this section.",
    open: "Open full data",
    close: "Hide full data",
    news: "News",
    issues: "Issues",
    country: "Country search",
    compare: "Compare",
    note: "Opening this area displays World Bank structural indicators, map views, comparison tables, and the full data table.",
  };
}

export default function HomeFullDataToggle({
  language,
  children,
}: {
  language: Language;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const t = getCopy(language);

  useEffect(() => {
    const deepHashes = [
      "#latest-trade",
      "#energy-data",
      "#tariff-data",
      "#world-map",
      "#world-bank-table",
      "#compare",
      "#data",
      "#method",
    ];

    if (deepHashes.includes(window.location.hash)) {
      setOpen(true);
    }
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-6 pb-14">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/20">
        <p className="text-xs font-black uppercase tracking-[0.26em] text-cyan-300">
          {t.label}
        </p>

        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 className="text-3xl font-black tracking-[-0.06em] text-white">
              {t.title}
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
              {t.description}
            </p>

            <p className="mt-3 text-xs font-semibold text-slate-500">
              {t.note}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="w-fit rounded-full bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
          >
            {open ? t.close : t.open}
          </button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <a
            href="/news"
            className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm font-black text-white transition hover:border-emerald-300/40"
          >
            {t.news} →
          </a>

          <a
            href="/issues"
            className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm font-black text-white transition hover:border-cyan-300/40"
          >
            {t.issues} →
          </a>

          <a
            href="#country-search"
            className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm font-black text-white transition hover:border-blue-300/40"
          >
            {t.country} →
          </a>

          <a
            href="/compare?a=KOR&b=USA"
            className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm font-black text-white transition hover:border-violet-300/40"
          >
            {t.compare} →
          </a>
        </div>
      </div>

      {open ? <div className="mt-10">{children}</div> : null}
    </section>
  );
}
