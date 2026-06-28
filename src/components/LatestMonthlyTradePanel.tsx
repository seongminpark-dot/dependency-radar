"use client";

import { useEffect, useState } from "react";

type Language = "ko" | "en" | "ja" | "zh" | "es" | "fr" | "de";

type MetricValue = {
  value: number | null;
  period: string | null;
  previousYearValue: number | null;
  yoyChange: number | null;
  shareOfTotal?: number | null;
};

type ComtradeResponse = {
  configured: boolean;
  iso3: string;
  source: string;
  note: string;
  latestPeriod: string | null;
  previousYearPeriod?: string | null;
  metrics: null | {
    totalImports: MetricValue;
    fuelImports: MetricValue;
    foodImports: MetricValue;
  };
};

const copy = {
  ko: {
    label: "Latest monthly trade",
    title: "UN Comtrade 최신 월간 수입 데이터",
    subtitle:
      "World Bank 연간 지표와 별도로, UN Comtrade 월간 공식 보고 데이터를 사용해 수입 관련 항목을 최신 월 기준으로 보강합니다.",
    totalImports: "총 상품 수입액",
    fuelImports: "연료 수입액",
    foodImports: "식량/농산물 수입액",
    value: "최신 월 값",
    period: "최신 월",
    share: "총 수입 대비 비중",
    yoy: "전년동월 대비",
    source: "출처",
    noData: "UN Comtrade 월간 데이터를 불러오지 못했거나, 해당 국가의 최신 월간 보고 데이터가 없습니다.",
    notConfigured: "COMTRADE_API_KEY가 Vercel 환경변수에 설정되어 있지 않습니다.",
    loading: "UN Comtrade 최신 월간 데이터를 불러오는 중입니다.",
    note:
      "국가별 보고 일정이 다르므로 모든 국가가 2026년 같은 월까지 제공되지는 않을 수 있습니다. 이 값은 추정치가 아니라 UN Comtrade에 보고된 월간 상품무역 데이터입니다.",
  },
  en: {
    label: "Latest monthly trade",
    title: "UN Comtrade latest monthly import data",
    subtitle:
      "Separate from annual World Bank indicators, this layer uses UN Comtrade monthly official reported data to enrich import-related metrics.",
    totalImports: "Total merchandise imports",
    fuelImports: "Fuel imports",
    foodImports: "Food/agricultural imports",
    value: "Latest monthly value",
    period: "Latest month",
    share: "Share of total imports",
    yoy: "Year-over-year",
    source: "Source",
    noData:
      "UN Comtrade monthly data could not be loaded, or this country does not have recent monthly reported data.",
    notConfigured: "COMTRADE_API_KEY is not configured in Vercel environment variables.",
    loading: "Loading UN Comtrade latest monthly data.",
    note:
      "Country reporting schedules differ, so not every country reports up to the same 2026 month. These are reported monthly merchandise trade values, not estimates.",
  },
  ja: {
    label: "Latest monthly trade",
    title: "UN Comtrade 最新月次輸入データ",
    subtitle: "World Bank年次指標とは別に、UN Comtrade月次報告データを表示します。",
    totalImports: "総商品輸入額",
    fuelImports: "燃料輸入額",
    foodImports: "食料/農産物輸入額",
    value: "最新月の値",
    period: "最新月",
    share: "総輸入比率",
    yoy: "前年同月比",
    source: "出典",
    noData: "UN Comtrade月次データを取得できませんでした。",
    notConfigured: "COMTRADE_API_KEYが設定されていません。",
    loading: "UN Comtradeデータを読み込んでいます。",
    note: "国ごとに報告時期が異なります。これは推定値ではなく報告データです。",
  },
  zh: {
    label: "Latest monthly trade",
    title: "UN Comtrade 最新月度进口数据",
    subtitle: "与 World Bank 年度指标分开显示，使用 UN Comtrade 月度官方报告数据。",
    totalImports: "商品进口总额",
    fuelImports: "燃料进口额",
    foodImports: "食品/农产品进口额",
    value: "最新月数值",
    period: "最新月份",
    share: "占总进口比重",
    yoy: "同比变化",
    source: "来源",
    noData: "无法加载 UN Comtrade 月度数据。",
    notConfigured: "未设置 COMTRADE_API_KEY。",
    loading: "正在加载 UN Comtrade 数据。",
    note: "各国报告时间不同。这些是报告的月度商品贸易数据，不是估计值。",
  },
  es: {
    label: "Latest monthly trade",
    title: "Datos mensuales recientes de importaciones UN Comtrade",
    subtitle: "Capa mensual oficial separada de los indicadores anuales del World Bank.",
    totalImports: "Importaciones totales",
    fuelImports: "Importaciones de combustibles",
    foodImports: "Importaciones de alimentos/agro",
    value: "Valor mensual reciente",
    period: "Mes reciente",
    share: "Participación en importaciones",
    yoy: "Interanual",
    source: "Fuente",
    noData: "No se pudieron cargar datos mensuales UN Comtrade.",
    notConfigured: "COMTRADE_API_KEY no está configurado.",
    loading: "Cargando datos UN Comtrade.",
    note: "Los calendarios de reporte varían por país. No son estimaciones.",
  },
  fr: {
    label: "Latest monthly trade",
    title: "Données mensuelles récentes UN Comtrade",
    subtitle: "Couche mensuelle officielle séparée des indicateurs annuels World Bank.",
    totalImports: "Importations totales",
    fuelImports: "Importations de combustibles",
    foodImports: "Importations alimentaires/agricoles",
    value: "Valeur mensuelle récente",
    period: "Mois récent",
    share: "Part des importations",
    yoy: "Variation annuelle",
    source: "Source",
    noData: "Impossible de charger les données mensuelles UN Comtrade.",
    notConfigured: "COMTRADE_API_KEY n’est pas configuré.",
    loading: "Chargement des données UN Comtrade.",
    note: "Les calendriers de déclaration varient selon les pays. Ce ne sont pas des estimations.",
  },
  de: {
    label: "Latest monthly trade",
    title: "Aktuelle monatliche UN-Comtrade-Importdaten",
    subtitle: "Offizielle monatliche Ebene getrennt von jährlichen World-Bank-Indikatoren.",
    totalImports: "Gesamtimporte",
    fuelImports: "Brennstoffimporte",
    foodImports: "Lebensmittel-/Agrarimporte",
    value: "Aktueller Monatswert",
    period: "Aktueller Monat",
    share: "Anteil an Gesamtimporten",
    yoy: "Vorjahr",
    source: "Quelle",
    noData: "UN-Comtrade-Monatsdaten konnten nicht geladen werden.",
    notConfigured: "COMTRADE_API_KEY ist nicht konfiguriert.",
    loading: "UN-Comtrade-Daten werden geladen.",
    note: "Berichtszeitpunkte variieren je nach Land. Dies sind gemeldete Werte, keine Schätzungen.",
  },
};

