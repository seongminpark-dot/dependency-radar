"use client";

type Language = "ko" | "en" | "ja" | "zh" | "es" | "fr" | "de";

const copy = {
  ko: {
    label: "Documentation",
    title: "데이터 해석 기준과 출처를 투명하게 공개합니다.",
    subtitle:
      "공식 통계는 출처별 업데이트 주기가 다릅니다. Sources와 Methodology 페이지에서 각 지표가 어떤 기준으로 표시되는지 확인할 수 있습니다.",
    sources: "공식 출처",
    sourcesDesc: "World Bank, UN Comtrade, WITS, EIA 사용 방식",
    methodology: "분석 기준",
    methodologyDesc: "2026 → 2025 → 2024 최신성 적용 원칙",
    disclaimer: "면책 고지",
    disclaimerDesc: "교육·연구 목적, 전문 조언 아님",
    contact: "문의",
    contactDesc: "데이터 오류, 협업, 서비스 문의",
  },
  en: {
    label: "Documentation",
    title: "Data interpretation rules and sources are disclosed transparently.",
    subtitle:
      "Official statistics update on different schedules. Sources and Methodology explain how each indicator is interpreted.",
    sources: "Official sources",
    sourcesDesc: "How World Bank, UN Comtrade, WITS, and EIA are used",
    methodology: "Methodology",
    methodologyDesc: "Freshness priority: 2026 → 2025 → 2024",
    disclaimer: "Disclaimer",
    disclaimerDesc: "Educational and research use only",
    contact: "Contact",
    contactDesc: "Data corrections, collaboration, and service inquiries",
  },
  ja: {
    label: "Documentation",
    title: "データ解釈基準と出典を透明に公開します。",
    subtitle: "公式統計は出典ごとに更新周期が異なります。",
    sources: "公式出典",
    sourcesDesc: "各公式データの使用方式",
    methodology: "方法論",
    methodologyDesc: "最新性の優先順位",
    disclaimer: "免責事項",
    disclaimerDesc: "教育・研究目的",
    contact: "お問い合わせ",
    contactDesc: "データ修正・協業・サービス問い合わせ",
  },
  zh: {
    label: "Documentation",
    title: "透明公开数据解释规则和来源。",
    subtitle: "官方统计数据的更新时间因来源而异。",
    sources: "官方来源",
    sourcesDesc: "各官方数据的使用方式",
    methodology: "方法",
    methodologyDesc: "最新性优先顺序",
    disclaimer: "免责声明",
    disclaimerDesc: "仅用于教育和研究",
    contact: "联系",
    contactDesc: "数据修正、合作和服务咨询",
  },
  es: {
    label: "Documentation",
    title: "Reglas y fuentes publicadas de forma transparente.",
    subtitle: "Las estadísticas oficiales se actualizan en distintos ciclos.",
    sources: "Fuentes oficiales",
    sourcesDesc: "Uso de World Bank, UN Comtrade, WITS y EIA",
    methodology: "Metodología",
    methodologyDesc: "Prioridad 2026 → 2025 → 2024",
    disclaimer: "Aviso legal",
    disclaimerDesc: "Uso educativo e investigación",
    contact: "Contacto",
    contactDesc: "Correcciones, colaboración y servicio",
  },
  fr: {
    label: "Documentation",
    title: "Règles et sources publiées de manière transparente.",
    subtitle: "Les statistiques officielles suivent différents cycles.",
    sources: "Sources officielles",
    sourcesDesc: "Utilisation de World Bank, UN Comtrade, WITS et EIA",
    methodology: "Méthodologie",
    methodologyDesc: "Priorité 2026 → 2025 → 2024",
    disclaimer: "Avertissement",
    disclaimerDesc: "Usage éducatif et recherche",
    contact: "Contact",
    contactDesc: "Corrections, collaboration et service",
  },
  de: {
    label: "Documentation",
    title: "Regeln und Quellen werden transparent offengelegt.",
    subtitle: "Offizielle Statistiken haben unterschiedliche Aktualisierungszyklen.",
    sources: "Offizielle Quellen",
    sourcesDesc: "Nutzung von World Bank, UN Comtrade, WITS und EIA",
    methodology: "Methodik",
    methodologyDesc: "Priorität 2026 → 2025 → 2024",
    disclaimer: "Haftungsausschluss",
    disclaimerDesc: "Bildung und Forschung",
    contact: "Kontakt",
    contactDesc: "Korrekturen, Zusammenarbeit und Service",
  },
};

function LinkCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <a
      href={href}
      className="rounded-3xl border border-white/10 bg-[#0b0f1c] p-6 transition hover:bg-white/[0.06]"
    >
      <p className="text-lg font-bold text-white">{title}</p>
      <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
      <p className="mt-5 text-sm font-semibold text-indigo-300">Open →</p>
    </a>
  );
}

export default function HomeBottomLinks({
  language,
}: {
  language: Language;
}) {
  const t = copy[language] ?? copy.en;

  return (
    <section className="mx-auto max-w-7xl px-6 pb-20">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 lg:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-300">
          {t.label}
        </p>
        <h2 className="mt-4 max-w-4xl text-4xl font-bold leading-tight text-white">
          {t.title}
        </h2>
        <p className="mt-4 max-w-4xl text-base leading-7 text-slate-300">
          {t.subtitle}
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          <LinkCard href="/sources" title={t.sources} description={t.sourcesDesc} />
          <LinkCard
            href="/methodology"
            title={t.methodology}
            description={t.methodologyDesc}
          />
          <LinkCard
            href="/disclaimer"
            title={t.disclaimer}
            description={t.disclaimerDesc}
          />
          <LinkCard
            href="mailto:kevinsmp123@gmail.com"
            title={t.contact}
            description={t.contactDesc}
          />
        </div>
      </div>
    </section>
  );
}
