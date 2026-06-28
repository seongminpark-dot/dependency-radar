"use client";

import { useEffect, useMemo, useState } from "react";

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
    label: "2025/2026 Outlook",
    title: "IMF 2025/2026 전망 데이터",
    subtitle:
      "World Bank 공식 최신값과 별도로, IMF WEO 기반의 2025/2026 거시경제 전망을 추가로 보여줍니다.",
    source: "출처",
    note:
      "2025/2026 값은 국가와 지표에 따라 전망치 또는 추정치일 수 있습니다. 공식 확정 통계와 구분해서 해석해야 합니다.",
    noData: "IMF 전망 데이터를 불러오지 못했습니다.",
    loading: "IMF 전망 데이터를 불러오는 중입니다.",
    indicator: "지표",
    year2024: "2024",
    year2025: "2025",
    year2026: "2026",
    realGdp: "실질 GDP 성장률",
    inflation: "물가상승률",
    currentAccount: "경상수지",
    governmentDebt: "정부부채",
    unemployment: "실업률",
    gdpCurrent: "명목 GDP",
  },
  en: {
    label: "2025/2026 Outlook",
    title: "IMF 2025/2026 outlook data",
    subtitle:
      "In addition to official latest World Bank values, this layer adds IMF WEO-based macroeconomic estimates and forecasts for 2025/2026.",
    source: "Source",
    note:
      "2025/2026 values may be estimates or forecasts depending on the country and indicator. They should be interpreted separately from finalized official statistics.",
    noData: "Unable to load IMF outlook data.",
    loading: "Loading IMF outlook data.",
    indicator: "Indicator",
    year2024: "2024",
    year2025: "2025",
    year2026: "2026",
    realGdp: "Real GDP growth",
    inflation: "Inflation",
    currentAccount: "Current account",
    governmentDebt: "Government debt",
    unemployment: "Unemployment",
    gdpCurrent: "GDP, current prices",
  },
  ja: {
    label: "2025/2026 Outlook",
    title: "IMF 2025/2026 전망 데이터",
    subtitle: "IMF WEO 기반의 2025/2026 거시경제 전망을 표시합니다.",
    source: "출처",
    note: "2025/2026 값은 전망치 또는 추정치일 수 있습니다.",
    noData: "IMF 데이터를 불러오지 못했습니다.",
    loading: "IMF 데이터를 불러오는 중입니다.",
    indicator: "지표",
    year2024: "2024",
    year2025: "2025",
    year2026: "2026",
    realGdp: "Real GDP growth",
    inflation: "Inflation",
    currentAccount: "Current account",
    governmentDebt: "Government debt",
    unemployment: "Unemployment",
    gdpCurrent: "GDP, current prices",
  },
  zh: {
    label: "2025/2026 Outlook",
    title: "IMF 2025/2026 전망 데이터",
    subtitle: "显示基于 IMF WEO 的 2025/2026 宏观经济预测。",
    source: "来源",
    note: "2025/2026 数值可能是估计或预测。",
    noData: "无法加载 IMF 数据。",
    loading: "正在加载 IMF 数据。",
    indicator: "指标",
    year2024: "2024",
    year2025: "2025",
    year2026: "2026",
    realGdp: "Real GDP growth",
    inflation: "Inflation",
    currentAccount: "Current account",
    governmentDebt: "Government debt",
    unemployment: "Unemployment",
    gdpCurrent: "GDP, current prices",
  },
  es: {
    label: "2025/2026 Outlook",
    title: "Datos de perspectiva IMF 2025/2026",
    subtitle: "Añade estimaciones y previsiones macroeconómicas del IMF WEO.",
    source: "Fuente",
    note: "Los valores 2025/2026 pueden ser estimaciones o previsiones.",
    noData: "No se pudieron cargar los datos del IMF.",
    loading: "Cargando datos del IMF.",
    indicator: "Indicador",
    year2024: "2024",
    year2025: "2025",
    year2026: "2026",
    realGdp: "Real GDP growth",
    inflation: "Inflation",
    currentAccount: "Current account",
    governmentDebt: "Government debt",
    unemployment: "Unemployment",
    gdpCurrent: "GDP, current prices",
  },
  fr: {
    label: "2025/2026 Outlook",
    title: "Données de perspectives IMF 2025/2026",
    subtitle: "Ajoute des estimations et prévisions macroéconomiques IMF WEO.",
    source: "Source",
    note: "Les valeurs 2025/2026 peuvent être des estimations ou prévisions.",
    noData: "Impossible de charger les données IMF.",
    loading: "Chargement des données IMF.",
    indicator: "Indicateur",
    year2024: "2024",
    year2025: "2025",
    year2026: "2026",
    realGdp: "Real GDP growth",
    inflation: "Inflation",
    currentAccount: "Current account",
    governmentDebt: "Government debt",
    unemployment: "Unemployment",
    gdpCurrent: "GDP, current prices",
  },
  de: {
    label: "2025/2026 Outlook",
    title: "IMF 2025/2026 Ausblicksdaten",
    subtitle: "Ergänzt makroökonomische IMF-WEO-Schätzungen und Prognosen.",
    source: "Quelle",
    note: "2025/2026-Werte können Schätzungen oder Prognosen sein.",
    noData: "IMF-Daten konnten nicht geladen werden.",
    loading: "IMF-Daten werden geladen.",
    indicator: "Indikator",
    year2024: "2024",
    year2025: "2025",
    year2026: "2026",
    realGdp: "Real GDP growth",
    inflation: "Inflation",
    currentAccount: "Current account",
    governmentDebt: "Government debt",
    unemployment: "Unemployment",
    gdpCurrent: "GDP, current prices",
  },
};

const indicatorLabelMap: Record<string, keyof typeof copy.ko> = {
  NGDP_RPCH: "realGdp",
  PCPIPCH: "inflation",
  BCA_NGDPD: "currentAccount",
  GGXWDG_NGDP: "governmentDebt",
  LUR: "unemployment",
  NGDPD: "gdpCurrent",
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

export default function IMFOutlookPanel({
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

    async function loadIMF() {
      setLoading(true);

      try {
        const response = await fetch(`/api/imf/${iso3}`, {
          signal: controller.signal,
          cache: "no-store",
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

    loadIMF();

    return () => {
      controller.abort();
    };
  }, [iso3]);

  const hasData = useMemo(() => {
    return Boolean(
      data?.indicators?.some((indicator) =>
        ["2024", "2025", "2026"].some((year) => indicator.values?.[year] !== undefined)
      )
    );
  }, [data]);

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
        ) : !data || !hasData ? (
          <div className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-5 text-sm text-slate-400">
            {t.noData}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="bg-white/[0.06] text-slate-400">
                <tr>
                  <th className="px-5 py-4">{t.indicator}</th>
                  <th className="px-5 py-4">{t.year2024}</th>
                  <th className="px-5 py-4">{t.year2025}</th>
                  <th className="px-5 py-4">{t.year2026}</th>
                </tr>
              </thead>
              <tbody>
                {data.indicators.map((indicator) => {
                  const labelKey = indicatorLabelMap[indicator.code];
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
