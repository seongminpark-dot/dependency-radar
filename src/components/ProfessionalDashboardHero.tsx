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
    sourceYearNote: string;
    nextDataLayer: string;
    nextDataLayerDesc: string;
  }
> = {
  ko: {
    badge: "Official statistics dashboard",
    title: "국가별 공급망 의존도를 공식 통계로 비교합니다.",
    subtitle:
      "World Bank 공개 지표를 기반으로 에너지, 연료, 식량, 수입, 관세, 물류 데이터를 국가별로 비교하고, 각 지표의 최신 제공 연도를 함께 표시합니다.",
    official: "공식 최신값 기준",
    officialDesc:
      "추정 카운터가 아니라 각 출처가 제공하는 최신 공식 연도 값을 표시합니다.",
    freshness: "데이터 최신성 표시",
    freshnessDesc:
      "각 셀 아래의 연도는 해당 지표가 제공되는 최신 연도입니다.",
    coverage: "국가/경제권",
    indicators: "핵심 지표",
    currentCountry: "현재 접속 국가",
    source: "주요 출처",
    sourceValue: "World Bank API",
    sourceYearNote: "지표별 제공 연도는 국가와 지표에 따라 다릅니다.",
    nextDataLayer: "다음 데이터 확장",
    nextDataLayerDesc:
      "UN Comtrade 월간 무역, IMF 거시지표, OECD 단기 지표를 추가하면 최신성이 더 높아집니다.",
  },
  en: {
    badge: "Official statistics dashboard",
    title: "Compare country supply dependency with official statistics.",
    subtitle:
      "Dependency Radar compares energy, fuel, food, imports, tariffs, and logistics indicators by country using public World Bank data, while showing the latest available year for each indicator.",
    official: "Official latest values",
    officialDesc:
      "The site shows the latest source-provided official values, not estimated live counters.",
    freshness: "Source-year transparency",
    freshnessDesc:
      "The year below each value shows the latest available year for that indicator.",
    coverage: "Countries/economies",
    indicators: "Core indicators",
    currentCountry: "Current country",
    source: "Primary source",
    sourceValue: "World Bank API",
    sourceYearNote:
      "Source years vary by country and indicator depending on official availability.",
    nextDataLayer: "Next data layer",
    nextDataLayerDesc:
      "Adding UN Comtrade monthly trade, IMF macro data, and OECD short-term indicators can improve freshness.",
  },
  ja: {
    badge: "Official statistics dashboard",
    title: "各国の供給依存度を公式統計で比較します。",
    subtitle:
      "World Bank公開データを基に、エネルギー、燃料、食料、輸入、関税、物流指標を比較します。",
    official: "公式最新値",
    officialDesc: "推定ライブカウンターではなく、出典が提供する最新公式値を表示します。",
    freshness: "データ年の透明性",
    freshnessDesc: "各値の下に、その指標の最新提供年を表示します。",
    coverage: "国/経済圏",
    indicators: "主要指標",
    currentCountry: "現在の接続国",
    source: "主要出典",
    sourceValue: "World Bank API",
    sourceYearNote: "提供年は国と指標によって異なります。",
    nextDataLayer: "次のデータ拡張",
    nextDataLayerDesc: "月次貿易データや短期指標を追加すると最新性が高まります。",
  },
  zh: {
    badge: "Official statistics dashboard",
    title: "使用官方统计比较各国供应依赖度。",
    subtitle:
      "基于 World Bank 公开数据比较能源、燃料、食品、进口、关税和物流指标。",
    official: "官方最新值",
    officialDesc: "显示来源提供的最新官方数值，而不是估算实时计数器。",
    freshness: "数据年份透明",
    freshnessDesc: "每个数值下方显示该指标的最新可用年份。",
    coverage: "国家/经济体",
    indicators: "核心指标",
    currentCountry: "当前访问国家",
    source: "主要来源",
    sourceValue: "World Bank API",
    sourceYearNote: "数据年份因国家和指标而异。",
    nextDataLayer: "下一步数据扩展",
    nextDataLayerDesc: "可增加月度贸易数据、IMF 宏观数据和 OECD 短期指标。",
  },
  es: {
    badge: "Official statistics dashboard",
    title: "Compara la dependencia de suministro con estadísticas oficiales.",
    subtitle:
      "Compara energía, combustibles, alimentos, importaciones, aranceles y logística usando datos públicos del World Bank.",
    official: "Valores oficiales recientes",
    officialDesc: "Muestra valores oficiales disponibles, no contadores estimados en vivo.",
    freshness: "Transparencia del año",
    freshnessDesc: "El año bajo cada valor muestra el último año disponible.",
    coverage: "Países/economías",
    indicators: "Indicadores",
    currentCountry: "País actual",
    source: "Fuente principal",
    sourceValue: "World Bank API",
    sourceYearNote: "El año disponible varía por país e indicador.",
    nextDataLayer: "Próxima capa de datos",
    nextDataLayerDesc: "UN Comtrade, IMF y OECD pueden mejorar la actualidad.",
  },
  fr: {
    badge: "Official statistics dashboard",
    title: "Comparez la dépendance d’approvisionnement avec des statistiques officielles.",
    subtitle:
      "Compare les indicateurs d’énergie, combustibles, alimentation, importations, droits de douane et logistique.",
    official: "Valeurs officielles récentes",
    officialDesc: "Affiche les dernières valeurs officielles disponibles, pas des estimations en direct.",
    freshness: "Transparence des années",
    freshnessDesc: "L’année sous chaque valeur indique la dernière année disponible.",
    coverage: "Pays/économies",
    indicators: "Indicateurs",
    currentCountry: "Pays actuel",
    source: "Source principale",
    sourceValue: "World Bank API",
    sourceYearNote: "Les années varient selon les pays et les indicateurs.",
    nextDataLayer: "Prochaine couche de données",
    nextDataLayerDesc: "UN Comtrade, IMF et OECD peuvent améliorer l’actualité.",
  },
  de: {
    badge: "Official statistics dashboard",
    title: "Vergleichen Sie Lieferabhängigkeit mit offiziellen Statistiken.",
    subtitle:
      "Vergleicht Energie, Brennstoffe, Lebensmittel, Importe, Zölle und Logistik anhand öffentlicher World-Bank-Daten.",
    official: "Offizielle aktuelle Werte",
    officialDesc: "Zeigt offiziell verfügbare Werte, keine geschätzten Live-Zähler.",
    freshness: "Transparente Datenjahre",
    freshnessDesc: "Das Jahr unter jedem Wert zeigt das aktuellste verfügbare Jahr.",
    coverage: "Länder/Volkswirtschaften",
    indicators: "Indikatoren",
    currentCountry: "Aktuelles Land",
    source: "Hauptquelle",
    sourceValue: "World Bank API",
    sourceYearNote: "Datenjahre variieren je nach Land und Indikator.",
    nextDataLayer: "Nächste Datenebene",
    nextDataLayerDesc: "UN Comtrade, IMF und OECD können die Aktualität verbessern.",
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
        <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-end">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-slate-300">
              {t.badge}
            </p>

            <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-white md:text-6xl">
              {t.title}
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
              {t.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-emerald-100">
                {t.official}
              </span>
              <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-blue-100">
                {t.freshness}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-slate-300">
                {t.sourceValue}
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm font-semibold text-slate-200">
              {t.nextDataLayer}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              {t.nextDataLayerDesc}
            </p>
            <div className="mt-5 rounded-2xl border border-white/10 bg-[#0b0f1c] p-4">
              <p className="text-xs text-slate-500">{t.sourceYearNote}</p>
            </div>
          </div>
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
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm font-semibold text-white">{t.official}</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {t.officialDesc}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm font-semibold text-white">{t.freshness}</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {t.freshnessDesc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
