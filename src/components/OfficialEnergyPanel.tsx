"use client";

import { useEffect, useState } from "react";

type Language = "ko" | "en" | "ja" | "zh" | "es" | "fr" | "de";

type EiaMetric = {
  code: string;
  label: string;
  unit: string;
  latestPeriod: string | null;
  latestValue: number | null;
  observations: {
    period: string;
    value: number;
  }[];
  source: string;
  debugStatus?: string;
};

type EiaResponse = {
  configured: boolean;
  iso3: string;
  source: string;
  note: string;
  metrics: EiaMetric[];
};

const copy = {
  ko: {
    label: "Official energy layer",
    title: "EIA 국제 에너지 데이터",
    subtitle:
      "U.S. Energy Information Administration의 Open Data API를 사용해 국제 에너지 지표를 보조 레이어로 표시합니다.",
    latest: "최신값",
    period: "최신 연도",
    source: "출처",
    loading: "EIA 에너지 데이터를 불러오는 중입니다.",
    noData: "EIA 에너지 데이터를 불러오지 못했습니다.",
    missingKey: "EIA_API_KEY가 설정되지 않았습니다.",
    note:
      "국가별로 제공되는 에너지 항목과 최신 연도는 다를 수 있습니다.",
  },
  en: {
    label: "Official energy layer",
    title: "EIA international energy data",
    subtitle:
      "Supplementary international energy indicators from the U.S. Energy Information Administration Open Data API.",
    latest: "Latest value",
    period: "Latest year",
    source: "Source",
    loading: "Loading EIA energy data.",
    noData: "Unable to load EIA energy data.",
    missingKey: "EIA_API_KEY is not configured.",
    note: "Available energy series and latest years vary by country.",
  },
  ja: {
    label: "Official energy layer",
    title: "EIA 国際エネルギーデータ",
    subtitle: "EIA Open Data API に基づく補助エネルギー指標です。",
    latest: "最新値",
    period: "最新年",
    source: "出典",
    loading: "EIA データを読み込んでいます。",
    noData: "EIA データを取得できませんでした。",
    missingKey: "EIA_API_KEY が設定されていません。",
    note: "国によって項目や最新年が異なります。",
  },
  zh: {
    label: "Official energy layer",
    title: "EIA 国际能源数据",
    subtitle: "基于 EIA Open Data API 的补充能源指标。",
    latest: "最新值",
    period: "最新年份",
    source: "来源",
    loading: "正在加载 EIA 数据。",
    noData: "无法加载 EIA 数据。",
    missingKey: "未设置 EIA_API_KEY。",
    note: "各国的指标和最新年份可能不同。",
  },
  es: {
    label: "Official energy layer",
    title: "Datos energéticos internacionales EIA",
    subtitle: "Indicadores energéticos suplementarios desde EIA Open Data.",
    latest: "Valor reciente",
    period: "Año reciente",
    source: "Fuente",
    loading: "Cargando datos de EIA.",
    noData: "No se pudieron cargar datos de EIA.",
    missingKey: "EIA_API_KEY no está configurada.",
    note: "Las series y años varían según el país.",
  },
  fr: {
    label: "Official energy layer",
    title: "Données énergétiques internationales EIA",
    subtitle: "Indicateurs énergétiques complémentaires issus de EIA Open Data.",
    latest: "Valeur récente",
    period: "Année récente",
    source: "Source",
    loading: "Chargement des données EIA.",
    noData: "Impossible de charger les données EIA.",
    missingKey: "EIA_API_KEY n'est pas configurée.",
    note: "Les séries et années varient selon le pays.",
  },
  de: {
    label: "Official energy layer",
    title: "Internationale Energiedaten der EIA",
    subtitle: "Zusätzliche Energieindikatoren aus EIA Open Data.",
    latest: "Aktueller Wert",
    period: "Aktuelles Jahr",
    source: "Quelle",
    loading: "EIA-Daten werden geladen.",
    noData: "EIA-Daten konnten nicht geladen werden.",
    missingKey: "EIA_API_KEY ist nicht konfiguriert.",
    note: "Reihen und Jahre variieren je nach Land.",
  },
};

function localeOf(language: Language) {
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

function formatValue(value: number | null, language: Language) {
  if (value === null || value === undefined) return "—";

  return value.toLocaleString(localeOf(language), {
    maximumFractionDigits: 2,
  });
}

export default function OfficialEnergyPanel({
  iso3,
  countryName,
  language,
}: {
  iso3: string;
  countryName: string;
  language: Language;
}) {
  const [data, setData] = useState<EiaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const t = copy[language] ?? copy.en;

  useEffect(() => {
    const controller = new AbortController();

    async function loadEnergy() {
      setLoading(true);

      try {
        const response = await fetch(`/api/eia/${iso3}`, {
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

    loadEnergy();

    return () => controller.abort();
  }, [iso3]);

  const metrics = data?.metrics ?? [];

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <div className="mb-6">
          <p className="text-sm font-medium text-amber-300">{t.label}</p>
          <h2 className="mt-2 text-3xl font-bold">{t.title}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">
            {countryName} · {t.subtitle}
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-5 text-sm text-slate-400">
            {t.loading}
          </div>
        ) : !data?.configured ? (
          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-5 text-sm text-amber-50/90">
            {t.missingKey}
          </div>
        ) : metrics.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-5 text-sm text-slate-400">
            {t.noData}
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.code}
                className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-5"
              >
                <p className="text-sm font-semibold text-white">
                  {metric.label}
                </p>
                <p className="mt-1 text-xs text-slate-500">{metric.unit}</p>

                <div className="mt-4">
                  <p className="text-xs text-slate-500">{t.latest}</p>
                  <p className="mt-1 text-2xl font-bold text-white">
                    {formatValue(metric.latestValue, language)}
                  </p>
                </div>

                <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <p className="text-xs text-slate-500">{t.period}</p>
                  <p className="mt-1 font-semibold text-slate-200">
                    {metric.latestPeriod ?? "—"}
                  </p>
                </div>

                <p className="mt-3 text-[11px] leading-5 text-slate-500">
                  {metric.debugStatus ?? ""}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 grid gap-4 md:grid-cols-[1fr_280px]">
          <p className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-xs leading-5 text-amber-50/80">
            {t.note}
          </p>
          <p className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-4 text-xs leading-5 text-slate-400">
            {t.source}: {data?.source ?? "EIA Open Data API"}
          </p>
        </div>
      </div>
    </section>
  );
}
