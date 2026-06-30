"use client";

import LatestMonthlyTradePanel from "@/components/LatestMonthlyTradePanel";
import OfficialEnergyPanel from "@/components/OfficialEnergyPanel";
import OfficialTariffPanel from "@/components/OfficialTariffPanel";

type Language = "ko" | "en" | "ja" | "zh" | "es" | "fr" | "de";

type LooseCountryRow = Record<string, unknown>;

const supportedLanguages: Language[] = ["ko", "en", "ja", "zh", "es", "fr", "de"];

const copy = {
  ko: {
    label: "Country official data profile",
    title: "이 국가의 공식 데이터 레이어",
    subtitle:
      "국가 상세 페이지는 World Bank 장기 구조 지표와 UN Comtrade, EIA, WITS/WTO 보조 공식 데이터 레이어를 분리해 보여줍니다.",
    worldBank: "World Bank WDI",
    worldBankDesc: "장기 연간 구조 지표",
    comtrade: "UN Comtrade",
    comtradeDesc: "최신 공식 상품무역 데이터",
    eia: "EIA",
    eiaDesc: "국제 에너지 데이터",
    wits: "WITS / WTO",
    witsDesc: "관세 데이터",
    noEstimate: "추정값을 임의 생성하지 않음",
    latestRule: "공식값은 2026 → 2025 → 2024 순으로 확인",
    sourceRule: "출처별 최신 제공 연도는 서로 다를 수 있음",
  },
  en: {
    label: "Country official data profile",
    title: "Official data layers for this country",
    subtitle:
      "Country pages separate World Bank long-term structural indicators from UN Comtrade, EIA, and WITS/WTO supplementary official data layers.",
    worldBank: "World Bank WDI",
    worldBankDesc: "Annual structural baseline",
    comtrade: "UN Comtrade",
    comtradeDesc: "Latest official merchandise trade data",
    eia: "EIA",
    eiaDesc: "International energy data",
    wits: "WITS / WTO",
    witsDesc: "Tariff data",
    noEstimate: "No artificial estimates",
    latestRule: "Official values are checked in the order 2026 → 2025 → 2024",
    sourceRule: "Latest available years can differ by source",
  },
  ja: {
    label: "Country official data profile",
    title: "この国の公式データレイヤー",
    subtitle: "World Bank構造指標と補助公式データを分離して表示します。",
    worldBank: "World Bank WDI",
    worldBankDesc: "年次構造指標",
    comtrade: "UN Comtrade",
    comtradeDesc: "公式商品貿易データ",
    eia: "EIA",
    eiaDesc: "国際エネルギーデータ",
    wits: "WITS / WTO",
    witsDesc: "関税データ",
    noEstimate: "推定値を作成しません",
    latestRule: "公式値を 2026 → 2025 → 2024 の順で確認",
    sourceRule: "最新年は出典ごとに異なる場合があります",
  },
  zh: {
    label: "Country official data profile",
    title: "该国家的官方数据层",
    subtitle: "分离显示 World Bank 结构指标和补充官方数据层。",
    worldBank: "World Bank WDI",
    worldBankDesc: "年度结构指标",
    comtrade: "UN Comtrade",
    comtradeDesc: "官方商品贸易数据",
    eia: "EIA",
    eiaDesc: "国际能源数据",
    wits: "WITS / WTO",
    witsDesc: "关税数据",
    noEstimate: "不生成任意估计",
    latestRule: "官方值按 2026 → 2025 → 2024 检查",
    sourceRule: "最新年份可能因来源而异",
  },
  es: {
    label: "Country official data profile",
    title: "Capas oficiales para este país",
    subtitle: "Se separan indicadores estructurales World Bank y capas oficiales complementarias.",
    worldBank: "World Bank WDI",
    worldBankDesc: "Base estructural anual",
    comtrade: "UN Comtrade",
    comtradeDesc: "Comercio oficial reciente",
    eia: "EIA",
    eiaDesc: "Energía internacional",
    wits: "WITS / WTO",
    witsDesc: "Datos arancelarios",
    noEstimate: "Sin estimaciones artificiales",
    latestRule: "Valores oficiales 2026 → 2025 → 2024",
    sourceRule: "Los años recientes varían por fuente",
  },
  fr: {
    label: "Country official data profile",
    title: "Couches officielles pour ce pays",
    subtitle: "Les indicateurs World Bank sont séparés des couches officielles complémentaires.",
    worldBank: "World Bank WDI",
    worldBankDesc: "Base structurelle annuelle",
    comtrade: "UN Comtrade",
    comtradeDesc: "Commerce officiel récent",
    eia: "EIA",
    eiaDesc: "Énergie internationale",
    wits: "WITS / WTO",
    witsDesc: "Données tarifaires",
    noEstimate: "Pas d’estimations artificielles",
    latestRule: "Valeurs officielles 2026 → 2025 → 2024",
    sourceRule: "Les années varient selon les sources",
  },
  de: {
    label: "Country official data profile",
    title: "Offizielle Datenebenen für dieses Land",
    subtitle: "World-Bank-Strukturindikatoren werden von ergänzenden offiziellen Daten getrennt.",
    worldBank: "World Bank WDI",
    worldBankDesc: "Jährliche Strukturindikatoren",
    comtrade: "UN Comtrade",
    comtradeDesc: "Aktuelle Handelsdaten",
    eia: "EIA",
    eiaDesc: "Internationale Energiedaten",
    wits: "WITS / WTO",
    witsDesc: "Zolldaten",
    noEstimate: "Keine künstlichen Schätzwerte",
    latestRule: "Offizielle Werte 2026 → 2025 → 2024",
    sourceRule: "Aktuelle Jahre variieren je Quelle",
  },
};

