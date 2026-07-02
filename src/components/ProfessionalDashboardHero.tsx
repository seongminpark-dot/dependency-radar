"use client";

import { getFlagEmoji } from "@/lib/flags";

type Language = "ko" | "en" | "ja" | "zh" | "es" | "fr" | "de";

type HeroCopy = {
  badge: string;
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  tertiaryCta: string;
  stackTitle: string;
  newsTitle: string;
  newsDesc: string;
  issueTitle: string;
  issueDesc: string;
  dataTitle: string;
  dataDesc: string;
  currentCountry: string;
  coverage: string;
  indicators: string;
  source: string;
  sourceValue: string;
};

const copy: Record<Language, HeroCopy> = {
  ko: {
    badge: "Live news and official country data",
    title: "최신 글로벌 뉴스를 공식 국가 지표로 해석하세요.",
    subtitle:
      "Datlora는 무역, 에너지, 식량, 관세, 공급망 뉴스를 공식 공개 데이터와 연결해 국가별 구조적 노출도를 보여주는 글로벌 인텔리전스 플랫폼입니다.",
    primaryCta: "최신 뉴스 보기",
    secondaryCta: "이슈 브리프 보기",
    tertiaryCta: "국가 데이터 검색",
    stackTitle: "Datlora intelligence stack",
    newsTitle: "Live news",
    newsDesc: "글로벌 뉴스 흐름을 실시간에 가깝게 확인하고 원문 기사로 바로 이동합니다.",
    issueTitle: "Issue briefs",
    issueDesc: "Oil, food, tariff, supply chain 이슈를 공식 지표와 연결합니다.",
    dataTitle: "Official data",
    dataDesc: "World Bank, UN Comtrade, WITS, EIA 기반 국가별 구조 지표를 비교합니다.",
    currentCountry: "현재 접속 국가",
    coverage: "국가/경제권",
    indicators: "핵심 지표",
    source: "주요 출처",
    sourceValue: "World Bank / UN Comtrade / WITS / EIA",
  },
  en: {
    badge: "Live news and official country data",
    title: "Interpret global news with official country indicators.",
    subtitle:
      "Datlora connects trade, energy, food, tariff, and supply-chain news with public official datasets to show country-level structural exposure.",
    primaryCta: "View latest news",
    secondaryCta: "Explore issue briefs",
    tertiaryCta: "Search country data",
    stackTitle: "Datlora intelligence stack",
    newsTitle: "Live news",
    newsDesc: "Track recent global news and open original articles directly.",
    issueTitle: "Issue briefs",
    issueDesc: "Connect oil, food, tariff, and supply-chain issues with official indicators.",
    dataTitle: "Official data",
    dataDesc: "Compare country indicators from World Bank, UN Comtrade, WITS, and EIA sources.",
    currentCountry: "Current country",
    coverage: "Countries/economies",
    indicators: "Core indicators",
    source: "Primary sources",
    sourceValue: "World Bank / UN Comtrade / WITS / EIA",
  },
  ja: {
    badge: "Live news and official country data",
    title: "最新ニュースを公式統計で読み解きます。",
    subtitle:
      "Datloraは貿易、エネルギー、食料、関税、サプライチェーン関連ニュースを公式データと接続し、国別の構造的な露出度を示します。",
    primaryCta: "ニュースを見る",
    secondaryCta: "イシューブリーフ",
    tertiaryCta: "国データ検索",
    stackTitle: "Datlora intelligence stack",
    newsTitle: "Live news",
    newsDesc: "最新の国際ニュースを確認し、原文記事へ直接移動します。",
    issueTitle: "Issue briefs",
    issueDesc: "石油、食料、関税、供給網イシューを公式指標と接続します。",
    dataTitle: "Official data",
    dataDesc: "World Bank、UN Comtrade、WITS、EIAの国別指標を比較します。",
    currentCountry: "現在の接続国",
    coverage: "国/経済圏",
    indicators: "主要指標",
    source: "主要出典",
    sourceValue: "World Bank / UN Comtrade / WITS / EIA",
  },
  zh: {
    badge: "Live news and official country data",
    title: "用官方国家指标解读全球新闻。",
    subtitle:
      "Datlora 将贸易、能源、食品、关税和供应链新闻与官方公开数据连接，展示国家层面的结构性暴露。",
    primaryCta: "查看最新新闻",
    secondaryCta: "查看议题简报",
    tertiaryCta: "搜索国家数据",
    stackTitle: "Datlora intelligence stack",
    newsTitle: "Live news",
    newsDesc: "追踪近期全球新闻，并直接打开原文报道。",
    issueTitle: "Issue briefs",
    issueDesc: "将石油、食品、关税和供应链议题与官方指标连接。",
    dataTitle: "Official data",
    dataDesc: "比较 World Bank、UN Comtrade、WITS 和 EIA 的国家指标。",
    currentCountry: "当前访问国家",
    coverage: "国家/经济体",
    indicators: "核心指标",
    source: "主要来源",
    sourceValue: "World Bank / UN Comtrade / WITS / EIA",
  },
  es: {
    badge: "Live news and official country data",
    title: "Interpreta noticias globales con indicadores oficiales.",
    subtitle:
      "Datlora conecta noticias de comercio, energía, alimentos, aranceles y cadenas de suministro con datos públicos oficiales para mostrar exposición estructural por país.",
    primaryCta: "Ver noticias",
    secondaryCta: "Ver informes",
    tertiaryCta: "Buscar países",
    stackTitle: "Datlora intelligence stack",
    newsTitle: "Live news",
    newsDesc: "Sigue noticias globales recientes y abre los artículos originales.",
    issueTitle: "Issue briefs",
    issueDesc: "Conecta petróleo, alimentos, aranceles y cadenas de suministro con indicadores oficiales.",
    dataTitle: "Official data",
    dataDesc: "Compara indicadores de World Bank, UN Comtrade, WITS y EIA.",
    currentCountry: "País actual",
    coverage: "Países/economías",
    indicators: "Indicadores",
    source: "Fuentes principales",
    sourceValue: "World Bank / UN Comtrade / WITS / EIA",
  },
  fr: {
    badge: "Live news and official country data",
    title: "Interprétez l’actualité mondiale avec des indicateurs officiels.",
    subtitle:
      "Datlora relie les nouvelles sur le commerce, l’énergie, l’alimentation, les tarifs et les chaînes d’approvisionnement aux données publiques officielles.",
    primaryCta: "Voir les nouvelles",
    secondaryCta: "Voir les briefs",
    tertiaryCta: "Rechercher un pays",
    stackTitle: "Datlora intelligence stack",
    newsTitle: "Live news",
    newsDesc: "Suivez les nouvelles mondiales récentes et ouvrez les articles originaux.",
    issueTitle: "Issue briefs",
    issueDesc: "Relie pétrole, alimentation, tarifs et chaînes d’approvisionnement aux indicateurs officiels.",
    dataTitle: "Official data",
    dataDesc: "Compare les indicateurs World Bank, UN Comtrade, WITS et EIA.",
    currentCountry: "Pays actuel",
    coverage: "Pays/économies",
    indicators: "Indicateurs",
    source: "Sources principales",
    sourceValue: "World Bank / UN Comtrade / WITS / EIA",
  },
  de: {
    badge: "Live news and official country data",
    title: "Globale Nachrichten mit offiziellen Länderindikatoren einordnen.",
    subtitle:
      "Datlora verbindet Handels-, Energie-, Lebensmittel-, Zoll- und Lieferkettennachrichten mit offiziellen öffentlichen Datensätzen.",
    primaryCta: "Nachrichten ansehen",
    secondaryCta: "Issue Briefs ansehen",
    tertiaryCta: "Länderdaten suchen",
    stackTitle: "Datlora intelligence stack",
    newsTitle: "Live news",
    newsDesc: "Verfolgen Sie aktuelle globale Nachrichten und öffnen Sie Originalartikel direkt.",
    issueTitle: "Issue briefs",
    issueDesc: "Verbindet Öl-, Lebensmittel-, Zoll- und Lieferkettenfragen mit offiziellen Indikatoren.",
    dataTitle: "Official data",
    dataDesc: "Vergleicht World Bank, UN Comtrade, WITS und EIA Indikatoren.",
    currentCountry: "Aktuelles Land",
    coverage: "Länder/Volkswirtschaften",
    indicators: "Kernindikatoren",
    source: "Hauptquellen",
    sourceValue: "World Bank / UN Comtrade / WITS / EIA",
  },
};

