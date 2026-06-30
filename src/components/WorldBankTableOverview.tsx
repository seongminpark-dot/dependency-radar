"use client";

import type { CountryRow } from "@/lib/worldBank";

type Language = "ko" | "en" | "ja" | "zh" | "es" | "fr" | "de";

const statKeys = [
  "energyImportPercent",
  "fuelImportShare",
  "foodImportShare",
  "importsGdp",
  "importUsd",
  "tariffRate",
  "logisticsIndex",
] as const;

const copy = {
  ko: {
    label: "World Bank annual data explorer",
    title: "World Bank 연간 구조 지표 표",
    subtitle:
      "아래 표는 국가별 장기 구조 비교를 위한 World Bank 기반 연간 지표입니다. 최신 연도는 국가와 지표별로 다르며, UN Comtrade·EIA·WITS 같은 최신 보조 레이어와 분리해서 해석해야 합니다.",
    countries: "국가/경제권",
    latestYear: "최신 제공 연도",
    coverage: "평균 데이터 커버리지",
    regions: "지역 분류",
    interpretation: "해석 기준",
    interpretationText:
      "2024가 표시되는 것은 사이트가 오래된 것이 아니라, 해당 World Bank 지표가 제공하는 최신 공식 연도일 수 있습니다.",
    noEstimate: "추정값 미사용",
    noEstimateText:
      "공식값이 없는 칸은 임의로 보정하지 않고 빈값 또는 제공 가능한 최신 연도로 표시합니다.",
    tableTools: "표 사용 방법",
    tableToolsText:
      "국가명 검색, 지역 필터, 열 정렬, CSV 다운로드를 사용해 필요한 국가와 지표를 비교할 수 있습니다.",
    source: "출처",
    sourceText: "World Bank WDI / WITS fallback 일부 포함",
  },
  en: {
    label: "World Bank annual data explorer",
    title: "World Bank annual structural indicator table",
    subtitle:
      "The table below is a World Bank-based annual indicator table for long-term structural country comparison. Latest years vary by country and indicator and should be interpreted separately from newer UN Comtrade, EIA, and WITS layers.",
    countries: "Countries/economies",
    latestYear: "Latest source year",
    coverage: "Average coverage",
    regions: "Region groups",
    interpretation: "Interpretation",
    interpretationText:
      "A 2024 value does not mean the site is outdated. It may be the latest official year available for that World Bank indicator.",
    noEstimate: "No artificial estimates",
    noEstimateText:
      "Missing official values are not filled with artificial estimates. The table shows blanks or the latest available official source year.",
    tableTools: "How to use the table",
    tableToolsText:
      "Use country search, region filtering, column sorting, and CSV download to compare countries and indicators.",
    source: "Source",
    sourceText: "World Bank WDI / partial WITS fallback",
  },
  ja: {
    label: "World Bank annual data explorer",
    title: "World Bank 年次構造指標表",
    subtitle:
      "下の表は長期的な国別比較のための World Bank 年次指標です。最新年は国と指標により異なります。",
    countries: "国・経済圏",
    latestYear: "最新提供年",
    coverage: "平均カバレッジ",
    regions: "地域分類",
    interpretation: "解釈基準",
    interpretationText:
      "2024の表示はサイトが古いという意味ではなく、公式最新年である場合があります。",
    noEstimate: "推定値なし",
    noEstimateText: "公式値がない場合、任意の推定値で補完しません。",
    tableTools: "表の使い方",
    tableToolsText: "検索、地域フィルター、列ソート、CSVダウンロードを使用できます。",
    source: "出典",
    sourceText: "World Bank WDI / 一部 WITS fallback",
  },
  zh: {
    label: "World Bank annual data explorer",
    title: "World Bank 年度结构指标表",
    subtitle:
      "下表用于长期国家结构比较。最新年份因国家和指标而异。",
    countries: "国家/经济体",
    latestYear: "最新来源年份",
    coverage: "平均覆盖率",
    regions: "地区分类",
    interpretation: "解释规则",
    interpretationText:
      "显示 2024 并不代表网站过时，它可能是该指标的最新官方年份。",
    noEstimate: "不使用任意估计",
    noEstimateText: "没有官方值时不会人为填补。",
    tableTools: "表格使用方式",
    tableToolsText: "可使用国家搜索、地区筛选、列排序和 CSV 下载。",
    source: "来源",
    sourceText: "World Bank WDI / 部分 WITS fallback",
  },
  es: {
    label: "World Bank annual data explorer",
    title: "Tabla anual estructural World Bank",
    subtitle:
      "Tabla anual para comparación estructural de largo plazo. Los años recientes varían por país e indicador.",
    countries: "Países/economías",
    latestYear: "Año reciente",
    coverage: "Cobertura media",
    regions: "Regiones",
    interpretation: "Interpretación",
    interpretationText:
      "Un valor 2024 no significa que el sitio esté desactualizado; puede ser el año oficial disponible.",
    noEstimate: "Sin estimaciones",
    noEstimateText: "Los valores faltantes no se rellenan artificialmente.",
    tableTools: "Uso de la tabla",
    tableToolsText: "Use búsqueda, filtros, ordenamiento y descarga CSV.",
    source: "Fuente",
    sourceText: "World Bank WDI / fallback WITS parcial",
  },
  fr: {
    label: "World Bank annual data explorer",
    title: "Table annuelle structurelle World Bank",
    subtitle:
      "Table annuelle pour comparaison structurelle à long terme. Les années varient selon les pays et indicateurs.",
    countries: "Pays/économies",
    latestYear: "Année récente",
    coverage: "Couverture moyenne",
    regions: "Régions",
    interpretation: "Interprétation",
    interpretationText:
      "Une valeur 2024 peut être l’année officielle disponible la plus récente.",
    noEstimate: "Pas d’estimation",
    noEstimateText: "Les valeurs manquantes ne sont pas complétées artificiellement.",
    tableTools: "Utilisation du tableau",
    tableToolsText: "Recherche, filtres, tri et téléchargement CSV.",
    source: "Source",
    sourceText: "World Bank WDI / fallback WITS partiel",
  },
  de: {
    label: "World Bank annual data explorer",
    title: "Jährliche World-Bank-Strukturindikatoren",
    subtitle:
      "Tabelle für langfristige strukturelle Ländervergleiche. Aktuelle Jahre variieren nach Land und Indikator.",
    countries: "Länder/Wirtschaften",
    latestYear: "Aktuelles Quellenjahr",
    coverage: "Durchschnittliche Abdeckung",
    regions: "Regionen",
    interpretation: "Interpretation",
    interpretationText:
      "Ein Wert von 2024 bedeutet nicht, dass die Website veraltet ist.",
    noEstimate: "Keine Schätzwerte",
    noEstimateText: "Fehlende offizielle Werte werden nicht künstlich ergänzt.",
    tableTools: "Tabellennutzung",
    tableToolsText: "Suche, Filter, Sortierung und CSV-Download nutzen.",
    source: "Quelle",
    sourceText: "World Bank WDI / teilweiser WITS fallback",
  },
};

