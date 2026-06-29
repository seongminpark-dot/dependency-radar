"use client";

import { getFlagEmoji } from "@/lib/flags";

type Language = "ko" | "en" | "ja" | "zh" | "es" | "fr" | "de";

const copy: Record<
  Language,
  {
    badge: string;
    title: string;
    subtitle: string;
    official: string;
    officialDesc: string;
    freshness: string;
    freshnessDesc: string;
    coverage: string;
    indicators: string;
    currentCountry: string;
    source: string;
    sourceValue: string;
  }
> = {
  ko: {
    badge: "Official statistics dashboard",
    title: "국가별 공급망 의존도를 공식 통계로 비교합니다.",
    subtitle:
      "World Bank 공식 최신 지표와 IMF 2025/2026 전망 데이터를 분리해서 보여주는 글로벌 공급망·무역 통계 플랫폼입니다.",
    official: "공식 통계와 전망치 분리",
    officialDesc:
      "World Bank 값은 공식 최신 제공 연도 기준이며, 2025/2026 값은 IMF 전망 레이어에서 별도로 표시합니다.",
    freshness: "지표별 연도 표시",
    freshnessDesc:
      "각 값 아래의 연도는 해당 지표가 실제로 제공되는 최신 연도입니다.",
    coverage: "국가/경제권",
    indicators: "핵심 지표",
    currentCountry: "현재 접속 국가",
    source: "주요 출처",
    sourceValue: "World Bank / UN Comtrade / IMF",
  },
  en: {
    badge: "Official statistics dashboard",
    title: "Compare country supply dependency with official statistics.",
    subtitle:
      "A global supply-chain and trade statistics platform separating official World Bank values from IMF 2025/2026 outlook data.",
    official: "Official values and forecasts separated",
    officialDesc:
      "World Bank values use the latest officially available source year, while 2025/2026 values are shown separately through the IMF outlook layer.",
    freshness: "Indicator-level source years",
    freshnessDesc:
      "The year below each value shows the actual latest available source year for that indicator.",
    coverage: "Countries/economies",
    indicators: "Core indicators",
    currentCountry: "Current country",
    source: "Primary sources",
    sourceValue: "World Bank / UN Comtrade / IMF",
  },
  ja: {
    badge: "Official statistics dashboard",
    title: "各国の供給依存度を公式統計で比較します。",
    subtitle: "World Bank公式値とIMF 2025/2026 전망 데이터를 분리해 표시합니다.",
    official: "公式値と予測値を分離",
    officialDesc: "World Bank値とIMF 전망치를 별도로 표시합니다.",
    freshness: "指標別データ年",
    freshnessDesc: "各値の下に最新提供年を 표시합니다.",
    coverage: "国/経済圏",
    indicators: "主要指標",
    currentCountry: "現在の接続国",
    source: "主要出典",
    sourceValue: "World Bank / UN Comtrade / IMF",
  },
  zh: {
    badge: "Official statistics dashboard",
    title: "使用官方统计比较各国供应依赖度。",
    subtitle: "分离显示 World Bank 官方值和 IMF 2025/2026 전망 数据。",
    official: "官方值与预测分离",
    officialDesc: "World Bank 官方值和 IMF 전망 数据分开显示。",
    freshness: "指标年份透明",
    freshnessDesc: "每个值下方显示最新可用年份。",
    coverage: "国家/经济体",
    indicators: "核心指标",
    currentCountry: "当前访问国家",
    source: "主要来源",
    sourceValue: "World Bank / UN Comtrade / IMF",
  },
  es: {
    badge: "Official statistics dashboard",
    title: "Compara la dependencia de suministro con estadísticas oficiales.",
    subtitle: "Separa valores oficiales del World Bank y perspectivas IMF 2025/2026.",
    official: "Valores oficiales y previsiones separados",
    officialDesc: "Los valores World Bank y las previsiones IMF se muestran por separado.",
    freshness: "Años por indicador",
    freshnessDesc: "El año bajo cada valor muestra el último año disponible.",
    coverage: "Países/economías",
    indicators: "Indicadores",
    currentCountry: "País actual",
    source: "Fuentes principales",
    sourceValue: "World Bank / UN Comtrade / IMF",
  },
  fr: {
    badge: "Official statistics dashboard",
    title: "Comparez la dépendance d’approvisionnement avec des statistiques officielles.",
    subtitle: "Sépare les valeurs World Bank et les perspectives IMF 2025/2026.",
    official: "Valeurs officielles et prévisions séparées",
    officialDesc: "Les valeurs World Bank et les prévisions IMF sont séparées.",
    freshness: "Années par indicateur",
    freshnessDesc: "L’année sous chaque valeur indique la dernière année disponible.",
    coverage: "Pays/économies",
    indicators: "Indicateurs",
    currentCountry: "Pays actuel",
    source: "Sources principales",
    sourceValue: "World Bank / UN Comtrade / IMF",
  },
  de: {
    badge: "Official statistics dashboard",
    title: "Vergleichen Sie Lieferabhängigkeit mit offiziellen Statistiken.",
    subtitle: "Trennt World-Bank-Werte und IMF-Ausblicksdaten 2025/2026.",
    official: "Offizielle Werte und Prognosen getrennt",
    officialDesc: "World-Bank-Werte und IMF-Prognosen werden getrennt angezeigt.",
    freshness: "Datenjahre pro Indikator",
    freshnessDesc: "Das Jahr unter jedem Wert zeigt das neueste verfügbare Jahr.",
    coverage: "Länder/Volkswirtschaften",
    indicators: "Indikatoren",
    currentCountry: "Aktuelles Land",
    source: "Hauptquellen",
    sourceValue: "World Bank / UN Comtrade / IMF",
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
    <section className="border-b border-white/10 bg-[#070914]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-slate-300">
            {t.badge}
          </p>

          <h1 className="max-w-5xl text-4xl font-semibold tracking-[-0.04em] text-white md:text-6xl">
            {t.title}
          </h1>

          <p className="mt-6 max-w-4xl text-base leading-8 text-slate-300 md:text-lg">
            {t.subtitle}
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-5">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              {t.currentCountry}
            </p>
            <p className="mt-3 text-2xl font-semibold text-white">
              {getFlagEmoji(visitorCountry)} {visitorCountryName}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-5">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              {t.coverage}
            </p>
            <p className="mt-3 text-3xl font-semibold text-white">
              {countryCount.toLocaleString()}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-5">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              {t.indicators}
            </p>
            <p className="mt-3 text-3xl font-semibold text-white">
              {indicatorCount}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-5">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              {t.source}
            </p>
            <p className="mt-3 text-2xl font-semibold text-white">
              {t.sourceValue}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
            <p className="text-sm font-semibold text-emerald-100">{t.official}</p>
            <p className="mt-2 text-sm leading-6 text-emerald-50/80">
              {t.officialDesc}
            </p>
          </div>

          <div className="rounded-2xl border border-blue-400/20 bg-blue-400/10 p-5">
            <p className="text-sm font-semibold text-blue-100">{t.freshness}</p>
            <p className="mt-2 text-sm leading-6 text-blue-50/80">
              {t.freshnessDesc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
