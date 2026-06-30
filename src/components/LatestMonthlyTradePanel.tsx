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
  reporterCode: string | null;
  source: string;
  note: string;
  frequency: "M" | "A" | null;
  latestPeriod: string | null;
  quotaExceeded?: boolean;
  fallback?: boolean;
  emptyFallback?: boolean;
  metrics: null | {
    totalImports: MetricValue;
    totalExports: MetricValue;
    tradeBalance: MetricValue;
    fuelImports: MetricValue;
    foodImports: MetricValue;
  };
};

const copy = {
  ko: {
    label: "Latest official trade layer",
    title: "UN Comtrade 최신 무역 데이터",
    subtitle:
      "World Bank 연간 지표와 별도로, UN Comtrade 공식 보고 데이터로 수입·수출·무역수지를 최신 제공 기간 기준으로 보강합니다.",
    totalImports: "총 상품 수입액",
    totalExports: "총 상품 수출액",
    tradeBalance: "상품 무역수지",
    fuelImports: "연료 수입액",
    foodImports: "식량/농산물 수입액",
    value: "최신값",
    period: "최신 기간",
    share: "총 수입 대비 비중",
    yoy: "전년 동기 대비",
    source: "출처",
    reporter: "Reporter code",
    monthly: "월간 데이터",
    annual: "연간 데이터",
    noData:
      "이 국가는 아직 저장된 UN Comtrade 공식 응답값이 없습니다. API 한도가 풀리면 공식값으로 자동 표시됩니다.",
    notConfigured: "COMTRADE_API_KEY가 Vercel 환경변수에 설정되어 있지 않습니다.",
    loading: "UN Comtrade 공식 무역 데이터를 불러오는 중입니다.",
    note:
      "국가별 보고 일정이 다르므로 모든 국가가 같은 최신 월까지 제공되지는 않습니다. 이 값은 추정치가 아니라 UN Comtrade에 보고된 공식 상품무역 데이터입니다.",
    fallbackNote:
      "최신 공식 제공 기간 기준으로 표시합니다. 표시값은 저장된 UN Comtrade 공식 응답 스냅샷이며, 추정값을 사용하지 않습니다.",
    limitedTitle: "공식 데이터 동기화 대기",
    limitedDesc:
      "이 국가는 아직 저장된 공식 응답 스냅샷이 없어 숫자를 임의로 표시하지 않습니다.",
    limitedNext:
      "공식 데이터가 확인되는 즉시 실제 UN Comtrade 값으로 표시됩니다.",
    noEstimate: "추정값 미사용",
  },
  en: {
    label: "Latest official trade layer",
    title: "UN Comtrade latest trade data",
    subtitle:
      "Separate from annual World Bank indicators, this layer uses official UN Comtrade reported data to enrich imports, exports, and merchandise trade balance.",
    totalImports: "Total merchandise imports",
    totalExports: "Total merchandise exports",
    tradeBalance: "Merchandise trade balance",
    fuelImports: "Fuel imports",
    foodImports: "Food/agricultural imports",
    value: "Latest value",
    period: "Latest period",
    share: "Share of total imports",
    yoy: "Year-over-year",
    source: "Source",
    reporter: "Reporter code",
    monthly: "Monthly data",
    annual: "Annual data",
    noData:
      "No saved official UN Comtrade response is available for this country yet. Official values will appear when the API limit resets.",
    notConfigured: "COMTRADE_API_KEY is not configured in Vercel environment variables.",
    loading: "Loading official UN Comtrade trade data.",
    note:
      "Country reporting schedules differ, so not every country reports up to the same latest month. These are reported official merchandise trade values, not estimates.",
    fallbackNote:
      "Shown by latest available official period. Values come from a saved official UN Comtrade response snapshot, not estimates.",
    limitedTitle: "Official data sync pending",
    limitedDesc:
      "No saved official response snapshot is available for this country, so estimated values are not displayed.",
    limitedNext:
      "When official data is available, this section will update automatically.",
    noEstimate: "No estimated values",
  },
  ja: {
    label: "Latest official trade layer",
    title: "UN Comtrade 最新貿易データ",
    subtitle: "UN Comtradeの公式報告データで輸出入と貿易収支を補強します。",
    totalImports: "総商品輸入額",
    totalExports: "総商品輸出額",
    tradeBalance: "商品貿易収支",
    fuelImports: "燃料輸入額",
    foodImports: "食料/農産物輸入額",
    value: "最新値",
    period: "最新期間",
    share: "総輸入比率",
    yoy: "前年同期比",
    source: "出典",
    reporter: "Reporter code",
    monthly: "月次データ",
    annual: "年次データ",
    noData: "この国の保存済み公式応答はまだありません。",
    notConfigured: "COMTRADE_API_KEYが設定されていません。",
    loading: "UN Comtradeデータを読み込んでいます。",
    note: "国ごとに報告時期が異なります。これは推定値ではありません。",
    fallbackNote: "保存済みの公式応答スナップショットを表示しています。推定値ではありません。",
    limitedTitle: "公式データ同期待ち",
    limitedDesc: "保存済み公式応答がないため推定値は表示しません。",
    limitedNext: "制限解除後に公式値へ自動更新されます。",
    noEstimate: "推定値なし",
  },
  zh: {
    label: "Latest official trade layer",
    title: "UN Comtrade 最新贸易数据",
    subtitle: "使用 UN Comtrade 官方报告数据补充进出口和商品贸易差额。",
    totalImports: "商品进口总额",
    totalExports: "商品出口总额",
    tradeBalance: "商品贸易差额",
    fuelImports: "燃料进口额",
    foodImports: "食品/农产品进口额",
    value: "最新值",
    period: "最新期间",
    share: "占总进口比重",
    yoy: "同比变化",
    source: "来源",
    reporter: "Reporter code",
    monthly: "月度数据",
    annual: "年度数据",
    noData: "该国家尚无保存的官方响应。",
    notConfigured: "未设置 COMTRADE_API_KEY。",
    loading: "正在加载 UN Comtrade 数据。",
    note: "各国报告时间不同。这些是官方报告数据，不是估计值。",
    fallbackNote: "API 限制期间显示保存的官方响应。",
    limitedTitle: "官方数据同步中",
    limitedDesc: "没有保存的官方响应，因此不显示估算值。",
    limitedNext: "官方数据确认后将自动显示。",
    noEstimate: "不使用估算值",
  },
  es: {
    label: "Latest official trade layer",
    title: "Datos comerciales recientes UN Comtrade",
    subtitle: "Capa oficial de comercio separada de los indicadores anuales World Bank.",
    totalImports: "Importaciones totales",
    totalExports: "Exportaciones totales",
    tradeBalance: "Balanza comercial",
    fuelImports: "Importaciones de combustibles",
    foodImports: "Importaciones de alimentos/agro",
    value: "Valor reciente",
    period: "Periodo reciente",
    share: "Participación",
    yoy: "Interanual",
    source: "Fuente",
    reporter: "Reporter code",
    monthly: "Datos mensuales",
    annual: "Datos anuales",
    noData: "No hay respuesta oficial guardada para este país.",
    notConfigured: "COMTRADE_API_KEY no está configurado.",
    loading: "Cargando datos UN Comtrade.",
    note: "Los calendarios de reporte varían por país. No son estimaciones.",
    fallbackNote: "Se muestra una respuesta oficial guardada. No es una estimación.",
    limitedTitle: "Sincronización de datos oficiales",
    limitedDesc: "No se muestran estimaciones.",
    limitedNext: "Los datos oficiales aparecerán cuando se reinicie el límite.",
    noEstimate: "Sin estimaciones",
  },
  fr: {
    label: "Latest official trade layer",
    title: "Données commerciales récentes UN Comtrade",
    subtitle: "Couche officielle de commerce séparée des indicateurs annuels World Bank.",
    totalImports: "Importations totales",
    totalExports: "Exportations totales",
    tradeBalance: "Balance commerciale",
    fuelImports: "Importations de combustibles",
    foodImports: "Importations alimentaires/agricoles",
    value: "Valeur récente",
    period: "Période récente",
    share: "Part des importations",
    yoy: "Variation annuelle",
    source: "Source",
    reporter: "Reporter code",
    monthly: "Données mensuelles",
    annual: "Données annuelles",
    noData: "Aucune réponse officielle sauvegardée pour ce pays.",
    notConfigured: "COMTRADE_API_KEY n’est pas configuré.",
    loading: "Chargement des données UN Comtrade.",
    note: "Les calendriers de déclaration varient selon les pays. Ce ne sont pas des estimations.",
    fallbackNote: "Réponse officielle sauvegardée affichée. Ce n’est pas une estimation.",
    limitedTitle: "Synchronisation des données officielles",
    limitedDesc: "Aucune estimation n’est affichée.",
    limitedNext: "Les données officielles apparaîtront après réinitialisation.",
    noEstimate: "Pas d’estimation",
  },
  de: {
    label: "Latest official trade layer",
    title: "Aktuelle UN-Comtrade-Handelsdaten",
    subtitle: "Offizielle Handelsebene getrennt von jährlichen World-Bank-Indikatoren.",
    totalImports: "Gesamtimporte",
    totalExports: "Gesamtexporte",
    tradeBalance: "Handelsbilanz",
    fuelImports: "Brennstoffimporte",
    foodImports: "Lebensmittel-/Agrarimporte",
    value: "Aktueller Wert",
    period: "Aktueller Zeitraum",
    share: "Anteil",
    yoy: "Vorjahr",
    source: "Quelle",
    reporter: "Reporter code",
    monthly: "Monatsdaten",
    annual: "Jahresdaten",
    noData: "Keine gespeicherte offizielle Antwort für dieses Land.",
    notConfigured: "COMTRADE_API_KEY ist nicht konfiguriert.",
    loading: "UN-Comtrade-Daten werden geladen.",
    note: "Berichtszeitpunkte variieren je nach Land. Dies sind keine Schätzungen.",
    fallbackNote: "Gespeicherte offizielle Antwort wird angezeigt. Dies ist keine Schätzung.",
    limitedTitle: "Offizielle Datensynchronisierung",
    limitedDesc: "Es werden keine Schätzwerte angezeigt.",
    limitedNext: "Offizielle Daten erscheinen nach dem Limit-Reset.",
    noEstimate: "Keine Schätzwerte",
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
  if (!period) return "—";

  if (/^\d{6}$/.test(period)) {
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

  if (/^\d{4}$/.test(period)) {
    return period;
  }

  return period;
}

function StatusCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-5">
      <p className="text-xs text-slate-500">{title}</p>
      <p className="mt-2 text-xl font-bold text-white">{value}</p>
    </div>
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
          cache: "force-cache",
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
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-300">{t.label}</p>
            <h2 className="mt-2 text-3xl font-bold">{t.title}</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">
              {countryName} · {t.subtitle}
            </p>
          </div>

          {data?.frequency ? (
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
              {`${data.frequency === "M" ? t.monthly : t.annual} · ${formatPeriod(data.latestPeriod, language)}`}
            </div>
          ) : null}
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-5 text-sm text-slate-400">
            {t.loading}
          </div>
        ) : data && !data.configured ? (
          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-5 text-sm leading-6 text-amber-100">
            {t.notConfigured}
          </div>
        ) : data?.emptyFallback ? (
          <div className="grid gap-4 md:grid-cols-3">
            <StatusCard title={t.limitedTitle} value={t.noEstimate} />
            <StatusCard title={t.reporter} value={data.reporterCode ?? iso3} />
            <StatusCard title={t.source} value={data?.source ?? "UN Comtrade API"} />
            <div className="md:col-span-3 rounded-2xl border border-blue-400/20 bg-blue-400/10 p-5 text-sm leading-6 text-blue-50/80">
              {t.limitedDesc}
              <br />
              {t.limitedNext}
            </div>
          </div>
        ) : !metrics ? (
          <div className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-5 text-sm text-slate-400">
            {t.noData}
            {data?.reporterCode ? (
              <p className="mt-2 text-xs text-slate-500">
                {t.reporter}: {data.reporterCode}
              </p>
            ) : null}
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            <MetricCard
              title={t.totalImports}
              metric={metrics.totalImports}
              language={language}
            />
            <MetricCard
              title={t.totalExports}
              metric={metrics.totalExports}
              language={language}
            />
            <MetricCard
              title={t.tradeBalance}
              metric={metrics.tradeBalance}
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
            {data?.emptyFallback
              ? t.limitedDesc
              : data?.fallback
                ? `${t.fallbackNote} ${t.period}: ${formatPeriod(data.latestPeriod, language)}.`
                : t.note}
          </p>
          <p className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-4 text-xs leading-5 text-slate-400">
            {t.source}: {data?.source ?? "UN Comtrade API"}
            {data?.reporterCode ? (
              <>
                <br />
                {t.reporter}: {data.reporterCode}
              </>
            ) : null}
          </p>
        </div>
      </div>
    </section>
  );
}
