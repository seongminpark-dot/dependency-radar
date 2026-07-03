"use client";

import { useEffect, useState } from "react";

type DisplayLanguage = "ko" | "en";

const copy = {
  ko: {
    description:
      "Datlora는 글로벌 뉴스 맥락과 공식 국가 지표를 연결해 무역, 에너지, 식량, 관세, 물류, 공급망 관련 정보를 탐색할 수 있게 돕는 데이터 플랫폼입니다.",
    explore: "탐색",
    trust: "출처와 기준",
    legal: "정책",
    contact: "문의",
    home: "홈",
    countries: "국가 목록",
    news: "뉴스",
    issues: "이슈",
    topics: "주제",
    compare: "국가 비교",
    labs: "Labs",
    sources: "데이터 출처",
    methodology: "방법론",
    privacy: "개인정보 처리방침",
    terms: "이용약관",
    disclaimer: "면책 고지",
    emailText: "데이터 오류, 협업, 서비스 문의",
    note:
      "외부 뉴스 링크는 참고 맥락이며, 국가 지표는 가능한 범위에서 공식 공개 데이터 기준으로 표시됩니다.",
  },
  en: {
    description:
      "Datlora connects global news context with official country indicators for trade, energy, food, tariffs, logistics, imports, and supply-chain exposure.",
    explore: "Explore",
    trust: "Sources & method",
    legal: "Policies",
    contact: "Contact",
    home: "Home",
    countries: "Countries",
    news: "News",
    issues: "Issues",
    topics: "Topics",
    compare: "Compare",
    labs: "Labs",
    sources: "Data sources",
    methodology: "Methodology",
    privacy: "Privacy Policy",
    terms: "Terms of Use",
    disclaimer: "Disclaimer",
    emailText: "Data corrections, collaboration, and service inquiries",
    note:
      "External news links are provided as context, while country indicators are shown from official public data where available.",
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

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="text-sm text-slate-400 transition hover:text-white">
      {children}
    </a>
  );
}

export default function SiteFooter() {
  const [language, setLanguage] = useState<DisplayLanguage>("ko");

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const next = await detectLanguage();

      if (!cancelled) {
        setLanguage(next);
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  const t = copy[language];

  return (
    <footer className="border-t border-white/10 bg-[#050816] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1.25fr_0.75fr_0.75fr_0.75fr]">
        <div>
          <a href="/" className="text-xl font-black tracking-tight text-white">
            Datlora
          </a>

          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">
            {t.description}
          </p>

          <p className="mt-4 max-w-xl text-xs leading-6 text-slate-500">
            {t.note}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-300">
            {t.explore}
          </h2>

          <div className="mt-4 grid gap-3">
            <FooterLink href="/">{t.home}</FooterLink>
            <FooterLink href="/countries">{t.countries}</FooterLink>
            <FooterLink href="/news">{t.news}</FooterLink>
            <FooterLink href="/issues">{t.issues}</FooterLink>
            <FooterLink href="/topics">{t.topics}</FooterLink>
            <FooterLink href="/compare?a=KOR&b=USA">{t.compare}</FooterLink>
            <FooterLink href="/labs">{t.labs}</FooterLink>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-cyan-300">
            {t.trust}
          </h2>

          <div className="mt-4 grid gap-3">
            <FooterLink href="/sources">{t.sources}</FooterLink>
            <FooterLink href="/methodology">{t.methodology}</FooterLink>
          </div>

          <h2 className="mt-8 text-sm font-black uppercase tracking-[0.2em] text-blue-300">
            {t.legal}
          </h2>

          <div className="mt-4 grid gap-3">
            <FooterLink href="/privacy">{t.privacy}</FooterLink>
            <FooterLink href="/terms">{t.terms}</FooterLink>
            <FooterLink href="/disclaimer">{t.disclaimer}</FooterLink>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-violet-300">
            {t.contact}
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-400">
            {t.emailText}
          </p>

          <a
            href="mailto:kevinsmp123@gmail.com"
            className="mt-4 inline-flex rounded-full border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-black text-white transition hover:border-emerald-300/40 hover:bg-emerald-300/10"
          >
            kevinsmp123@gmail.com
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-5">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Datlora. All rights reserved.</p>
          <p>Official data and external news context are displayed separately.</p>
        </div>
      </div>
    </footer>
  );
}