function languageToLocale(language: Language) {
  const map: Record<Language, string> = {
    ko: "ko-KR",
    en: "en-US",
    ja: "ja-JP",
    zh: "zh-CN",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
  };

  return map[language];
}

function formatUsd(value: number | null, language: Language) {
  if (value === null || value === undefined) return "—";

  return new Intl.NumberFormat(languageToLocale(language), {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number | null | undefined, language: Language) {
  if (value === null || value === undefined) return "—";

  return `${value.toLocaleString(languageToLocale(language), {
    maximumFractionDigits: 2,
  })}%`;
}

function formatPeriod(period: string | null, language: Language) {
  if (!period || !/^\d{6}$/.test(period)) return "—";

  const year = Number(period.slice(0, 4));
  const month = Number(period.slice(4, 6));

  return new Date(year, month - 1, 1).toLocaleDateString(
    languageToLocale(language),
    {
      year: "numeric",
      month: "long",
    }
  );
}

function MetricCard({
  title,
  metric,
  language,
  showShare,
}: {
  title: string;
  metric: MetricValue;
  language: Language;
  showShare?: boolean;
}) {
  const t = copy[language] ?? copy.en;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-5">
      <p className="text-sm font-semibold text-white">{title}</p>

      <div className="mt-4 grid gap-3">
        <div>
          <p className="text-xs text-slate-500">{t.value}</p>
          <p className="mt-1 text-2xl font-bold text-white">
            {formatUsd(metric.value, language)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <p className="text-xs text-slate-500">{t.period}</p>
            <p className="mt-1 font-semibold text-slate-200">
              {formatPeriod(metric.period, language)}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <p className="text-xs text-slate-500">
              {showShare ? t.share : t.yoy}
            </p>
            <p className="mt-1 font-semibold text-slate-200">
              {showShare
                ? formatPercent(metric.shareOfTotal, language)
                : formatPercent(metric.yoyChange, language)}
            </p>
          </div>
        </div>

        {showShare ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <p className="text-xs text-slate-500">{t.yoy}</p>
            <p className="mt-1 font-semibold text-slate-200">
              {formatPercent(metric.yoyChange, language)}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function LatestMonthlyTradePanel({
  iso3,
  countryName,
  language,
}: {
  iso3: string;
  countryName: string;
  language: Language;
}) {
  const [data, setData] = useState<ComtradeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const t = copy[language] ?? copy.en;

  useEffect(() => {
    const controller = new AbortController();

    async function loadComtrade() {
      setLoading(true);

      try {
        const response = await fetch(`/api/comtrade/${iso3}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        const json = await response.json();

        if (!controller.signal.aborted) {
          setData(json);
        }
      } catch {
        if (!controller.signal.aborted) {
          setData(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadComtrade();

    return () => {
      controller.abort();
    };
  }, [iso3]);

  const metrics = data?.metrics;

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <div className="mb-6">
          <p className="text-sm font-medium text-emerald-300">{t.label}</p>
          <h2 className="mt-2 text-3xl font-bold">{t.title}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">
            {countryName} · {t.subtitle}
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-5 text-sm text-slate-400">
            {t.loading}
          </div>
        ) : data && !data.configured ? (
          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-5 text-sm leading-6 text-amber-100">
            {t.notConfigured}
          </div>
        ) : !metrics ? (
          <div className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-5 text-sm text-slate-400">
            {t.noData}
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            <MetricCard
              title={t.totalImports}
              metric={metrics.totalImports}
              language={language}
            />
            <MetricCard
              title={t.fuelImports}
              metric={metrics.fuelImports}
              language={language}
              showShare
            />
            <MetricCard
              title={t.foodImports}
              metric={metrics.foodImports}
              language={language}
              showShare
            />
          </div>
        )}

        <div className="mt-5 grid gap-4 md:grid-cols-[1fr_280px]">
          <p className="rounded-2xl border border-blue-400/20 bg-blue-400/10 p-4 text-xs leading-5 text-blue-50/80">
            {t.note}
          </p>
          <p className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-4 text-xs leading-5 text-slate-400">
            {t.source}: {data?.source ?? "UN Comtrade API"}
          </p>
        </div>
      </div>
    </section>
  );
}