function getLatestWorldBankYear(rows: CountryRow[]) {
  const years = rows
    .flatMap((row) => statKeys.map((key) => row[key]?.year))
    .filter((year): year is string => Boolean(year))
    .map((year) => Number(year))
    .filter((year) => !Number.isNaN(year));

  if (years.length === 0) return "—";

  return String(Math.max(...years));
}

function getAverageCoverage(rows: CountryRow[]) {
  if (rows.length === 0) return "—";

  const total = rows.reduce((sum, row) => {
    const count = statKeys.filter((key) => row[key]?.value !== null && row[key]?.value !== undefined).length;
    return sum + count / statKeys.length;
  }, 0);

  return `${Math.round((total / rows.length) * 100)}%`;
}

function getRegionCount(rows: CountryRow[]) {
  const regions = new Set(
    rows
      .map((row) => row.region)
      .filter((region): region is string => Boolean(region))
  );

  return String(regions.size);
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

function InfoCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
    </div>
  );
}

export default function WorldBankTableOverview({
  rows,
  language,
}: {
  rows: CountryRow[];
  language: Language;
}) {
  const t = copy[language] ?? copy.en;

  return (
    <section className="mx-auto max-w-7xl px-6 pb-10">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 lg:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-300">
          {t.label}
        </p>

        <h2 className="mt-4 max-w-4xl text-4xl font-bold leading-tight text-white">
          {t.title}
        </h2>

        <p className="mt-4 max-w-4xl text-base leading-7 text-slate-300">
          {t.subtitle}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <StatCard label={t.countries} value={rows.length.toLocaleString()} />
          <StatCard label={t.latestYear} value={getLatestWorldBankYear(rows)} />
          <StatCard label={t.coverage} value={getAverageCoverage(rows)} />
          <StatCard label={t.regions} value={getRegionCount(rows)} />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-4">
          <InfoCard title={t.interpretation} text={t.interpretationText} />
          <InfoCard title={t.noEstimate} text={t.noEstimateText} />
          <InfoCard title={t.tableTools} text={t.tableToolsText} />
          <InfoCard title={t.source} text={t.sourceText} />
        </div>
      </div>
    </section>
  );
}
