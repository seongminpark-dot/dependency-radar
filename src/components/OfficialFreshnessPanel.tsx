"use client";

import { useEffect, useMemo, useState } from "react";
import type { CountryRow } from "@/lib/worldBank";
import { getFlagEmoji } from "@/lib/flags";

type Language = "ko" | "en" | "ja" | "zh" | "es" | "fr" | "de";

type ApiState = {
  comtradeYear: string | null;
  eiaYear: string | null;
  witsYear: string | null;
};

const copy = {
  ko: {
    label: "Official source freshness",
    title: "공식 데이터 최신성 요약",
    subtitle:
      "World Bank 연간 구조 지표와 별도로, UN Comtrade, WITS, EIA의 최신 공식 데이터 레이어를 함께 표시합니다.",
    worldBank: "World Bank 구조 지표",
    comtrade: "UN Comtrade 무역",
    wits: "WITS/WTO 관세",
    eia: "EIA 에너지",
    latest: "최신 제공 기간",
    source: "공식 출처",
    noData: "확인 중",
  },
  en: {
    label: "Official source freshness",
    title: "Official data freshness summary",
    subtitle:
      "Annual World Bank structural indicators are separated from newer official trade, tariff, and energy layers from UN Comtrade, WITS, and EIA.",
    worldBank: "World Bank structural indicators",
    comtrade: "UN Comtrade trade",
    wits: "WITS/WTO tariffs",
    eia: "EIA energy",
    latest: "Latest available period",
    source: "Official source",
    noData: "Checking",
  },
  ja: {
    label: "Official source freshness",
    title: "公式データ最新性の要約",
    subtitle: "World Bank年次指標と、UN Comtrade/WITS/EIAの最新レイヤーを分けて表示します。",
    worldBank: "World Bank構造指標",
    comtrade: "UN Comtrade貿易",
    wits: "WITS/WTO関税",
    eia: "EIAエネルギー",
    latest: "最新期間",
    source: "公式出典",
    noData: "確認中",
  },
  zh: {
    label: "Official source freshness",
    title: "官方数据最新性摘要",
    subtitle: "将 World Bank 年度结构指标与 UN Comtrade、WITS、EIA 最新官方层分开显示。",
    worldBank: "World Bank 结构指标",
    comtrade: "UN Comtrade 贸易",
    wits: "WITS/WTO 关税",
    eia: "EIA 能源",
    latest: "最新期间",
    source: "官方来源",
    noData: "检查中",
  },
  es: {
    label: "Official source freshness",
    title: "Resumen de actualidad de datos oficiales",
    subtitle: "Se separan indicadores anuales World Bank y capas recientes de UN Comtrade, WITS y EIA.",
    worldBank: "Indicadores World Bank",
    comtrade: "Comercio UN Comtrade",
    wits: "Aranceles WITS/WTO",
    eia: "Energía EIA",
    latest: "Periodo reciente",
    source: "Fuente oficial",
    noData: "Comprobando",
  },
  fr: {
    label: "Official source freshness",
    title: "Résumé de fraîcheur des données officielles",
    subtitle: "Les indicateurs World Bank sont séparés des couches récentes UN Comtrade, WITS et EIA.",
    worldBank: "Indicateurs World Bank",
    comtrade: "Commerce UN Comtrade",
    wits: "Tarifs WITS/WTO",
    eia: "Énergie EIA",
    latest: "Période récente",
    source: "Source officielle",
    noData: "Vérification",
  },
  de: {
    label: "Official source freshness",
    title: "Aktualität offizieller Daten",
    subtitle: "World-Bank-Jahresdaten werden von UN-Comtrade-, WITS- und EIA-Schichten getrennt.",
    worldBank: "World-Bank-Strukturindikatoren",
    comtrade: "UN-Comtrade-Handel",
    wits: "WITS/WTO-Zölle",
    eia: "EIA-Energie",
    latest: "Aktueller Zeitraum",
    source: "Offizielle Quelle",
    noData: "Prüfung",
  },
};

const statKeys = [
  "energyImportPercent",
  "fuelImportShare",
  "foodImportShare",
  "importsGdp",
  "importUsd",
  "tariffRate",
  "logisticsIndex",
] as const;

