"use client";

type Language = "ko" | "en" | "ja" | "zh" | "es" | "fr" | "de";

const copy = {
  ko: {
    label: "Data explorer controls",
    title: "검색, 필터, 정렬로 필요한 국가와 지표를 빠르게 좁혀보세요.",
    subtitle:
      "World Bank 연간 구조 지표 표는 전체 국가를 한 번에 보여주기 때문에, 검색과 필터를 먼저 사용하면 훨씬 쉽게 비교할 수 있습니다.",
    search: "국가 검색",
    searchDesc: "국가명, ISO 코드, 지역명으로 원하는 국가를 찾습니다.",
    filters: "필터",
    filtersDesc: "지역, 소득 그룹, 데이터 제공 여부, 최신 연도를 기준으로 범위를 좁힙니다.",
    sorting: "열 정렬",
    sortingDesc: "수입/GDP, 관세율, 물류지수처럼 비교하려는 지표를 오름차순/내림차순으로 정렬합니다.",
    export: "CSV 내보내기",
    exportDesc:
      "CSV는 보조 기능입니다. 화면 비교가 우선이고, 필요한 경우에만 원자료 확인용으로 사용하면 됩니다.",
    tip: "추천 사용 순서",
    tipText:
      "먼저 국가명 검색 → 지역/소득 그룹 필터 → 지표 열 정렬 순서로 사용하면 가장 빠르게 비교할 수 있습니다.",
  },
  en: {
    label: "Data explorer controls",
    title: "Use search, filters, and sorting to narrow countries and indicators quickly.",
    subtitle:
      "The World Bank annual structural table covers many countries, so search and filters make comparison easier.",
    search: "Country search",
    searchDesc: "Find countries by name, ISO code, or region.",
    filters: "Filters",
    filtersDesc: "Narrow results by region, income group, data availability, and latest source year.",
    sorting: "Column sorting",
    sortingDesc: "Sort indicators such as imports/GDP, tariff rate, and logistics index.",
    export: "CSV export",
    exportDesc:
      "CSV is a secondary feature for verification or research use. On-screen comparison is the primary experience.",
    tip: "Recommended flow",
    tipText:
      "Start with country search, then apply region/income filters, then sort the indicator column you want to compare.",
  },
  ja: {
    label: "Data explorer controls",
    title: "検索、フィルター、並べ替えで国と指標を絞り込めます。",
    subtitle: "国が多いため、検索とフィルターを先に使うと比較しやすくなります。",
    search: "国検索",
    searchDesc: "国名、ISOコード、地域名で検索します。",
    filters: "フィルター",
    filtersDesc: "地域、所得グループ、データ有無、最新年で絞り込みます。",
    sorting: "列の並べ替え",
    sortingDesc: "比較したい指標を昇順/降順で並べます。",
    export: "CSV出力",
    exportDesc: "CSVは補助機能です。",
    tip: "おすすめの使い方",
    tipText: "検索 → フィルター → 指標列の並べ替えの順で使うと便利です。",
  },
  zh: {
    label: "Data explorer controls",
    title: "使用搜索、筛选和排序快速缩小国家与指标范围。",
    subtitle: "表格包含许多国家，先使用搜索和筛选会更容易比较。",
    search: "国家搜索",
    searchDesc: "按国家名、ISO代码或地区搜索。",
    filters: "筛选",
    filtersDesc: "按地区、收入组、数据可用性和最新年份筛选。",
    sorting: "列排序",
    sortingDesc: "按进口/GDP、关税率、物流指数等指标排序。",
    export: "CSV导出",
    exportDesc: "CSV 是辅助功能，主要用于核对或研究。",
    tip: "推荐使用顺序",
    tipText: "先搜索国家，再使用筛选，最后按指标列排序。",
  },
  es: {
    label: "Data explorer controls",
    title: "Use búsqueda, filtros y ordenamiento para comparar rápido.",
    subtitle: "La tabla incluye muchos países; los filtros facilitan la comparación.",
    search: "Búsqueda",
    searchDesc: "Buscar por país, código ISO o región.",
    filters: "Filtros",
    filtersDesc: "Filtrar por región, grupo de ingresos, disponibilidad y año.",
    sorting: "Ordenar columnas",
    sortingDesc: "Ordenar por importaciones/GDP, aranceles o logística.",
    export: "Exportar CSV",
    exportDesc: "CSV es una función secundaria para verificación o investigación.",
    tip: "Flujo recomendado",
    tipText: "Buscar → filtrar → ordenar la columna del indicador.",
  },
  fr: {
    label: "Data explorer controls",
    title: "Utilisez recherche, filtres et tri pour comparer rapidement.",
    subtitle: "La table couvre de nombreux pays; les filtres facilitent la comparaison.",
    search: "Recherche",
    searchDesc: "Recherche par pays, code ISO ou région.",
    filters: "Filtres",
    filtersDesc: "Filtrer par région, revenu, disponibilité et année.",
    sorting: "Tri des colonnes",
    sortingDesc: "Trier par importations/GDP, tarifs ou logistique.",
    export: "Export CSV",
    exportDesc: "CSV est une fonction secondaire pour vérification ou recherche.",
    tip: "Flux recommandé",
    tipText: "Recherche → filtres → tri de l’indicateur.",
  },
  de: {
    label: "Data explorer controls",
    title: "Suche, Filter und Sortierung erleichtern den Vergleich.",
    subtitle: "Die Tabelle umfasst viele Länder; Filter machen den Vergleich schneller.",
    search: "Suche",
    searchDesc: "Nach Land, ISO-Code oder Region suchen.",
    filters: "Filter",
    filtersDesc: "Nach Region, Einkommensgruppe, Verfügbarkeit und Jahr filtern.",
    sorting: "Spalten sortieren",
    sortingDesc: "Nach Import/GDP, Zollsatz oder Logistikindex sortieren.",
    export: "CSV exportieren",
    exportDesc: "CSV ist eine Nebenfunktion für Prüfung oder Forschung.",
    tip: "Empfohlener Ablauf",
    tipText: "Suche → Filter → gewünschte Kennzahl sortieren.",
  },
};

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-5">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}

export default function WorldBankExplorerControlsPanel({
  language,
}: {
  language: Language;
}) {
  const t = copy[language] ?? copy.en;

  return (
    <section className="mx-auto max-w-7xl px-6 pb-8">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 lg:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
          {t.label}
        </p>

        <div className="mt-4 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <h2 className="max-w-4xl text-3xl font-bold leading-tight text-white">
              {t.title}
            </h2>
            <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-300">
              {t.subtitle}
            </p>
          </div>

          <div className="rounded-2xl border border-indigo-400/20 bg-indigo-400/10 p-5">
            <p className="text-sm font-semibold text-indigo-100">{t.tip}</p>
            <p className="mt-2 text-sm leading-6 text-indigo-50/80">
              {t.tipText}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-4">
          <FeatureCard title={t.search} description={t.searchDesc} />
          <FeatureCard title={t.filters} description={t.filtersDesc} />
          <FeatureCard title={t.sorting} description={t.sortingDesc} />
          <FeatureCard title={t.export} description={t.exportDesc} />
        </div>
      </div>
    </section>
  );
}
