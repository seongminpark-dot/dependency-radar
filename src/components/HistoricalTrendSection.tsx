"use client";

import { useEffect, useMemo, useState } from "react";

type Language = "ko" | "en" | "ja" | "zh" | "es" | "fr" | "de";

type MetricKey =
  | "energyImportPercent"
  | "fuelImportShare"
  | "foodImportShare"
  | "importsGdp"
  | "importUsd"
  | "tariffRate"
  | "logisticsIndex";

type TrendPoint = {
  year: string;
  value: number;
};

const indicatorCodes: Record<MetricKey, string> = {
  energyImportPercent: "EG.IMP.CONS.ZS",
  fuelImportShare: "TM.VAL.FUEL.ZS.UN",
  foodImportShare: "TM.VAL.FOOD.ZS.UN",
  importsGdp: "NE.IMP.GNFS.ZS",
  importUsd: "NE.IMP.GNFS.CD",
  tariffRate: "TM.TAX.MRCH.WM.AR.ZS",
  logisticsIndex: "LP.LPI.OVRL.XQ",
};

const copy = {
  ko: {
    sectionLabel: "Historical Trend",
    title: "시계열 추세",
    subtitle:
      "World Bank API에서 제공되는 최근 연도 데이터를 기준으로 선택한 지표의 변화를 보여줍니다.",
    metric: "차트 지표",
    latestValue: "최신값",
    latestYear: "최신 연도",
    source: "데이터 출처",
    sourceValue: "World Bank API",
    loading: "차트 데이터를 불러오는 중입니다.",
    noData: "이 지표의 시계열 데이터가 충분하지 않습니다.",
    note:
      "일부 국가는 특정 지표가 매년 제공되지 않을 수 있습니다. 그래프는 제공된 연도만 연결합니다.",
    energy: "에너지 순수입",
    fuel: "연료 수입 비중",
    food: "식량 수입 비중",
    importsGdp: "수입/GDP",
    importsUsd: "총 수입액",
    tariff: "관세율",
    logistics: "물류지수",
  },
  en: {
    sectionLabel: "Historical Trend",
    title: "Historical trend",
    subtitle:
      "This chart shows how the selected indicator changed over recent years using World Bank API data.",
    metric: "Chart metric",
    latestValue: "Latest value",
    latestYear: "Latest year",
    source: "Data source",
    sourceValue: "World Bank API",
    loading: "Loading chart data.",
    noData: "Not enough time-series data is available for this indicator.",
    note:
      "Some countries do not report every indicator every year. The chart connects only available years.",
    energy: "Energy net imports",
    fuel: "Fuel import share",
    food: "Food import share",
    importsGdp: "Imports/GDP",
    importsUsd: "Total imports",
    tariff: "Tariff rate",
    logistics: "Logistics index",
  },
  ja: {
    sectionLabel: "Historical Trend",
    title: "時系列トレンド",
    subtitle:
      "World Bank APIの最近のデータを使って、選択した指標の変化を表示します。",
    metric: "チャート指標",
    latestValue: "最新値",
    latestYear: "最新年",
    source: "データ出典",
    sourceValue: "World Bank API",
    loading: "チャートデータを読み込んでいます。",
    noData: "この指標の時系列データが十分ではありません。",
    note:
      "一部の国ではすべての指標が毎年提供されるわけではありません。",
    energy: "エネルギー純輸入",
    fuel: "燃料輸入比率",
    food: "食料輸入比率",
    importsGdp: "輸入/GDP",
    importsUsd: "総輸入額",
    tariff: "関税率",
    logistics: "物流指数",
  },
  zh: {
    sectionLabel: "Historical Trend",
    title: "历史趋势",
    subtitle: "使用 World Bank API 最近年份数据展示所选指标变化。",
    metric: "图表指标",
    latestValue: "最新值",
    latestYear: "最新年份",
    source: "数据来源",
    sourceValue: "World Bank API",
    loading: "正在加载图表数据。",
    noData: "该指标的时间序列数据不足。",
    note: "部分国家并非每年都提供所有指标。",
    energy: "能源净进口",
    fuel: "燃料进口占比",
    food: "食品进口占比",
    importsGdp: "进口/GDP",
    importsUsd: "总进口额",
    tariff: "关税率",
    logistics: "物流指数",
  },
  es: {
    sectionLabel: "Historical Trend",
    title: "Tendencia histórica",
    subtitle:
      "El gráfico muestra la evolución reciente del indicador seleccionado con datos del World Bank API.",
    metric: "Indicador del gráfico",
    latestValue: "Valor más reciente",
    latestYear: "Año más reciente",
    source: "Fuente de datos",
    sourceValue: "World Bank API",
    loading: "Cargando datos del gráfico.",
    noData: "No hay suficientes datos de serie temporal para este indicador.",
    note:
      "Algunos países no reportan todos los indicadores cada año.",
    energy: "Importación neta de energía",
    fuel: "Participación de combustibles",
    food: "Participación de alimentos",
    importsGdp: "Importaciones/GDP",
    importsUsd: "Importaciones totales",
    tariff: "Arancel",
    logistics: "Índice logístico",
  },
  fr: {
    sectionLabel: "Historical Trend",
    title: "Tendance historique",
    subtitle:
      "Ce graphique montre l’évolution récente de l’indicateur sélectionné avec les données de la World Bank API.",
    metric: "Indicateur du graphique",
    latestValue: "Valeur la plus récente",
    latestYear: "Année la plus récente",
    source: "Source des données",
    sourceValue: "World Bank API",
    loading: "Chargement des données du graphique.",
    noData: "Les données de série temporelle sont insuffisantes pour cet indicateur.",
    note:
      "Certains pays ne publient pas tous les indicateurs chaque année.",
    energy: "Importations nettes d’énergie",
    fuel: "Part des combustibles",
    food: "Part alimentaire",
    importsGdp: "Importations/GDP",
    importsUsd: "Importations totales",
    tariff: "Tarif douanier",
    logistics: "Indice logistique",
  },
  de: {
    sectionLabel: "Historical Trend",
    title: "Historischer Trend",
    subtitle:
      "Dieses Diagramm zeigt die Entwicklung des ausgewählten Indikators anhand der World-Bank-API-Daten.",
    metric: "Diagrammindikator",
    latestValue: "Neuester Wert",
    latestYear: "Neuestes Jahr",
    source: "Datenquelle",
    sourceValue: "World Bank API",
    loading: "Diagrammdaten werden geladen.",
    noData: "Für diesen Indikator sind nicht genügend Zeitreihendaten verfügbar.",
    note:
      "Einige Länder melden nicht jeden Indikator in jedem Jahr.",
    energy: "Nettoenergieimporte",
    fuel: "Brennstoffimportanteil",
    food: "Lebensmittelimportanteil",
    importsGdp: "Importe/GDP",
    importsUsd: "Gesamtimporte",
    tariff: "Zollsatz",
    logistics: "Logistikindex",
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

function formatValue(value: number, metric: MetricKey, language: Language) {
  if (metric === "importUsd") {
    return new Intl.NumberFormat(languageToLocale(language), {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(value);
  }

  if (metric === "logisticsIndex") {
    return value.toLocaleString(languageToLocale(language), {
      maximumFractionDigits: 2,
    });
  }

  return `${value.toLocaleString(languageToLocale(language), {
    maximumFractionDigits: 2,
  })}%`;
}

function buildLinePath(points: TrendPoint[]) {
  if (points.length === 0) return "";

  const width = 760;
  const height = 260;
  const paddingX = 52;
  const paddingY = 32;

  const values = points.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  return points
    .map((point, index) => {
      const x =
        points.length === 1
          ? width / 2
          : paddingX + (index / (points.length - 1)) * chartWidth;

      const y =
        max === min
          ? height / 2
          : paddingY + (1 - (point.value - min) / (max - min)) * chartHeight;

      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

function getPointPosition(
  point: TrendPoint,
  index: number,
  points: TrendPoint[]
) {
  const width = 760;
  const height = 260;
  const paddingX = 52;
  const paddingY = 32;

  const values = points.map((item) => item.value);
  const min = Math.min(...values);
  const max = Math.max(...values);

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const x =
    points.length === 1
      ? width / 2
      : paddingX + (index / (points.length - 1)) * chartWidth;

  const y =
    max === min
      ? height / 2
      : paddingY + (1 - (point.value - min) / (max - min)) * chartHeight;

  return { x, y };
}

export default function HistoricalTrendSection({
  iso3,
  countryName,
  language,
}: {
  iso3: string;
  countryName: string;
  language: Language;
}) {
  const [metric, setMetric] = useState<MetricKey>("importsGdp");
  const [points, setPoints] = useState<TrendPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const t = copy[language];

  const metrics = useMemo(
    () => [
      { key: "energyImportPercent" as const, label: t.energy },
      { key: "fuelImportShare" as const, label: t.fuel },
      { key: "foodImportShare" as const, label: t.food },
      { key: "importsGdp" as const, label: t.importsGdp },
      { key: "importUsd" as const, label: t.importsUsd },
      { key: "tariffRate" as const, label: t.tariff },
      { key: "logisticsIndex" as const, label: t.logistics },
    ],
    [t]
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadSeries() {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/series/${iso3}?indicator=${indicatorCodes[metric]}`,
          {
            signal: controller.signal,
          }
        );

        const data = await response.json();

        setPoints(data.points ?? []);
      } catch {
        if (!controller.signal.aborted) {
          setPoints([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadSeries();

    return () => {
      controller.abort();
    };
  }, [iso3, metric]);

  const linePath = buildLinePath(points);
  const latestPoint = points[points.length - 1];
  const values = points.map((point) => point.value);
  const minValue = values.length ? Math.min(...values) : null;
  const maxValue = values.length ? Math.max(...values) : null;
  const firstYear = points[0]?.year;
  const lastYear = points[points.length - 1]?.year;

  return (
    <section className="mx-auto max-w-7xl px-6 pb-12">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-300">
              {t.sectionLabel}
            </p>
            <h2 className="mt-2 text-3xl font-bold">{t.title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              {countryName} · {t.subtitle}
            </p>
          </div>

          <label className="rounded-2xl border border-white/10 bg-[#0b0f1c] px-4 py-3 text-sm text-slate-300">
            <span className="mb-2 block text-xs text-slate-500">
              {t.metric}
            </span>
            <select
              value={metric}
              onChange={(event) => setMetric(event.target.value as MetricKey)}
              className="w-full bg-[#0b0f1c] text-white outline-none"
            >
              {metrics.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-5">
            <p className="text-sm text-slate-400">{t.latestValue}</p>
            <p className="mt-2 text-2xl font-bold">
              {latestPoint ? formatValue(latestPoint.value, metric, language) : "—"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-5">
            <p className="text-sm text-slate-400">{t.latestYear}</p>
            <p className="mt-2 text-2xl font-bold">{latestPoint?.year ?? "—"}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-5">
            <p className="text-sm text-slate-400">{t.source}</p>
            <p className="mt-2 text-2xl font-bold">{t.sourceValue}</p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f1c] p-4">
          {loading ? (
            <div className="flex h-[320px] items-center justify-center text-sm text-slate-400">
              {t.loading}
            </div>
          ) : points.length < 2 ? (
            <div className="flex h-[320px] items-center justify-center text-sm text-slate-400">
              {t.noData}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <svg
                  viewBox="0 0 760 260"
                  className="min-w-[760px] w-full"
                  role="img"
                  aria-label={`${countryName} historical trend chart`}
                >
                  <line x1="52" y1="32" x2="52" y2="228" stroke="#334155" />
                  <line x1="52" y1="228" x2="708" y2="228" stroke="#334155" />

                  {[0, 1, 2, 3].map((index) => {
                    const y = 32 + index * 65.33;
                    return (
                      <line
                        key={index}
                        x1="52"
                        y1={y}
                        x2="708"
                        y2={y}
                        stroke="#1f2937"
                      />
                    );
                  })}

                  <path
                    d={linePath}
                    fill="none"
                    stroke="#818cf8"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {points.map((point, index) => {
                    const position = getPointPosition(point, index, points);
                    const isLast = index === points.length - 1;

                    return (
                      <g key={point.year}>
                        <circle
                          cx={position.x}
                          cy={position.y}
                          r={isLast ? 5 : 3}
                          fill={isLast ? "#fbbf24" : "#c7d2fe"}
                        />
                        {isLast ? (
                          <text
                            x={position.x}
                            y={position.y - 12}
                            fill="#cbd5e1"
                            fontSize="11"
                            textAnchor="middle"
                          >
                            {formatValue(point.value, metric, language)}
                          </text>
                        ) : null}
                      </g>
                    );
                  })}

                  <text x="52" y="250" fill="#64748b" fontSize="12">
                    {firstYear}
                  </text>
                  <text x="708" y="250" fill="#64748b" fontSize="12" textAnchor="end">
                    {lastYear}
                  </text>

                  {maxValue !== null ? (
                    <text x="10" y="38" fill="#64748b" fontSize="11">
                      {formatValue(maxValue, metric, language)}
                    </text>
                  ) : null}

                  {minValue !== null ? (
                    <text x="10" y="228" fill="#64748b" fontSize="11">
                      {formatValue(minValue, metric, language)}
                    </text>
                  ) : null}
                </svg>
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-500">
                {t.note}
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
