"use client";

import { useEffect, useState } from "react";

type Language = "ko" | "en" | "ja" | "zh" | "es" | "fr" | "de";

type TariffMetric = {
  code: string;
  label: string;
  unit: string;
  source: string;
  latestYear: string | null;
  latestValue: number | null;
  observations: {
    year: string;
    value: number;
  }[];
};

type WitsResponse = {
  iso3: string;
  source: string;
  note: string;
  metrics: TariffMetric[];
};

const copy = {
  ko: {
    label: "Official tariff layer",
    title: "WITS / WTO 기반 관세 데이터",
    subtitle:
      "World Bank WDI의 관세율 항목을 보강하기 위해 WITS Trade Stats Tariff API와 World Bank WDI fallback을 함께 사용합니다.",
    latest: "최신값",
    year: "최신 연도",
    source: "출처",
    loading: "WITS 관세 데이터를 불러오는 중입니다.",
    noData: "관세 데이터를 불러오지 못했습니다.",
    note:
      "관세 데이터는 국가별 보고와 데이터베이스 갱신 주기에 따라 최신 연도가 다를 수 있습니다.",
  },
  en: {
    label: "Official tariff layer",
    title: "WITS / WTO-based tariff data",
    subtitle:
      "This layer enriches the World Bank WDI tariff indicator using the WITS Trade Stats Tariff API and World Bank WDI fallback.",
    latest: "Latest value",
    year: "Latest year",
    source: "Source",
    loading: "Loading WITS tariff data.",
    noData: "Unable to load tariff data.",
    note:
      "Tariff data years vary by country depending on reporting and database update schedules.",
  },
  ja: {
    label: "Official tariff layer",
    title: "WITS / WTO 関税データ",
    subtitle: "WITS APIとWorld Bank WDI fallbackで関税指標を補強します。",
    latest: "最新値",
    year: "最新年",
    source: "出典",
    loading: "関税データを読み込んでいます。",
    noData: "関税データを取得できませんでした。",
    note: "関税データの最新年は国ごとに異なります。",
  },
  zh: {
    label: "Official tariff layer",
    title: "WITS / WTO 关税数据",
    subtitle: "使用 WITS API 和 World Bank WDI fallback 补充关税指标。",
    latest: "最新值",
    year: "最新年份",
    source: "来源",
    loading: "正在加载关税数据。",
    noData: "无法加载关税数据。",
    note: "关税数据年份因国家报告和更新周期而异。",
  },
  es: {
    label: "Official tariff layer",
    title: "Datos arancelarios WITS / WTO",
    subtitle: "Capa de aranceles con WITS API y fallback World Bank WDI.",
    latest: "Valor reciente",
    year: "Año reciente",
    source: "Fuente",
    loading: "Cargando datos arancelarios.",
    noData: "No se pudieron cargar datos arancelarios.",
    note: "Los años de datos varían por país.",
  },
  fr: {
    label: "Official tariff layer",
    title: "Données tarifaires WITS / WTO",
    subtitle: "Couche tarifaire avec WITS API et fallback World Bank WDI.",
    latest: "Valeur récente",
    year: "Année récente",
    source: "Source",
    loading: "Chargement des données tarifaires.",
    noData: "Impossible de charger les données tarifaires.",
    note: "Les années varient selon les pays.",
  },
  de: {
    label: "Official tariff layer",
    title: "WITS / WTO Zolldaten",
    subtitle: "Zollebene mit WITS API und World Bank WDI fallback.",
    latest: "Aktueller Wert",
    year: "Aktuelles Jahr",
    source: "Quelle",
    loading: "Zolldaten werden geladen.",
    noData: "Zolldaten konnten nicht geladen werden.",
    note: "Datenjahre variieren je nach Land.",
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

function formatValue(value: number | null, unit: string, language: Language) {
  if (value === null || value === undefined) return "—";

  const formatted = value.toLocaleString(languageToLocale(language), {
    maximumFractionDigits: 2,
  });

  return unit === "%" ? `${formatted}%` : formatted;
}

export default function OfficialTariffPanel({
  iso3,
  countryName,
  language,
}: {
  iso3: string;
  countryName: string;
  language: Language;
}) {
  const [data, setData] = useState<WitsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const t = copy[language] ?? copy.en;

  useEffect(() => {
    const controller = new AbortController();

    async function loadTariff() {
      setLoading(true);

      try {
        const response = await fetch(`/api/wits/${iso3}`, {
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

    loadTariff();

    return () => controller.abort();
  }, [iso3]);

  const metrics = data?.metrics ?? [];

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <div className="mb-6">
          <p className="text-sm font-medium text-cyan-300">{t.label}</p>
          <h2 className="mt-2 text-3xl font-bold">{t.title}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">
            {countryName} · {t.subtitle}
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-5 text-sm text-slate-400">
            {t.loading}
          </div>
        ) : metrics.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-5 text-sm text-slate-400">
            {t.noData}
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-4">
            {metrics.map((metric) => (
              <div
                key={metric.code}
                className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-5"
              >
                <p className="text-sm font-semibold text-white">
                  {metric.label}
                </p>
                <p className="mt-1 text-xs text-slate-500">{metric.code}</p>

                <div className="mt-4">
                  <p className="text-xs text-slate-500">{t.latest}</p>
                  <p className="mt-1 text-2xl font-bold text-white">
                    {formatValue(metric.latestValue, metric.unit, language)}
                  </p>
                </div>

                <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <p className="text-xs text-slate-500">{t.year}</p>
                  <p className="mt-1 font-semibold text-slate-200">
                    {metric.latestYear ?? "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 grid gap-4 md:grid-cols-[1fr_280px]">
          <p className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-xs leading-5 text-cyan-50/80">
            {t.note}
          </p>
          <p className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-4 text-xs leading-5 text-slate-400">
            {t.source}: {data?.source ?? "WITS / World Bank"}
          </p>
        </div>
      </div>
    </section>
  );
}
