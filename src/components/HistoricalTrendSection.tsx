"use client";

import { useEffect, useMemo, useState } from "react";

type Language = "ko" | "en" | "ja" | "zh" | "es" | "fr" | "de";
type LooseCountryRow = Record<string, unknown>;

type Observation = {
  year: string;
  value: number;
};

type SeriesResponse = {
  ok: boolean;
  iso3: string;
  metric: string;
  indicator: string;
  labelKo: string;
  labelEn: string;
  unit: string;
  source: string;
  observations: Observation[];
  latestValue: number | null;
  latestYear: string | null;
  count?: number;
  message?: string;
};

type Props = {
  row?: LooseCountryRow | null;
  country?: LooseCountryRow | null;
  selectedCountry?: LooseCountryRow | null;
  countryData?: LooseCountryRow | null;
  iso3?: string;
  countryName?: string;
  language?: string;
  [key: string]: unknown;
};

const metricOptions = [
  {
    key: "importsGdp",
    ko: "수입/GDP",
    en: "Imports/GDP",
  },
  {
    key: "importUsd",
    ko: "총 수입액",
    en: "Import value",
  },
  {
    key: "fuelImportShare",
    ko: "연료 수입 비중",
    en: "Fuel imports",
  },
  {
    key: "foodImportShare",
    ko: "식량 수입 비중",
    en: "Food imports",
  },
  {
    key: "energyImportPercent",
    ko: "에너지 순수입",
    en: "Net energy imports",
  },
  {
    key: "tariffRate",
    ko: "관세율",
    en: "Tariff rate",
  },
  {
    key: "logisticsIndex",
    ko: "물류지수",
    en: "Logistics index",
  },
];

const copy = {
  ko: {
    label: "Historical trend",
    title: "시계열 추세",
    subtitle:
      "World Bank API에서 제공되는 연도별 공식값을 기준으로 선택한 지표의 변화를 보여줍니다.",
    selectLabel: "차트 지표",
    latestValue: "최신값",
    latestYear: "최신 연도",
    source: "데이터 출처",
    noData:
      "이 지표의 시계열 값을 아직 가져오지 못했습니다. 다른 지표를 선택하거나 잠시 후 다시 확인하세요.",
    loading: "시계열 데이터를 불러오는 중입니다.",
    observations: "관측치",
    yearRange: "연도 범위",
  },
  en: {
    label: "Historical trend",
    title: "Historical trend",
    subtitle:
      "Shows year-by-year official values from the World Bank API for the selected indicator.",
    selectLabel: "Chart indicator",
    latestValue: "Latest value",
    latestYear: "Latest year",
    source: "Data source",
    noData:
      "This indicator's time-series values could not be loaded yet. Try another indicator or check again later.",
    loading: "Loading time-series data.",
    observations: "Observations",
    yearRange: "Year range",
  },
};

function normalizeLanguage(language?: string): Language {
  const supported = ["ko", "en", "ja", "zh", "es", "fr", "de"];

  return supported.includes(language ?? "") ? (language as Language) : "ko";
}

function getText(language: Language) {
  return language === "ko" ? copy.ko : copy.en;
}

