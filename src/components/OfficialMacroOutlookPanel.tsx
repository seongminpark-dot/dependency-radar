"use client";

import { useEffect, useState } from "react";

type Language = "ko" | "en" | "ja" | "zh" | "es" | "fr" | "de";

type IMFIndicator = {
  code: string;
  label: string;
  unit: string;
  values: Record<string, number | string | null>;
};

type IMFResponse = {
  source: string;
  note: string;
  iso3: string;
  indicators: IMFIndicator[];
};

const copy = {
  ko: {
    label: "Official macro outlook",
    title: "IMF 2025/2026 거시경제 전망",
    subtitle:
      "무역 데이터와 별도로, IMF WEO 기반 2025/2026 거시경제 전망을 표시합니다.",
    indicator: "지표",
    source: "출처",
    loading: "IMF 데이터를 불러오는 중입니다.",
    noData: "IMF 전망 데이터를 불러오지 못했습니다.",
    note:
      "2025/2026 값은 IMF WEO의 추정 또는 전망값일 수 있으며, World Bank 확정 연간 지표와 구분해서 해석해야 합니다.",
    realGdp: "실질 GDP 성장률",
    inflation: "물가상승률",
    currentAccount: "경상수지",
    debt: "정부부채",
    unemployment: "실업률",
    gdp: "명목 GDP",
  },
  en: {
    label: "Official macro outlook",
    title: "IMF 2025/2026 macroeconomic outlook",
    subtitle:
      "Separate from trade data, this panel shows IMF WEO-based 2025/2026 macroeconomic outlook data.",
    indicator: "Indicator",
    source: "Source",
    loading: "Loading IMF data.",
    noData: "Unable to load IMF outlook data.",
    note:
      "2025/2026 values may be IMF WEO estimates or forecasts and should be interpreted separately from finalized World Bank annual indicators.",
    realGdp: "Real GDP growth",
    inflation: "Inflation",
    currentAccount: "Current account balance",
    debt: "Government debt",
    unemployment: "Unemployment rate",
    gdp: "GDP, current prices",
  },
  ja: {
    label: "Official macro outlook",
    title: "IMF 2025/2026 マクロ経済見通し",
    subtitle: "IMF WEOベースの2025/2026見通しを表示します。",
    indicator: "指標",
    source: "出典",
    loading: "IMFデータを読み込んでいます。",
    noData: "IMFデータを取得できませんでした。",
    note: "2025/2026値は推定または予測値の場合があります。",
    realGdp: "Real GDP growth",
    inflation: "Inflation",
    currentAccount: "Current account balance",
    debt: "Government debt",
    unemployment: "Unemployment rate",
    gdp: "GDP, current prices",
  },
  zh: {
    label: "Official macro outlook",
    title: "IMF 2025/2026 宏观经济展望",
    subtitle: "显示 IMF WEO 2025/2026 宏观经济展望数据。",
    indicator: "指标",
    source: "来源",
    loading: "正在加载 IMF 数据。",
    noData: "无法加载 IMF 数据。",
    note: "2025/2026 值可能为估计或预测。",
    realGdp: "Real GDP growth",
    inflation: "Inflation",
    currentAccount: "Current account balance",
    debt: "Government debt",
    unemployment: "Unemployment rate",
    gdp: "GDP, current prices",
  },
  es: {
    label: "Official macro outlook",
    title: "Perspectiva macroeconómica IMF 2025/2026",
    subtitle: "Muestra datos de perspectivas IMF WEO 2025/2026.",
    indicator: "Indicador",
    source: "Fuente",
    loading: "Cargando datos IMF.",
    noData: "No se pudieron cargar datos IMF.",
    note: "Los valores 2025/2026 pueden ser estimaciones o previsiones.",
    realGdp: "Real GDP growth",
    inflation: "Inflation",
    currentAccount: "Current account balance",
    debt: "Government debt",
    unemployment: "Unemployment rate",
    gdp: "GDP, current prices",
  },
  fr: {
    label: "Official macro outlook",
    title: "Perspectives macroéconomiques IMF 2025/2026",
    subtitle: "Affiche les perspectives IMF WEO 2025/2026.",
    indicator: "Indicateur",
    source: "Source",
    loading: "Chargement des données IMF.",
    noData: "Impossible de charger les données IMF.",
    note: "Les valeurs 2025/2026 peuvent être des estimations ou prévisions.",
    realGdp: "Real GDP growth",
    inflation: "Inflation",
    currentAccount: "Current account balance",
    debt: "Government debt",
    unemployment: "Unemployment rate",
    gdp: "GDP, current prices",
  },
  de: {
    label: "Official macro outlook",
    title: "IMF 2025/2026 Makroausblick",
    subtitle: "Zeigt IMF-WEO-Ausblicksdaten für 2025/2026.",
    indicator: "Indikator",
    source: "Quelle",
    loading: "IMF-Daten werden geladen.",
    noData: "IMF-Daten konnten nicht geladen werden.",
    note: "2025/2026-Werte können Schätzungen oder Prognosen sein.",
    realGdp: "Real GDP growth",
    inflation: "Inflation",
    currentAccount: "Current account balance",
    debt: "Government debt",
    unemployment: "Unemployment rate",
    gdp: "GDP, current prices",
  },
};

