"use client";

import { useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import type { CountryRow, StatValue } from "@/lib/worldBank";
import { getFlagEmoji } from "@/lib/flags";

type Language = "ko" | "en" | "ja" | "zh" | "es" | "fr" | "de";

type MapGeography = {
  rsmKey: string;
  properties: {
    name?: string;
  };
  [key: string]: unknown;
};

type MetricKey =
  | "energyImportPercent"
  | "fuelImportShare"
  | "foodImportShare"
  | "importsGdp"
  | "importUsd"
  | "tariffRate"
  | "logisticsIndex";

const geographyUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const copy = {
  ko: {
    title: "세계 지도 시각화",
    subtitle: "선택한 지표를 기준으로 국가별 수치를 지도에서 비교합니다.",
    metric: "지도 지표",
    source:
      "Map boundary source: Natural Earth / world-atlas. Data source: World Bank API.",
    noData: "데이터 없음",
    topCountries: "상위 국가",
  },
  en: {
    title: "World map visualization",
    subtitle:
      "Compare country-level values on the map using the selected indicator.",
    metric: "Map metric",
    source:
      "Map boundary source: Natural Earth / world-atlas. Data source: World Bank API.",
    noData: "No data",
    topCountries: "Top countries",
  },
  ja: {
    title: "世界地図の可視化",
    subtitle: "選択した指標に基づいて国別の数値を地図で比較します。",
    metric: "地図指標",
    source:
      "Map boundary source: Natural Earth / world-atlas. Data source: World Bank API.",
    noData: "データなし",
    topCountries: "上位国",
  },
  zh: {
    title: "世界地图可视化",
    subtitle: "根据所选指标在地图上比较各国数值。",
    metric: "地图指标",
    source:
      "Map boundary source: Natural Earth / world-atlas. Data source: World Bank API.",
    noData: "无数据",
    topCountries: "排名靠前国家",
  },
  es: {
    title: "Visualización del mapa mundial",
    subtitle: "Compara valores por país en el mapa según el indicador elegido.",
    metric: "Indicador del mapa",
    source:
      "Map boundary source: Natural Earth / world-atlas. Data source: World Bank API.",
    noData: "Sin datos",
    topCountries: "Países principales",
  },
  fr: {
    title: "Visualisation de la carte mondiale",
    subtitle:
      "Comparez les valeurs par pays sur la carte selon l’indicateur choisi.",
    metric: "Indicateur cartographique",
    source:
      "Map boundary source: Natural Earth / world-atlas. Data source: World Bank API.",
    noData: "Aucune donnée",
    topCountries: "Principaux pays",
  },
  de: {
    title: "Weltkarten-Visualisierung",
    subtitle:
      "Vergleichen Sie Länderwerte auf der Karte anhand des ausgewählten Indikators.",
    metric: "Kartenindikator",
    source:
      "Map boundary source: Natural Earth / world-atlas. Data source: World Bank API.",
    noData: "Keine Daten",
    topCountries: "Top-Länder",
  },
};

const metricLabels: Record<Language, Record<MetricKey, string>> = {
  ko: {
    energyImportPercent: "에너지 순수입",
    fuelImportShare: "연료 수입 비중",
    foodImportShare: "식량 수입 비중",
    importsGdp: "수입/GDP",
    importUsd: "총 수입액",
    tariffRate: "관세율",
    logisticsIndex: "물류지수",
  },
  en: {
    energyImportPercent: "Energy net imports",
    fuelImportShare: "Fuel import share",
    foodImportShare: "Food import share",
    importsGdp: "Imports/GDP",
    importUsd: "Total imports",
    tariffRate: "Tariff rate",
    logisticsIndex: "Logistics index",
  },
  ja: {
    energyImportPercent: "エネルギー純輸入",
    fuelImportShare: "燃料輸入比率",
    foodImportShare: "食料輸入比率",
    importsGdp: "輸入/GDP",
    importUsd: "総輸入額",
    tariffRate: "関税率",
    logisticsIndex: "物流指数",
  },
  zh: {
    energyImportPercent: "能源净进口",
    fuelImportShare: "燃料进口占比",
    foodImportShare: "食品进口占比",
    importsGdp: "进口/GDP",
    importUsd: "总进口额",
    tariffRate: "关税率",
    logisticsIndex: "物流指数",
  },
  es: {
    energyImportPercent: "Importación neta de energía",
    fuelImportShare: "Participación de combustibles",
    foodImportShare: "Participación de alimentos",
    importsGdp: "Importaciones/GDP",
    importUsd: "Importaciones totales",
    tariffRate: "Arancel",
    logisticsIndex: "Índice logístico",
  },
  fr: {
    energyImportPercent: "Importations nettes d’énergie",
    fuelImportShare: "Part des combustibles",
    foodImportShare: "Part alimentaire",
    importsGdp: "Importations/GDP",
    importUsd: "Importations totales",
    tariffRate: "Tarif douanier",
    logisticsIndex: "Indice logistique",
  },
  de: {
    energyImportPercent: "Nettoenergieimporte",
    fuelImportShare: "Brennstoffimportanteil",
    foodImportShare: "Lebensmittelimportanteil",
    importsGdp: "Importe/GDP",
    importUsd: "Gesamtimporte",
    tariffRate: "Zollsatz",
    logisticsIndex: "Logistikindex",
  },
};

const geographyNameAliases: Record<string, string> = {
  "United States of America": "United States",
  Russia: "Russian Federation",
  Iran: "Iran, Islamic Rep.",
  Venezuela: "Venezuela, RB",
  Vietnam: "Viet Nam",
  Egypt: "Egypt, Arab Rep.",
  "South Korea": "Korea, Rep.",
  "North Korea": "Korea, Dem. People's Rep.",
  Laos: "Lao PDR",
  Syria: "Syrian Arab Republic",
  Yemen: "Yemen, Rep.",
  "Dem. Rep. Congo": "Congo, Dem. Rep.",
  Congo: "Congo, Rep.",
  "Dominican Rep.": "Dominican Republic",
  "Central African Rep.": "Central African Republic",
  "Eq. Guinea": "Equatorial Guinea",
  "S. Sudan": "South Sudan",
  "Bosnia and Herz.": "Bosnia and Herzegovina",
  "Solomon Is.": "Solomon Islands",
  "Czech Republic": "Czechia",
  Slovakia: "Slovak Republic",
  Brunei: "Brunei Darussalam",
  "The Bahamas": "Bahamas, The",
  Gambia: "Gambia, The",
  Kyrgyzstan: "Kyrgyz Republic",
  Macedonia: "North Macedonia",
  "Ivory Coast": "Cote d'Ivoire",
  "Cape Verde": "Cabo Verde",
  "East Timor": "Timor-Leste",
  Swaziland: "Eswatini",
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

function normalizeName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getLocalizedCountryName(row: CountryRow, language: Language) {
  try {
    const displayNames = new Intl.DisplayNames([languageToLocale(language)], {
      type: "region",
    });

    return displayNames.of(row.iso2) ?? row.name;
  } catch {
    return row.name;
  }
}

function getStat(row: CountryRow, metric: MetricKey): StatValue {
  return row[metric];
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

function getMapFill(value: number | null, maxValue: number) {
  if (value === null || maxValue <= 0) return "#151827";

  const ratio = Math.max(0, Math.min(1, value / maxValue));

  if (ratio >= 0.8) return "#818cf8";
  if (ratio >= 0.6) return "#6366f1";
  if (ratio >= 0.4) return "#4f46e5";
  if (ratio >= 0.2) return "#3730a3";

  return "#1e1b4b";
}

export default function WorldMap({
  rows,
  language,
  visitorCountry,
}: {
  rows: CountryRow[];
  language: Language;
  visitorCountry: string;
}) {
  const [metric, setMetric] = useState<MetricKey>("importsGdp");
  const t = copy[language];

  const rowByName = useMemo(() => {
    const map = new Map<string, CountryRow>();

    for (const row of rows) {
      map.set(normalizeName(row.name), row);
    }

    return map;
  }, [rows]);

  const maxValue = useMemo(() => {
    const values = rows
      .map((row) => getStat(row, metric).value)
      .filter((value): value is number => value !== null && value > 0);

    return Math.max(...values, 0);
  }, [rows, metric]);

  const topRows = useMemo(() => {
    return [...rows]
      .filter((row) => getStat(row, metric).value !== null)
      .sort((a, b) => {
        return (getStat(b, metric).value ?? 0) - (getStat(a, metric).value ?? 0);
      })
      .slice(0, 8);
  }, [rows, metric]);

  function findRowByGeographyName(geoName: string) {
    const targetName = geographyNameAliases[geoName] ?? geoName;
    return rowByName.get(normalizeName(targetName));
  }

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-300">
            Geographic Visualization
          </p>
          <h2 className="mt-2 text-3xl font-bold">{t.title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            {t.subtitle}
          </p>
        </div>

        <div>
          <label className="mb-2 block text-xs text-slate-500">{t.metric}</label>
          <select
            value={metric}
            onChange={(event) => setMetric(event.target.value as MetricKey)}
            className="rounded-2xl border border-white/10 bg-[#111524] px-4 py-3 text-sm text-white outline-none"
          >
            {Object.entries(metricLabels[language]).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-4">
          <ComposableMap projectionConfig={{ scale: 145 }}>
            <ZoomableGroup center={[0, 20]} zoom={1}>
              <Geographies geography={geographyUrl}>
                {({ geographies }: { geographies: MapGeography[] }) =>
                  geographies.map((geo) => {
                    const geoName = geo.properties.name ?? "Unknown";
                    const row = findRowByGeographyName(geoName);
                    const stat = row ? getStat(row, metric) : null;
                    const value = stat?.value ?? null;
                    const isVisitorCountry = row?.iso2 === visitorCountry;

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={
                          isVisitorCountry
                            ? "#fbbf24"
                            : getMapFill(value, maxValue)
                        }
                        stroke="#273044"
                        strokeWidth={0.35}
                        onClick={() => {
                          if (row) {
                            window.location.href = `/country/${row.iso3}`;
                          }
                        }}
                        style={{
                          default: { outline: "none" },
                          hover: {
                            fill: "#a5b4fc",
                            outline: "none",
                            cursor: "pointer",
                          },
                          pressed: { outline: "none" },
                        }}
                      >
                        <title>
                          {row
                            ? `${getFlagEmoji(row.iso2)} ${getLocalizedCountryName(
                                row,
                                language
                              )}: ${formatValue(stat!, metric, language)}`
                            : `${geoName}: ${t.noData}`}
                        </title>
                      </Geography>
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>

          <p className="mt-3 text-xs text-slate-500">{t.source}</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="text-lg font-bold">{t.topCountries}</h3>

          <div className="mt-4 space-y-3">
            {topRows.map((row, index) => {
              const stat = getStat(row, metric);

              return (
                <div
                  key={row.iso3}
                  className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 last:border-b-0"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      #{index + 1} {getFlagEmoji(row.iso2)} {getLocalizedCountryName(row, language)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {row.name} · {row.iso3}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold">
                      {formatValue(stat, metric, language)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {stat.year ?? "No year"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