export default function ProfessionalDashboardHero({
  language,
  visitorCountry,
  visitorCountryName,
  countryCount,
  indicatorCount,
}: {
  language: Language;
  visitorCountry: string;
  visitorCountryName: string;
  countryCount: number;
  indicatorCount: number;
}) {
  const t = copy[language] ?? copy.en;

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#070914]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(45,212,191,0.18),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(59,130,246,0.14),transparent_32%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <p className="mb-5 inline-flex rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-emerald-200">
              {t.badge}
            </p>

            <h1 className="max-w-5xl text-5xl font-black leading-[0.96] tracking-[-0.08em] text-white md:text-7xl">
              {t.title}
            </h1>

            <p className="mt-6 max-w-4xl text-base leading-8 text-slate-300 md:text-lg">
              {t.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/news"
                className="rounded-full bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
              >
                {t.primaryCta}
              </a>

              <a
                href="#issue-watch"
                className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
              >
                {t.secondaryCta}
              </a>

              <a
                href="#country-search"
                className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-black text-slate-200 transition hover:border-white/30 hover:bg-white/10"
              >
                {t.tertiaryCta}
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-5 shadow-2xl shadow-black/30 backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
              {t.stackTitle}
            </p>

            <div className="mt-5 grid gap-3">
              <a
                href="/news"
                className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 transition hover:border-emerald-300/45"
              >
                <strong className="block text-lg text-white">{t.newsTitle}</strong>
                <span className="mt-2 block text-sm leading-6 text-emerald-50/80">
                  {t.newsDesc}
                </span>
              </a>

              <a
                href="/issues"
                className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 transition hover:border-cyan-300/45"
              >
                <strong className="block text-lg text-white">{t.issueTitle}</strong>
                <span className="mt-2 block text-sm leading-6 text-cyan-50/80">
                  {t.issueDesc}
                </span>
              </a>

              <a
                href="#data"
                className="rounded-2xl border border-blue-300/20 bg-blue-300/10 p-4 transition hover:border-blue-300/45"
              >
                <strong className="block text-lg text-white">{t.dataTitle}</strong>
                <span className="mt-2 block text-sm leading-6 text-blue-50/80">
                  {t.dataDesc}
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-[#0b0f1c]/90 p-5">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              {t.currentCountry}
            </p>
            <p className="mt-3 text-2xl font-semibold text-white">
              {getFlagEmoji(visitorCountry)} {visitorCountryName}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0b0f1c]/90 p-5">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              {t.coverage}
            </p>
            <p className="mt-3 text-3xl font-semibold text-white">
              {countryCount.toLocaleString()}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0b0f1c]/90 p-5">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              {t.indicators}
            </p>
            <p className="mt-3 text-3xl font-semibold text-white">
              {indicatorCount}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0b0f1c]/90 p-5">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              {t.source}
            </p>
            <p className="mt-3 text-2xl font-semibold text-white">
              {t.sourceValue}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
