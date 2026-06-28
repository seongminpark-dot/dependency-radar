"use client";

import { useMemo } from "react";
import type { CountryRow, StatValue } from "@/lib/worldBank";

type Language = "ko" | "en" | "ja" | "zh" | "es" | "fr" | "de";

type MetricKey =
  | "energyImportPercent"
  | "fuelImportShare"
  | "foodImportShare"
  | "importsGdp"
  | "importUsd"
  | "tariffRate"
  | "logisticsIndex";

const copy = {
  ko: {
    sectionLabel: "Regional Position",
    title: "지역 내 위치 분석",
    subtitle:
      "같은 지역에 속한 국가들과 비교해 이 국가의 각 지표가 어느 정도 위치에 있는지 보여줍니다.",
    note:
      "순위는 같은 지역에서 값이 큰 순서입니다. 높은 순위가 항상 더 좋다는 의미는 아닙니다.",
    rank: "지역 내 순위",
    outOf: "개 국가 중",
    noData: "데이터 없음",
    relativePosition: "상대 위치",
    energy: "에너지 순수입",
    fuel: "연료 수입 비중",
    food: "식량 수입 비중",
    importsGdp: "수입/GDP",
    importsUsd: "총 수입액",
    tariff: "관세율",
    logistics: "물류지수",
  },
  en: {
    sectionLabel: "Regional Position",
    title: "Regional position analysis",
    subtitle:
      "Compare this country’s indicators against other countries in the same region.",
    note:
      "Ranks are based on higher values within the same region. A higher rank does not always mean better performance.",
    rank: "Regional rank",
    outOf: "countries",
    noData: "No data",
    relativePosition: "Relative position",
    energy: "Energy net imports",
    fuel: "Fuel import share",
    food: "Food import share",
    importsGdp: "Imports/GDP",
    importsUsd: "Total imports",
    tariff: "Tariff rate",
    logistics: "Logistics index",
  },
  ja: {
    sectionLabel: "Regional Position",
    title: "地域内の位置分析",
    subtitle:
      "同じ地域の国と比較して、この国の各指標がどの位置にあるかを表示します。",
    note:
      "順位は同じ地域内で値が大きい順です。順位が高いことが常に良い意味とは限りません。",
    rank: "地域内順位",
    outOf: "か国中",
    noData: "データなし",
    relativePosition: "相対位置",
    energy: "エネルギー純輸入",
    fuel: "燃料輸入比率",
    food: "食料輸入比率",
    importsGdp: "輸入/GDP",
    importsUsd: "総輸入額",
    tariff: "関税率",
    logistics: "物流指数",
  },
  zh: {
    sectionLabel: "Regional Position",
    title: "区域内位置分析",
    subtitle: "将该国指标与同一区域内其他国家进行比较。",
    note: "排名按同一区域内数值从高到低排列。排名较高并不一定代表表现更好。",
    rank: "区域内排名",
    outOf: "个国家中",
    noData: "无数据",
    relativePosition: "相对位置",
    energy: "能源净进口",
    fuel: "燃料进口占比",
    food: "食品进口占比",
    importsGdp: "进口/GDP",
    importsUsd: "总进口额",
    tariff: "关税率",
    logistics: "物流指数",
  },
  es: {
    sectionLabel: "Regional Position",
    title: "Análisis de posición regional",
    subtitle:
      "Compara los indicadores de este país con otros países de la misma región.",
    note:
      "Las posiciones se ordenan por valores más altos dentro de la misma región. Una posición alta no siempre significa mejor desempeño.",
    rank: "Posición regional",
    outOf: "países",
    noData: "Sin datos",
    relativePosition: "Posición relativa",
    energy: "Importación neta de energía",
    fuel: "Participación de combustibles",
    food: "Participación de alimentos",
    importsGdp: "Importaciones/GDP",
    importsUsd: "Importaciones totales",
    tariff: "Arancel",
    logistics: "Índice logístico",
  },
  fr: {
    sectionLabel: "Regional Position",
    title: "Analyse de position régionale",
    subtitle:
      "Compare les indicateurs de ce pays avec les autres pays de la même région.",
    note:
      "Les rangs sont basés sur les valeurs les plus élevées dans la même région. Un rang élevé ne signifie pas toujours une meilleure performance.",
    rank: "Rang régional",
    outOf: "pays",
    noData: "Aucune donnée",
    relativePosition: "Position relative",
    energy: "Importations nettes d’énergie",
    fuel: "Part des combustibles",
    food: "Part alimentaire",
    importsGdp: "Importations/GDP",
    importsUsd: "Importations totales",
    tariff: "Tarif douanier",
    logistics: "Indice logistique",
  },
  de: {
    sectionLabel: "Regional Position",
    title: "Regionale Positionsanalyse",
    subtitle:
      "Vergleicht die Indikatoren dieses Landes mit anderen Ländern derselben Region.",
    note:
      "Ränge basieren auf höheren Werten innerhalb derselben Region. Ein höherer Rang bedeutet nicht immer bessere Leistung.",
    rank: "Regionaler Rang",
    outOf: "Ländern",
    noData: "Keine Daten",
    relativePosition: "Relative Position",
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

function formatValue(stat: StatValue, metric: MetricKey, language: Language) {
  if (stat.value === null) return "—";

  if (metric === "importUsd") {
    return new Intl.NumberFormat(languageToLocale(language), {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(stat.value);
  }

  if (metric === "logisticsIndex") {
    return stat.value.toLocaleString(languageToLocale(language), {
      maximumFractionDigits: 2,
    });
  }

  return `${stat.value.toLocaleString(languageToLocale(language), {
    maximumFractionDigits: 2,
  })}%`;
}

function getInsight(row: CountryRow, rows: CountryRow[], metric: MetricKey) {
  const currentValue = row[metric].value;

  const regionalRows = rows
    .filter(
      (item) =>
        item.region === row.region &&
        item[metric].value !== null &&
        !Number.isNaN(item[metric].value)
    )
    .sort((a, b) => {
      return (b[metric].value ?? 0) - (a[metric].value ?? 0);
    });

  if (currentValue === null || regionalRows.length === 0) {
    return {
      rank: null,
      total: regionalRows.length,
      position: 0,
    };
  }

  const rank = regionalRows.findIndex((item) => item.iso3 === row.iso3) + 1;

  const values = regionalRows
    .map((item) => item[metric].value)
    .filter((value): value is number => value !== null);

  const min = Math.min(...values);
  const max = Math.max(...values);

  const position = max === min ? 50 : ((currentValue - min) / (max - min)) * 100;

  return {
    rank: rank > 0 ? rank : null,
    total: regionalRows.length,
    position: Math.max(0, Math.min(100, position)),
  };
}

export default function RegionalInsightSection({
  row,
  rows,
  language,
}: {
  row: CountryRow;
  rows: CountryRow[];
  language: Language;
}) {
  const t = copy[language];

  const metrics = useMemo(
    () => [
      {
        key: "energyImportPercent" as const,
        label: t.energy,
      },
      {
        key: "fuelImportShare" as const,
        label: t.fuel,
      },
      {
        key: "foodImportShare" as const,
        label: t.food,
      },
      {
        key: "importsGdp" as const,
        label: t.importsGdp,
      },
      {
        key: "importUsd" as const,
        label: t.importsUsd,
      },
      {
        key: "tariffRate" as const,
        label: t.tariff,
      },
      {
        key: "logisticsIndex" as const,
        label: t.logistics,
      },
    ],
    [t]
  );

  return (
    <section className="mx-auto max-w-7xl px-6 pb-12">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <div className="mb-6">
          <p className="text-sm font-medium text-indigo-300">
            {t.sectionLabel}
          </p>
          <h2 className="mt-2 text-3xl font-bold">{t.title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            {t.subtitle}
          </p>
          <p className="mt-3 max-w-3xl text-xs leading-5 text-slate-500">
            {t.note}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {metrics.map((metric) => {
            const stat = row[metric.key];
            const insight = getInsight(row, rows, metric.key);

            return (
              <div
                key={metric.key}
                className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">{metric.label}</p>
                    <p className="mt-2 text-2xl font-bold">
                      {formatValue(stat, metric.key, language)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {stat.year ?? t.noData}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-right">
                    <p className="text-xs text-slate-500">{t.rank}</p>
                    <p className="mt-1 text-sm font-bold text-indigo-200">
                      {insight.rank
                        ? `#${insight.rank} / ${insight.total}`
                        : t.noData}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-600">
                      {insight.total} {t.outOf}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                    <span>{t.relativePosition}</span>
                    <span>{Math.round(insight.position)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div
                      className="h-2 rounded-full bg-indigo-400"
                      style={{ width: `${insight.position}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