function getWorldBankLatestYear(row: CountryRow) {
  const years = statKeys
    .map((key) => row[key]?.year)
    .filter((year): year is string => Boolean(year))
    .map((year) => Number(year))
    .filter((year) => !Number.isNaN(year));

  if (years.length === 0) return null;

  return String(Math.max(...years));
}

function getMetricYears(data: unknown) {
  const years: string[] = [];

  function walk(node: unknown) {
    if (!node || typeof node !== "object") return;

    if ("latestPeriod" in node && typeof node.latestPeriod === "string") {
      years.push(node.latestPeriod);
    }

    if ("latestYear" in node && typeof node.latestYear === "string") {
      years.push(node.latestYear);
    }

    if ("period" in node && typeof node.period === "string") {
      years.push(node.period);
    }

    for (const value of Object.values(node)) {
      walk(value);
    }
  }

  walk(data);

  return years
    .filter(Boolean)
    .sort((a, b) => b.localeCompare(a));
}

function formatPeriod(period: string | null, fallback: string) {
  if (!period) return fallback;

  if (/^\d{6}$/.test(period)) {
    return `${period.slice(0, 4)}-${period.slice(4, 6)}`;
  }

  return period;
}

function Card({
  title,
  source,
  year,
  accent,
}: {
  title: string;
  source: string;
  year: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-5">
      <div className={`mb-4 h-1 w-12 rounded-full ${accent}`} />
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{source}</p>
      <p className="mt-4 text-3xl font-bold text-white">{year}</p>
    </div>
  );
}

export default function OfficialFreshnessPanel({
  row,
  language,
}: {
  row: CountryRow;
  language: Language;
}) {
  const t = copy[language] ?? copy.en;
  const [apiState, setApiState] = useState<ApiState>({
    comtradeYear: null,
    eiaYear: null,
    witsYear: null,
  });

  const worldBankYear = useMemo(() => getWorldBankLatestYear(row), [row]);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      const nextState: ApiState = {
        comtradeYear: null,
        eiaYear: null,
        witsYear: null,
      };

      try {
        const [comtrade, eia, wits] = await Promise.all([
          fetch(`/api/comtrade/${row.iso3}?fresh=${Date.now()}`, {
            cache: "no-store",
            signal: controller.signal,
          }).then((r) => r.json()),
          fetch(`/api/eia/${row.iso3}?fresh=${Date.now()}`, {
            cache: "no-store",
            signal: controller.signal,
          }).then((r) => r.json()),
          fetch(`/api/wits/${row.iso3}?fresh=${Date.now()}`, {
            cache: "no-store",
            signal: controller.signal,
          }).then((r) => r.json()),
        ]);

        nextState.comtradeYear =
          comtrade?.latestPeriod ?? getMetricYears(comtrade)[0] ?? null;
        nextState.eiaYear = getMetricYears(eia)[0] ?? null;
        nextState.witsYear = getMetricYears(wits)[0] ?? null;

        if (!controller.signal.aborted) {
          setApiState(nextState);
        }
      } catch {
        if (!controller.signal.aborted) {
          setApiState(nextState);
        }
      }
    }

    load();

    return () => controller.abort();
  }, [row.iso3]);

  return (
    <section className="mx-auto max-w-7xl px-6 pb-12">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <div className="mb-6">
          <p className="text-sm font-medium text-indigo-300">{t.label}</p>
          <h2 className="mt-2 text-3xl font-bold">{t.title}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">
            {getFlagEmoji(row.iso2)} {row.name} · {t.subtitle}
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          <Card
            title={t.comtrade}
            source="UN Comtrade API"
            year={formatPeriod(apiState.comtradeYear, t.noData)}
            accent="bg-emerald-400"
          />
          <Card
            title={t.eia}
            source="EIA Open Data API"
            year={formatPeriod(apiState.eiaYear, t.noData)}
            accent="bg-amber-400"
          />
          <Card
            title={t.wits}
            source="WITS / World Bank"
            year={formatPeriod(apiState.witsYear, t.noData)}
            accent="bg-cyan-400"
          />
          <Card
            title={t.worldBank}
            source="World Bank WDI"
            year={formatPeriod(worldBankYear, t.noData)}
            accent="bg-blue-400"
          />
        </div>
      </div>
    </section>
  );
}
