"use client";

import { useEffect, useState } from "react";
import UnifiedTopNav from "@/components/UnifiedTopNav";

type Language = "ko" | "en";
type PageType = "privacy" | "terms" | "disclaimer";

const languageLabels: Record<Language, string> = {
  ko: "한국어",
  en: "English",
};

const common = {
  ko: {
    lastUpdated: "마지막 업데이트",
    contact: "문의",
    contactText:
      "데이터 오류, 협업, 서비스 관련 문의는 아래 이메일로 연락해 주세요.",
    email: "kevinsmp123@gmail.com",
    related: "관련 페이지",
    sources: "데이터 출처",
    methodology: "방법론",
    home: "홈으로 이동",
    language: "언어",
  },
  en: {
    lastUpdated: "Last updated",
    contact: "Contact",
    contactText:
      "For data corrections, collaboration, or service inquiries, contact the email below.",
    email: "kevinsmp123@gmail.com",
    related: "Related pages",
    sources: "Data sources",
    methodology: "Methodology",
    home: "Go home",
    language: "Language",
  },
};

const pages = {
  privacy: {
    ko: {
      label: "Privacy Policy",
      title: "개인정보 처리방침",
      intro:
        "Datlora는 회원가입, 결제, 댓글, 개인 프로필 기능을 운영하지 않습니다. 사이트 기능 제공과 기본적인 운영 확인에 필요한 범위에서만 제한적인 정보를 사용합니다.",
      sections: [
        {
          title: "수집하거나 사용하는 정보",
          body:
            "Datlora는 사용자가 직접 입력하는 계정 정보를 요구하지 않습니다. 다만 사이트 접속 국가 표시, 국가별 방문 집계, 언어 설정, 이메일 문의, 기본적인 접속 통계 확인을 위해 제한적인 정보가 사용될 수 있습니다.",
        },
        {
          title: "방문 국가 표시와 방문 집계",
          body:
            "방문 국가 표시는 호스팅 환경에서 제공하는 대략적인 국가 코드에 기반합니다. 국가별 누적 방문 횟수에는 중복 방문이 포함될 수 있으며, 이는 서비스 이용 흐름을 이해하기 위한 참고 정보입니다.",
        },
        {
          title: "언어 설정",
          body:
            "사용자가 언어를 직접 변경하면 선택한 언어가 브라우저의 localStorage에 저장될 수 있습니다. 이 정보는 사용자의 브라우저 안에서 다음 방문 시 같은 언어를 보여주기 위한 용도로 사용됩니다.",
        },
        {
          title: "분석 도구",
          body:
            "Datlora는 사이트 성능과 사용 흐름을 확인하기 위해 Vercel Analytics와 같은 기본 분석 도구를 사용할 수 있습니다. 이 정보는 페이지 방문 흐름과 서비스 개선 목적에 사용됩니다.",
        },
        {
          title: "이메일 문의",
          body:
            "사용자가 이메일로 문의하는 경우 이메일 주소와 메시지 내용은 문의 응답, 오류 확인, 협업 논의 목적으로만 사용됩니다.",
        },
        {
          title: "외부 링크",
          body:
            "Datlora는 외부 뉴스 기사, 뉴스 검색 페이지, 공식 데이터 출처로 연결되는 링크를 제공합니다. 외부 사이트에서 처리되는 정보는 해당 사이트의 정책을 따릅니다.",
        },
      ],
    },
    en: {
      label: "Privacy Policy",
      title: "Privacy Policy",
      intro:
        "Datlora does not operate user accounts, payments, comments, or personal profile features. It uses limited information only for site functionality and basic operation checks.",
      sections: [
        {
          title: "Information used by the site",
          body:
            "Datlora does not require account information from users. Limited information may be used for visitor country display, country-level visit counts, language preference, email inquiries, and basic analytics.",
        },
        {
          title: "Visitor country display and counts",
          body:
            "Visitor country display is based on an approximate country code provided by the hosting environment. Country-level cumulative visit counts may include repeat visits and are used as operational reference information.",
        },
        {
          title: "Language preference",
          body:
            "If a user manually changes the language, the selected language may be stored in the browser localStorage so that the same language can be shown on later visits.",
        },
        {
          title: "Analytics",
          body:
            "Datlora may use basic analytics tools such as Vercel Analytics to understand page visits, site performance, and service usage patterns.",
        },
        {
          title: "Email inquiries",
          body:
            "If a user contacts Datlora by email, the email address and message are used only for responding to the inquiry, checking reported issues, or discussing collaboration.",
        },
        {
          title: "External links",
          body:
            "Datlora links to external news articles, news search pages, and official data sources. Information handled on external sites is governed by the policies of those sites.",
        },
      ],
    },
  },
  terms: {
    ko: {
      label: "Terms of Use",
      title: "이용약관",
      intro:
        "Datlora는 글로벌 뉴스 맥락과 공식 국가 지표를 연결해 보여주는 정보 제공형 데이터 플랫폼입니다. 사이트 이용자는 아래 기준을 이해하고 서비스를 이용해야 합니다.",
      sections: [
        {
          title: "서비스 목적",
          body:
            "Datlora는 무역, 에너지, 식량, 관세, 물류, 수입, 공급망 관련 국가 지표와 외부 뉴스 링크를 탐색하기 위한 정보 조사용 서비스입니다.",
        },
        {
          title: "데이터와 뉴스의 구분",
          body:
            "국가 지표는 가능한 범위에서 공식 공개 데이터 기준으로 표시됩니다. 뉴스는 외부 기사 또는 뉴스 검색 페이지로 연결되는 참고 맥락이며, Datlora가 기사 원문을 발행하거나 소유하는 것은 아닙니다.",
        },
        {
          title: "사용자의 책임",
          body:
            "사용자는 Datlora의 정보를 독립적으로 검토해야 하며, 중요한 결정을 내리기 전에는 원출처, 최신 데이터, 관련 전문가의 검토를 함께 확인해야 합니다.",
        },
        {
          title: "금지된 이용",
          body:
            "사용자는 서비스를 방해하거나, 자동화된 과도한 요청을 보내거나, 외부 뉴스 및 공식 데이터 출처의 권리를 침해하는 방식으로 사이트를 이용해서는 안 됩니다.",
        },
        {
          title: "서비스 변경",
          body:
            "Datlora는 데이터 출처, 화면 구성, 기능, 링크, 설명 문구를 개선 또는 변경할 수 있습니다.",
        },
      ],
    },
    en: {
      label: "Terms of Use",
      title: "Terms of Use",
      intro:
        "Datlora is an informational data platform that connects global news context with official country indicators. Users should understand the following terms when using the site.",
      sections: [
        {
          title: "Purpose of the service",
          body:
            "Datlora is provided for informational research on country indicators and external news links related to trade, energy, food, tariffs, logistics, imports, and supply-chain context.",
        },
        {
          title: "Separation of data and news",
          body:
            "Country indicators are shown from official public data where available. News is provided through external article links or news search pages as context. Datlora does not publish or own the full article text.",
        },
        {
          title: "User responsibility",
          body:
            "Users should independently review Datlora information and check original sources, latest data, and relevant professional review before making important decisions.",
        },
        {
          title: "Prohibited use",
          body:
            "Users must not disrupt the service, send excessive automated requests, or use the site in a way that infringes the rights of external news or official data providers.",
        },
        {
          title: "Service changes",
          body:
            "Datlora may improve or change data sources, page layouts, features, links, and explanatory text.",
        },
      ],
    },
  },
  disclaimer: {
    ko: {
      label: "Disclaimer",
      title: "면책 고지",
      intro:
        "Datlora의 정보는 조사와 참고 목적입니다. 법률, 투자, 무역, 관세, 물류, 정책, 재무, 사업 의사결정에 대한 전문 조언을 대체하지 않습니다.",
      sections: [
        {
          title: "전문 조언 아님",
          body:
            "Datlora는 법률, 투자, 관세, 무역, 물류, 정책, 재무, 사업 컨설팅 서비스를 제공하지 않습니다. 중요한 의사결정에는 관련 전문가와 공식 기관의 확인이 필요합니다.",
        },
        {
          title: "데이터 최신성",
          body:
            "국가별 공식 지표는 출처, 국가, 지표마다 최신 제공 연도가 다를 수 있습니다. Datlora는 가능한 최신 값을 표시하지만, 모든 국가와 지표가 같은 연도에 업데이트된다는 의미는 아닙니다.",
        },
        {
          title: "외부 뉴스 링크",
          body:
            "Datlora는 외부 뉴스 기사와 뉴스 검색 페이지로 연결할 수 있습니다. 외부 뉴스의 제목, 내용, 업데이트, 접근 가능 여부, 검색 결과는 Datlora가 통제하지 않습니다.",
        },
        {
          title: "해석의 한계",
          body:
            "Datlora는 뉴스와 공식 통계를 연결해 맥락을 제공하지만, 특정 뉴스가 특정 통계 변화의 직접 원인이라고 단정하지 않습니다.",
        },
        {
          title: "오류 가능성",
          body:
            "데이터 처리, 번역, 표시, 외부 API 응답, 링크 연결 과정에서 오류나 지연이 발생할 수 있습니다. 오류를 발견하면 이메일로 알려주세요.",
        },
      ],
    },
    en: {
      label: "Disclaimer",
      title: "Disclaimer",
      intro:
        "Datlora is for research and informational reference. It does not replace legal, investment, trade, customs, logistics, policy, financial, or business advice.",
      sections: [
        {
          title: "Not professional advice",
          body:
            "Datlora does not provide legal, investment, customs, trade, logistics, policy, financial, or business consulting services. Important decisions should be checked with relevant professionals and official institutions.",
        },
        {
          title: "Data freshness",
          body:
            "Official country indicators may have different latest available years depending on the source, country, and indicator. Datlora shows the latest available values where possible, but not all countries and indicators are updated in the same year.",
        },
        {
          title: "External news links",
          body:
            "Datlora may link to external news articles and news search pages. Datlora does not control external news headlines, content, updates, availability, or search results.",
        },
        {
          title: "Limits of interpretation",
          body:
            "Datlora connects news context with official statistics, but it does not claim that a specific news item directly causes a specific statistical change.",
        },
        {
          title: "Possible errors",
          body:
            "Errors or delays may occur in data processing, translation, display, external API responses, or link routing. If you find an issue, contact Datlora by email.",
        },
      ],
    },
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

export default function LegalInfoPage({ pageType }: { pageType: PageType }) {
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

  const t = pages[pageType][language];
  const c = common[language];

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
            aria-label={c.language}
          >
            {Object.entries(languageLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </header>

      <section className={`mx-auto max-w-5xl px-6 py-14 ${ready ? "" : "opacity-0"}`}>
        <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">
          {t.label}
        </p>

        <h1 className="mt-5 text-5xl font-black leading-[0.98] tracking-[-0.075em] md:text-7xl">
          {t.title}
        </h1>

        <p className="mt-6 text-lg leading-8 text-slate-300">
          {t.intro}
        </p>

        <p className="mt-5 w-fit rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold text-slate-400">
          {c.lastUpdated}: 2026-07-04
        </p>

        <div className="mt-10 grid gap-5">
          {t.sections.map((section) => (
            <article
              key={section.title}
              className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/20"
            >
              <h2 className="text-2xl font-black tracking-[-0.05em]">
                {section.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                {section.body}
              </p>
            </article>
          ))}
        </div>

        <section className="mt-10 rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-6">
          <h2 className="text-2xl font-black tracking-[-0.05em]">
            {c.related}
          </h2>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <a
              href="/sources"
              className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm font-black text-white transition hover:border-cyan-300/40"
            >
              {c.sources} →
            </a>
            <a
              href="/methodology"
              className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm font-black text-white transition hover:border-emerald-300/40"
            >
              {c.methodology} →
            </a>
            <a
              href="/"
              className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm font-black text-white transition hover:border-blue-300/40"
            >
              {c.home} →
            </a>
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-violet-300/20 bg-violet-300/10 p-6">
          <h2 className="text-2xl font-black tracking-[-0.05em]">
            {c.contact}
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            {c.contactText}
          </p>
          <a
            href={`mailto:${c.email}`}
            className="mt-5 inline-flex rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-200"
          >
            {c.email}
          </a>
        </section>
      </section>
    </main>
  );
}