function getString(row: LooseCountryRow | null | undefined, keys: string[]) {
  if (!row) return "";

  for (const key of keys) {
    const value = row[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function getFlagEmoji(iso2: string) {
  if (!iso2 || iso2.length !== 2) return "";

  return iso2
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

function formatValue(value: number | null, unit: string, language: Language) {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";

  const locale = language === "ko" ? "ko-KR" : "en-US";

  if (unit === "current US$") {
    const billion = value / 1_000_000_000;

    return `US$${billion.toLocaleString(locale, {
      maximumFractionDigits: 2,
    })}B`;
  }

  if (unit === "%") {
    return `${value.toLocaleString(locale, {
      maximumFractionDigits: 2,
    })}%`;
  }

  return value.toLocaleString(locale, {
    maximumFractionDigits: 2,
  });
}

function buildLinePath(points: Observation[], width: number, height: number) {
  if (points.length < 2) return "";

  const values = points.map((point) => point.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue || 1;

  return points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * width;
      const y = height - ((point.value - minValue) / range) * height;

      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function MiniLineChart({
  observations,
}: {
  observations: Observation[];
}) {
  const chartData = useMemo(() => {
    if (observations.length <= 40) return observations;

    return observations.slice(-40);
  }, [observations]);

  if (chartData.length < 2) {
    return null;
  }

  const width = 900;
  const height = 280;
  const path = buildLinePath(chartData, width, height);
  const first = chartData[0];
  const last = chartData[chartData.length - 1];

  return (
    <div className="mt-6 rounded-3xl border border-white/10 bg-[#0b0f1c] p-5">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Historical trend line chart"
        className="h-[280px] w-full overflow-visible"
      >
        {[0, 1, 2, 3].map((line) => {
          const y = (height / 3) * line;

          return (
            <line
              key={line}
              x1="0"
              x2={width}
              y1={y}
              y2={y}
              stroke="rgba(148, 163, 184, 0.16)"
              strokeWidth="1"
            />
          );
        })}

        <path
          d={path}
          fill="none"
          stroke="rgba(129, 140, 248, 0.95)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle
          cx={width}
          cy={path ? Number(path.split(" ").at(-1)) || 0 : 0}
          r="5"
          fill="rgba(129, 140, 248, 1)"
        />
      </svg>

      <div className="mt-3 flex justify-between text-xs font-semibold text-slate-500">
        <span>{first?.year}</span>
        <span>{last?.year}</span>
      </div>
    </div>
  );
}

export default function HistoricalTrendSection(props: Props) {
  const row =
    props.row ??
    props.country ??
    props.selectedCountry ??
    props.countryData ??
    null;

  const language = normalizeLanguage(props.language);
  const t = getText(language);
  const isKo = language === "ko";

  const iso3 =
    props.iso3 ??
    getString(row, ["iso3", "cca3", "countryCode", "id", "countryiso3code"]);

  const countryName =
    props.countryName ??
    getString(row, ["name", "countryName", "displayName", "nameEn", "officialName"]) ??
    iso3;

  const iso2 = getString(row, ["iso2", "cca2"]);
  const flag = getFlagEmoji(iso2);

  const [metric, setMetric] = useState("importsGdp");
  const [data, setData] = useState<SeriesResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!iso3) return;

    const controller = new AbortController();

    async function loadSeries() {
      setLoading(true);

      try {
        const response = await fetch(`/api/series/${iso3}?metric=${metric}`, {
          signal: controller.signal,
          cache: "no-store",
        });

        const json = (await response.json()) as SeriesResponse;
        setData(json);
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

    loadSeries();

    return () => controller.abort();
  }, [iso3, metric]);

  if (!iso3) {
    return null;
  }

  const observations = data?.observations ?? [];
  const firstYear = observations[0]?.year;
  const lastYear = observations[observations.length - 1]?.year;

  return (
    <section className="mx-auto max-w-7xl px-6 pb-10">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-300">
              {t.label}
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              {t.title}
            </h2>

            <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-300">
              {flag ? `${flag} ` : ""}
              {countryName} · {t.subtitle}
            </p>
          </div>

          <label className="grid gap-2 text-sm font-semibold text-slate-400">
            {t.selectLabel}
            <select
              value={metric}
              onChange={(event) => setMetric(event.target.value)}
              className="min-h-12 rounded-2xl border border-white/10 bg-[#0b0f1c] px-4 text-white"
            >
              {metricOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {isKo ? option.ko : option.en}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-5">
            <p className="text-sm text-slate-500">{t.latestValue}</p>
            <p className="mt-3 text-3xl font-bold text-white">
              {loading ? "…" : formatValue(data?.latestValue ?? null, data?.unit ?? "", language)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-5">
            <p className="text-sm text-slate-500">{t.latestYear}</p>
            <p className="mt-3 text-3xl font-bold text-white">
              {loading ? "…" : data?.latestYear ?? "—"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-5">
            <p className="text-sm text-slate-500">{t.source}</p>
            <p className="mt-3 text-2xl font-bold text-white">
              {data?.source ?? "World Bank API"}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="mt-6 rounded-3xl border border-white/10 bg-[#0b0f1c] p-8 text-center text-sm text-slate-400">
            {t.loading}
          </div>
        ) : observations.length >= 2 ? (
          <>
            <MiniLineChart observations={observations} />

            <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-slate-500">
              <span>
                {t.observations}: {observations.length}
              </span>
              <span>
                {t.yearRange}: {firstYear}–{lastYear}
              </span>
              <span>{data?.indicator}</span>
            </div>
          </>
        ) : (
          <div className="mt-6 rounded-3xl border border-white/10 bg-[#0b0f1c] p-8 text-center text-sm text-slate-400">
            {t.noData}
            {data?.message ? (
              <p className="mt-3 text-xs text-slate-600">{data.message}</p>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