function normalizeLanguage(language?: string): Language {
  if (language && supportedLanguages.includes(language as Language)) {
    return language as Language;
  }

  return "en";
}

function getString(row: LooseCountryRow | null | undefined, keys: string[]) {
  if (!row) return null;

  for (const key of keys) {
    const value = row[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

function getFlagEmoji(iso2: string | null) {
  if (!iso2 || iso2.length !== 2) return "";

  return iso2
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
}

function DataLayerCard({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-5">
      <p className="text-sm font-semibold text-white">{name}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}

export default function CountryOfficialDataStack({
  row,
  iso3,
  countryName,
  language,
  includePanels = true,
}: {
  row?: LooseCountryRow | null;
  iso3?: string;
  countryName?: string;
  language?: string;
  includePanels?: boolean;
}) {
  const lang = normalizeLanguage(language);
  const t = copy[lang] ?? copy.en;

  const resolvedIso3 =
    iso3 ??
    getString(row, ["iso3", "cca3", "countryCode", "id"]) ??
    "";

  const iso2 = getString(row, ["iso2", "cca2"]);
  const flag = getFlagEmoji(iso2);

  const resolvedCountryName =
    countryName ??
    getString(row, [
      "name",
      "countryName",
      "displayName",
      "nameEn",
      "officialName",
    ]) ??
    resolvedIso3;

  const displayName = `${flag ? `${flag} ` : ""}${resolvedCountryName}`;

  if (!resolvedIso3) {
    return null;
  }

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 lg:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
            {t.label}
          </p>

          <div className="mt-4 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <h2 className="max-w-4xl text-4xl font-bold leading-tight text-white">
                {displayName} · {t.title}
              </h2>

              <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-300">
                {t.subtitle}
              </p>
            </div>

            <div className="grid gap-3">
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                <p className="text-sm font-semibold text-emerald-100">
                  {t.noEstimate}
                </p>
              </div>

              <div className="rounded-2xl border border-blue-400/20 bg-blue-400/10 p-4">
                <p className="text-sm font-semibold text-blue-100">
                  {t.latestRule}
                </p>
              </div>

              <div className="rounded-2xl border border-indigo-400/20 bg-indigo-400/10 p-4">
                <p className="text-sm font-semibold text-indigo-100">
                  {t.sourceRule}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-4">
            <DataLayerCard name={t.worldBank} description={t.worldBankDesc} />
            <DataLayerCard name={t.comtrade} description={t.comtradeDesc} />
            <DataLayerCard name={t.eia} description={t.eiaDesc} />
            <DataLayerCard name={t.wits} description={t.witsDesc} />
          </div>
        </div>
      </section>

      {includePanels ? (
        <>
          <LatestMonthlyTradePanel
            iso3={resolvedIso3}
            countryName={displayName}
            language={lang}
          />

          <OfficialEnergyPanel
            iso3={resolvedIso3}
            countryName={displayName}
            language={lang}
          />

          <OfficialTariffPanel
            iso3={resolvedIso3}
            countryName={displayName}
            language={lang}
          />
        </>
      ) : null}
    </>
  );
}