const labelMap: Record<string, keyof typeof copy.ko> = {
  NGDP_RPCH: "realGdp",
  PCPIPCH: "inflation",
  BCA_NGDPD: "currentAccount",
  GGXWDG_NGDP: "debt",
  LUR: "unemployment",
  NGDPD: "gdp",
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

function formatValue(value: number | string | null | undefined, unit: string, language: Language) {
  if (value === null || value === undefined || value === "") return "—";

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) return "—";

  if (unit.toLowerCase().includes("billion")) {
    return new Intl.NumberFormat(languageToLocale(language), {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(numberValue * 1_000_000_000);
  }

  if (unit.includes("%")) {
    return `${numberValue.toLocaleString(languageToLocale(language), {
      maximumFractionDigits: 2,
    })}%`;
  }

  return numberValue.toLocaleString(languageToLocale(language), {
    maximumFractionDigits: 2,
  });
}

export default function OfficialMacroOutlookPanel({
  iso3,
  countryName,
  language,
}: {
  iso3: string;
  countryName: string;
  language: Language;
}) {
  const [data, setData] = useState<IMFResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const t = copy[language] ?? copy.en;

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      setLoading(true);

      try {
        const response = await fetch(`/api/imf/${iso3}`, {
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

    loadData();

    return () => controller.abort();
  }, [iso3]);

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <div className="mb-6">
          <p className="text-sm font-medium text-blue-300">{t.label}</p>
          <h2 className="mt-2 text-3xl font-bold">{t.title}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">
            {countryName} · {t.subtitle}
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-5 text-sm text-slate-400">
            {t.loading}
          </div>
        ) : !data?.indicators?.length ? (
          <div className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-5 text-sm text-slate-400">
            {t.noData}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="bg-white/[0.06] text-slate-400">
                <tr>
                  <th className="px-5 py-4">{t.indicator}</th>
                  <th className="px-5 py-4">2024</th>
                  <th className="px-5 py-4">2025</th>
                  <th className="px-5 py-4">2026</th>
                </tr>
              </thead>
              <tbody>
                {data.indicators.map((indicator) => {
                  const labelKey = labelMap[indicator.code];
                  const label = labelKey ? String(t[labelKey]) : indicator.label;

                  return (
                    <tr key={indicator.code} className="border-t border-white/10">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-white">{label}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {indicator.code} · {indicator.unit}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        {formatValue(indicator.values?.["2024"], indicator.unit, language)}
                      </td>
                      <td className="px-5 py-4">
                        {formatValue(indicator.values?.["2025"], indicator.unit, language)}
                      </td>
                      <td className="px-5 py-4">
                        {formatValue(indicator.values?.["2026"], indicator.unit, language)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-5 grid gap-4 md:grid-cols-[1fr_280px]">
          <p className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-xs leading-5 text-amber-100">
            {t.note}
          </p>
          <p className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-4 text-xs leading-5 text-slate-400">
            {t.source}: {data?.source ?? "IMF DataMapper / WEO"}
          </p>
        </div>
      </div>
    </section>
  );
}
