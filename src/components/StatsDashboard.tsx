"use client";

import { useEffect, useMemo, useState } from "react";
import type { CountryRow, StatValue } from "@/lib/worldBank";
import WorldMap from "@/components/WorldMap";

type Language = "ko" | "en" | "ja" | "zh" | "es" | "fr" | "de";

type SortKey =
  | "country"
  | "region"
  | "incomeLevel"
  | "energyImportPercent"
  | "fuelImportShare"
  | "foodImportShare"
  | "importsGdp"
  | "importUsd"
  | "tariffRate"
  | "logisticsIndex"
  | "dataCompleteness";

type SortDirection = "asc" | "desc";

type SortConfig = {
  key: SortKey;
  direction: SortDirection;
} | null;

const copy = {
  ko: {
    siteName: "Dependency Radar",
    subtitle: "Country Dependency & Supply Exposure Data",
    navData: "데이터",
    navMethod: "분석 기준",
    navContact: "문의",
    heroBadge: "Global Country Dependency Statistics",
    heroTitle: "국가별 의존도와 공급망 취약성을 실제 통계로 비교합니다.",
    heroText:
      "Dependency Radar는 임의의 위험도 점수 대신, World Bank 공개 지표를 기반으로 국가별 에너지, 연료, 식량, 수입, 관세, 물류 데이터를 비교하는 전문 통계 플랫폼입니다.",
    currentCountry: "현재 접속 국가",
    countries: "국가/경제권",
    indicators: "정확 지표",
    source: "데이터 출처",
    sourceValue: "World Bank API",
    searchPlaceholder: "국가 검색",
    allRegions: "전체 지역",
    showing: "표시 중",
    tableTitle: "국가별 실제 통계 데이터",
    tableNote:
      "표 제목을 클릭하면 오름차순/내림차순으로 정렬할 수 있습니다. 값 아래의 작은 연도는 해당 지표의 최신 제공 연도입니다.",
    country: "국가",
    region: "지역",
    income: "소득 그룹",
    energy: "에너지 순수입",
    fuel: "연료 수입 비중",
    food: "식량 수입 비중",
    importsGdp: "수입/GDP",
    importsUsd: "총 수입액",
    tariff: "관세율",
    logistics: "물류지수",
    coverage: "데이터 수",
    loading: "데이터를 준비하는 중입니다.",
    methodTitle: "분석 기준",
    methodText:
      "이 화면은 100점 만점의 임의 위험도 점수를 만들지 않고, 각 국가의 실제 원자료 지표를 그대로 표시합니다. 일부 국가는 특정 지표가 최신 연도에 제공되지 않을 수 있으므로, 각 값 아래의 연도를 함께 확인해야 합니다.",
    contactTitle: "문의",
    contactText: "서비스 제안, 데이터 오류, 협업 문의는 아래 이메일로 연락해 주세요.",
    emailLabel: "문의 이메일",
    visitorFirst: "현재 접속 국가가 기본적으로 최상단에 표시됩니다.",
  },
  en: {
    siteName: "Dependency Radar",
    subtitle: "Country Dependency & Supply Exposure Data",
    navData: "Data",
    navMethod: "Methodology",
    navContact: "Contact",
    heroBadge: "Global Country Dependency Statistics",
    heroTitle:
      "Compare national dependency and supply-chain exposure with real statistics.",
    heroText:
      "Dependency Radar is a professional statistics platform that compares energy, fuel, food, import, tariff, and logistics indicators from public World Bank data instead of using arbitrary 100-point risk scores.",
    currentCountry: "Current country",
    countries: "Countries/Economies",
    indicators: "Exact indicators",
    source: "Data source",
    sourceValue: "World Bank API",
    searchPlaceholder: "Search country",
    allRegions: "All regions",
    showing: "Showing",
    tableTitle: "Country-level statistical data",
    tableNote:
      "Click a table header to sort ascending or descending. The small year below each value shows the latest available year for that indicator.",
    country: "Country",
    region: "Region",
    income: "Income group",
    energy: "Energy net imports",
    fuel: "Fuel import share",
    food: "Food import share",
    importsGdp: "Imports/GDP",
    importsUsd: "Total imports",
    tariff: "Tariff rate",
    logistics: "Logistics index",
    coverage: "Data count",
    loading: "Preparing data.",
    methodTitle: "Methodology",
    methodText:
      "This page does not convert indicators into an arbitrary 100-point risk score. It displays the original statistical values directly. Some indicators may not be available for every country in the latest year, so the year shown under each value should be checked.",
    contactTitle: "Contact",
    contactText:
      "For service inquiries, data corrections, or collaboration proposals, please contact the email below.",
    emailLabel: "Contact email",
    visitorFirst: "Your current country is shown at the top by default.",
  },
  ja: {
    siteName: "Dependency Radar",
    subtitle: "Country Dependency & Supply Exposure Data",
    navData: "データ",
    navMethod: "分析基準",
    navContact: "お問い合わせ",
    heroBadge: "Global Country Dependency Statistics",
    heroTitle: "各国の依存度とサプライチェーン脆弱性を実統計で比較します。",
    heroText:
      "Dependency Radarは任意の100点リスクスコアではなく、World Bankの公開指標を基に各国のエネルギー、燃料、食料、輸入、関税、物流データを比較する統計プラットフォームです。",
    currentCountry: "現在の接続国",
    countries: "国/経済圏",
    indicators: "正確な指標",
    source: "データ出典",
    sourceValue: "World Bank API",
    searchPlaceholder: "国を検索",
    allRegions: "すべての地域",
    showing: "表示中",
    tableTitle: "国別統計データ",
    tableNote:
      "表の見出しをクリックすると昇順/降順で並び替えできます。各値の下の年は最新提供年です。",
    country: "国",
    region: "地域",
    income: "所得グループ",
    energy: "エネルギー純輸入",
    fuel: "燃料輸入比率",
    food: "食料輸入比率",
    importsGdp: "輸入/GDP",
    importsUsd: "総輸入額",
    tariff: "関税率",
    logistics: "物流指数",
    coverage: "データ数",
    loading: "データを準備しています。",
    methodTitle: "分析基準",
    methodText:
      "この画面は任意の100点リスクスコアではなく、各国の原指標をそのまま表示します。国によって最新年のデータがない場合があります。",
    contactTitle: "お問い合わせ",
    contactText: "サービス提案、データ修正、協業のお問い合わせは下記メールまでご連絡ください。",
    emailLabel: "お問い合わせメール",
    visitorFirst: "現在の接続国が初期状態で最上位に表示されます。",
  },
  zh: {
    siteName: "Dependency Radar",
    subtitle: "Country Dependency & Supply Exposure Data",
    navData: "数据",
    navMethod: "方法论",
    navContact: "联系",
    heroBadge: "Global Country Dependency Statistics",
    heroTitle: "用真实统计数据比较各国依赖度与供应链脆弱性。",
    heroText:
      "Dependency Radar 不使用任意的100分风险分数，而是基于 World Bank 公开指标比较各国能源、燃料、食品、进口、关税和物流数据。",
    currentCountry: "当前访问国家",
    countries: "国家/经济体",
    indicators: "精确指标",
    source: "数据来源",
    sourceValue: "World Bank API",
    searchPlaceholder: "搜索国家",
    allRegions: "所有地区",
    showing: "显示",
    tableTitle: "国家级统计数据",
    tableNote: "点击表头可按升序/降序排序。每个数值下方的小年份表示该指标的最新年份。",
    country: "国家",
    region: "地区",
    income: "收入组别",
    energy: "能源净进口",
    fuel: "燃料进口占比",
    food: "食品进口占比",
    importsGdp: "进口/GDP",
    importsUsd: "总进口额",
    tariff: "关税率",
    logistics: "物流指数",
    coverage: "数据数",
    loading: "正在准备数据。",
    methodTitle: "方法论",
    methodText:
      "本页面不将指标转换为任意的100分风险分数，而是直接显示原始统计值。部分国家可能没有最新年份的某些指标。",
    contactTitle: "联系",
    contactText: "服务建议、数据纠错或合作咨询，请通过以下邮箱联系。",
    emailLabel: "联系邮箱",
    visitorFirst: "当前访问国家默认显示在最上方。",
  },
  es: {
    siteName: "Dependency Radar",
    subtitle: "Country Dependency & Supply Exposure Data",
    navData: "Datos",
    navMethod: "Metodología",
    navContact: "Contacto",
    heroBadge: "Global Country Dependency Statistics",
    heroTitle:
      "Compara la dependencia nacional y la exposición de la cadena de suministro con estadísticas reales.",
    heroText:
      "Dependency Radar compara indicadores públicos del World Bank sobre energía, combustibles, alimentos, importaciones, aranceles y logística, sin usar puntuaciones arbitrarias de riesgo.",
    currentCountry: "País actual",
    countries: "Países/Economías",
    indicators: "Indicadores exactos",
    source: "Fuente de datos",
    sourceValue: "World Bank API",
    searchPlaceholder: "Buscar país",
    allRegions: "Todas las regiones",
    showing: "Mostrando",
    tableTitle: "Datos estadísticos por país",
    tableNote:
      "Haz clic en un encabezado para ordenar. El año pequeño bajo cada valor muestra el último año disponible.",
    country: "País",
    region: "Región",
    income: "Grupo de ingresos",
    energy: "Importación neta de energía",
    fuel: "Participación de combustibles",
    food: "Participación de alimentos",
    importsGdp: "Importaciones/GDP",
    importsUsd: "Importaciones totales",
    tariff: "Arancel",
    logistics: "Índice logístico",
    coverage: "Datos",
    loading: "Preparando datos.",
    methodTitle: "Metodología",
    methodText:
      "Esta página muestra valores estadísticos originales en lugar de convertirlos en una puntuación arbitraria de 100 puntos.",
    contactTitle: "Contacto",
    contactText:
      "Para consultas, correcciones de datos o propuestas de colaboración, contacta al correo siguiente.",
    emailLabel: "Correo de contacto",
    visitorFirst: "Tu país actual aparece arriba por defecto.",
  },
  fr: {
    siteName: "Dependency Radar",
    subtitle: "Country Dependency & Supply Exposure Data",
    navData: "Données",
    navMethod: "Méthodologie",
    navContact: "Contact",
    heroBadge: "Global Country Dependency Statistics",
    heroTitle:
      "Comparez la dépendance nationale et l’exposition des chaînes d’approvisionnement avec des statistiques réelles.",
    heroText:
      "Dependency Radar compare les indicateurs publics de la World Bank sur l’énergie, les combustibles, l’alimentation, les importations, les droits de douane et la logistique.",
    currentCountry: "Pays actuel",
    countries: "Pays/Économies",
    indicators: "Indicateurs exacts",
    source: "Source des données",
    sourceValue: "World Bank API",
    searchPlaceholder: "Rechercher un pays",
    allRegions: "Toutes les régions",
    showing: "Affichage",
    tableTitle: "Données statistiques par pays",
    tableNote:
      "Cliquez sur un en-tête pour trier. L’année sous chaque valeur indique la dernière année disponible.",
    country: "Pays",
    region: "Région",
    income: "Groupe de revenu",
    energy: "Importations nettes d’énergie",
    fuel: "Part des combustibles",
    food: "Part alimentaire",
    importsGdp: "Importations/GDP",
    importsUsd: "Importations totales",
    tariff: "Tarif douanier",
    logistics: "Indice logistique",
    coverage: "Données",
    loading: "Préparation des données.",
    methodTitle: "Méthodologie",
    methodText:
      "Cette page affiche les valeurs statistiques originales au lieu de les convertir en un score de risque arbitraire sur 100.",
    contactTitle: "Contact",
    contactText:
      "Pour toute demande de service, correction de données ou proposition de collaboration, contactez l’e-mail ci-dessous.",
    emailLabel: "E-mail de contact",
    visitorFirst: "Votre pays actuel est affiché en haut par défaut.",
  },
  de: {
    siteName: "Dependency Radar",
    subtitle: "Country Dependency & Supply Exposure Data",
    navData: "Daten",
    navMethod: "Methodik",
    navContact: "Kontakt",
    heroBadge: "Global Country Dependency Statistics",
    heroTitle:
      "Vergleichen Sie nationale Abhängigkeit und Lieferkettenrisiken mit echten Statistiken.",
    heroText:
      "Dependency Radar vergleicht öffentliche World-Bank-Indikatoren zu Energie, Brennstoffen, Lebensmitteln, Importen, Zöllen und Logistik.",
    currentCountry: "Aktuelles Land",
    countries: "Länder/Volkswirtschaften",
    indicators: "Exakte Indikatoren",
    source: "Datenquelle",
    sourceValue: "World Bank API",
    searchPlaceholder: "Land suchen",
    allRegions: "Alle Regionen",
    showing: "Angezeigt",
    tableTitle: "Länderstatistiken",
    tableNote:
      "Klicken Sie auf eine Spaltenüberschrift, um zu sortieren. Das kleine Jahr unter jedem Wert zeigt das aktuellste verfügbare Jahr.",
    country: "Land",
    region: "Region",
    income: "Einkommensgruppe",
    energy: "Nettoenergieimporte",
    fuel: "Brennstoffimportanteil",
    food: "Lebensmittelimportanteil",
    importsGdp: "Importe/GDP",
    importsUsd: "Gesamtimporte",
    tariff: "Zollsatz",
    logistics: "Logistikindex",
    coverage: "Datenanzahl",
    loading: "Daten werden vorbereitet.",
    methodTitle: "Methodik",
    methodText:
      "Diese Seite zeigt die ursprünglichen statistischen Werte an, anstatt sie in einen willkürlichen 100-Punkte-Risikoscore umzuwandeln.",
    contactTitle: "Kontakt",
    contactText:
      "Für Serviceanfragen, Datenkorrekturen oder Kooperationsvorschläge kontaktieren Sie bitte die folgende E-Mail.",
    emailLabel: "Kontakt-E-Mail",
    visitorFirst: "Ihr aktuelles Land wird standardmäßig oben angezeigt.",
  },
};

const languageLabels: Record<Language, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  zh: "中文",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
};


const filterCopy: Record<
  Language,
  {
    hideNoDataRows: string;
    minimumDataCount: string;
    latestYearFilter: string;
    allYears: string;
    downloadCsv: string;
  }
> = {
  ko: {
    hideNoDataRows: "데이터가 전혀 없는 국가 숨기기",
    minimumDataCount: "최소 데이터 수",
    latestYearFilter: "최신 데이터 연도",
    allYears: "전체 연도",
    downloadCsv: "CSV 다운로드",
  },
  en: {
    hideNoDataRows: "Hide countries with no data",
    minimumDataCount: "Minimum data count",
    latestYearFilter: "Latest data year",
    allYears: "All years",
    downloadCsv: "Download CSV",
  },
  ja: {
    hideNoDataRows: "データがない国を非表示",
    minimumDataCount: "最小データ数",
    latestYearFilter: "最新データ年",
    allYears: "すべての年",
    downloadCsv: "CSVをダウンロード",
  },
  zh: {
    hideNoDataRows: "隐藏无数据国家",
    minimumDataCount: "最少数据数",
    latestYearFilter: "最新数据年份",
    allYears: "所有年份",
    downloadCsv: "下载CSV",
  },
  es: {
    hideNoDataRows: "Ocultar países sin datos",
    minimumDataCount: "Datos mínimos",
    latestYearFilter: "Último año de datos",
    allYears: "Todos los años",
    downloadCsv: "Descargar CSV",
  },
  fr: {
    hideNoDataRows: "Masquer les pays sans données",
    minimumDataCount: "Nombre minimum de données",
    latestYearFilter: "Dernière année disponible",
    allYears: "Toutes les années",
    downloadCsv: "Télécharger CSV",
  },
  de: {
    hideNoDataRows: "Länder ohne Daten ausblenden",
    minimumDataCount: "Mindestanzahl an Daten",
    latestYearFilter: "Neuestes Datenjahr",
    allYears: "Alle Jahre",
    downloadCsv: "CSV herunterladen",
  },
};

function getRowStatList(row: CountryRow) {
  return [
    row.energyImportPercent,
    row.fuelImportShare,
    row.foodImportShare,
    row.importsGdp,
    row.importUsd,
    row.tariffRate,
    row.logisticsIndex,
  ];
}

function getLatestAvailableYear(row: CountryRow) {
  const years = getRowStatList(row)
    .map((stat) => (stat.year ? Number(stat.year) : null))
    .filter((year): year is number => year !== null && !Number.isNaN(year));

  if (years.length === 0) return null;

  return Math.max(...years);
}

function escapeCsvValue(value: unknown) {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function countryToLanguage(countryCode: string): Language {
  const code = countryCode.toUpperCase();

  if (code === "KR") return "ko";
  if (code === "JP") return "ja";
  if (["CN", "TW", "HK", "MO", "SG"].includes(code)) return "zh";
  if (["ES", "MX", "AR", "CL", "CO", "PE", "VE", "EC", "UY", "PY", "BO", "CR", "PA", "DO", "GT", "HN", "NI", "SV"].includes(code)) return "es";
  if (["FR", "BE", "CH", "CA", "LU", "MC"].includes(code)) return "fr";
  if (["DE", "AT"].includes(code)) return "de";

  return "en";
}

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

function formatPercent(stat: StatValue, language: Language) {
  if (stat.value === null) return "—";

  return `${stat.value.toLocaleString(languageToLocale(language), {
    maximumFractionDigits: 2,
  })}%`;
}

function formatUsd(stat: StatValue, language: Language) {
  if (stat.value === null) return "—";

  return new Intl.NumberFormat(languageToLocale(language), {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(stat.value);
}

function formatNumber(stat: StatValue, language: Language) {
  if (stat.value === null) return "—";

  return stat.value.toLocaleString(languageToLocale(language), {
    maximumFractionDigits: 2,
  });
}

function Year({ stat }: { stat: StatValue }) {
  if (!stat.year) {
    return <span className="text-xs text-slate-600">No year</span>;
  }

  return <span className="text-xs text-slate-500">{stat.year}</span>;
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

function getSortValue(row: CountryRow, key: SortKey, language: Language) {
  if (key === "country") return getLocalizedCountryName(row, language);
  if (key === "region") return row.region;
  if (key === "incomeLevel") return row.incomeLevel;
  if (key === "dataCompleteness") return row.dataCompleteness;

  return row[key].value;
}

function isNumericSort(key: SortKey) {
  return !["country", "region", "incomeLevel"].includes(key);
}

function SortHeader({
  label,
  sortKey,
  sortConfig,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  sortConfig: SortConfig;
  onSort: (key: SortKey) => void;
}) {
  const active = sortConfig?.key === sortKey;
  const arrow = active ? (sortConfig.direction === "asc" ? "↑" : "↓") : "↕";

  return (
    <button
      onClick={() => onSort(sortKey)}
      className="flex items-center gap-1 text-left hover:text-white"
    >
      <span>{label}</span>
      <span className={active ? "text-indigo-300" : "text-slate-600"}>
        {arrow}
      </span>
    </button>
  );
}

function LoadingScreen({ language }: { language: Language }) {

  const t = copy[language];

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070914] text-white">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
        <p className="text-xl font-bold">{t.siteName}</p>
        <p className="mt-3 text-sm text-slate-400">{t.loading}</p>
      </div>
    </main>
  );
}

export default function StatsDashboard({
  rows,
  errorMessage,
}: {
  rows: CountryRow[];
  errorMessage?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState<Language>("ko");
  const [visitorCountry, setVisitorCountry] = useState("KR");
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [hideNoDataRows, setHideNoDataRows] = useState(false);
  const [minimumDataCount, setMinimumDataCount] = useState(0);
  const [minimumLatestYear, setMinimumLatestYear] = useState("all");

  useEffect(() => {
    async function initialize() {
      const savedLanguage = localStorage.getItem("dependency-radar-language");

      if (
        savedLanguage === "ko" ||
        savedLanguage === "en" ||
        savedLanguage === "ja" ||
        savedLanguage === "zh" ||
        savedLanguage === "es" ||
        savedLanguage === "fr" ||
        savedLanguage === "de"
      ) {
        setLanguage(savedLanguage);
      }

      try {
        const response = await fetch("/api/geo");
        const data = await response.json();

        if (data.country) {
          setVisitorCountry(data.country);

          if (!savedLanguage) {
            setLanguage(countryToLanguage(data.country));
          }
        }
      } catch {
        if (!savedLanguage) {
          setLanguage("en");
        }
      }

      setMounted(true);
    }

    initialize();
  }, []);

  function changeLanguage(nextLanguage: Language) {
    setLanguage(nextLanguage);
    localStorage.setItem("dependency-radar-language", nextLanguage);
  }

  function handleSort(key: SortKey) {
    setSortConfig((current) => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }

      return {
        key,
        direction: isNumericSort(key) ? "desc" : "asc",
      };
    });
  }


  function downloadCsv() {
    const headers = [
      "Country",
      "Original country name",
      "ISO2",
      "ISO3",
      "Region",
      "Income group",
      "Energy net imports (%)",
      "Energy year",
      "Fuel import share (%)",
      "Fuel year",
      "Food import share (%)",
      "Food year",
      "Imports/GDP (%)",
      "Imports/GDP year",
      "Total imports USD",
      "Total imports year",
      "Tariff rate (%)",
      "Tariff year",
      "Logistics index",
      "Logistics year",
      "Data count",
      "Latest available year",
      "Source",
    ];

    const csvRows = filteredAndSortedRows.map((row) => [
      getLocalizedCountryName(row, language),
      row.name,
      row.iso2,
      row.iso3,
      row.region,
      row.incomeLevel,
      row.energyImportPercent.value ?? "",
      row.energyImportPercent.year ?? "",
      row.fuelImportShare.value ?? "",
      row.fuelImportShare.year ?? "",
      row.foodImportShare.value ?? "",
      row.foodImportShare.year ?? "",
      row.importsGdp.value ?? "",
      row.importsGdp.year ?? "",
      row.importUsd.value ?? "",
      row.importUsd.year ?? "",
      row.tariffRate.value ?? "",
      row.tariffRate.year ?? "",
      row.logisticsIndex.value ?? "",
      row.logisticsIndex.year ?? "",
      row.dataCompleteness,
      getLatestAvailableYear(row) ?? "",
      "World Bank API",
    ]);

    const csv = "\uFEFF" + [headers, ...csvRows]
      .map((row) => row.map(escapeCsvValue).join(","))
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `dependency-radar-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  const t = copy[language];
  const f = filterCopy[language];

  const regions = useMemo(() => {
    const uniqueRegions = Array.from(new Set(rows.map((row) => row.region)));
    return uniqueRegions.sort();
  }, [rows]);

  const filteredAndSortedRows = useMemo(() => {
    const filtered = rows.filter((row) => {
      const countryName = getLocalizedCountryName(row, language);

      const matchesSearch =
        countryName.toLowerCase().includes(search.toLowerCase()) ||
        row.name.toLowerCase().includes(search.toLowerCase()) ||
        row.iso2.toLowerCase().includes(search.toLowerCase()) ||
        row.iso3.toLowerCase().includes(search.toLowerCase());

      const matchesRegion = region === "all" || row.region === region;
      const matchesDataPresence = !hideNoDataRows || row.dataCompleteness > 0;
      const matchesMinimumDataCount = row.dataCompleteness >= minimumDataCount;
      const latestAvailableYear = getLatestAvailableYear(row);
      const matchesLatestYear =
        minimumLatestYear === "all" ||
        (latestAvailableYear !== null &&
          latestAvailableYear >= Number(minimumLatestYear));

      return (
        matchesSearch &&
        matchesRegion &&
        matchesDataPresence &&
        matchesMinimumDataCount &&
        matchesLatestYear
      );
    });

    return filtered.sort((a, b) => {
      if (!sortConfig) {
        const aIsVisitor = a.iso2 === visitorCountry;
        const bIsVisitor = b.iso2 === visitorCountry;

        if (aIsVisitor && !bIsVisitor) return -1;
        if (!aIsVisitor && bIsVisitor) return 1;

        return getLocalizedCountryName(a, language).localeCompare(
          getLocalizedCountryName(b, language),
          languageToLocale(language)
        );
      }

      const aValue = getSortValue(a, sortConfig.key, language);
      const bValue = getSortValue(b, sortConfig.key, language);

      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return 1;
      if (bValue === null) return -1;

      let result = 0;

      if (typeof aValue === "number" && typeof bValue === "number") {
        result = aValue - bValue;
      } else {
        result = String(aValue).localeCompare(
          String(bValue),
          languageToLocale(language)
        );
      }

      return sortConfig.direction === "asc" ? result : -result;
    });
  }, [rows, search, region, language, sortConfig, visitorCountry, hideNoDataRows, minimumDataCount, minimumLatestYear]);

  const visitorCountryName = useMemo(() => {
    try {
      const displayNames = new Intl.DisplayNames([languageToLocale(language)], {
        type: "region",
      });

      return displayNames.of(visitorCountry) ?? visitorCountry;
    } catch {
      return visitorCountry;
    }
  }, [visitorCountry, language]);

  if (!mounted) {
    return <LoadingScreen language={language} />;
  }

  return (
    <main className="min-h-screen bg-[#070914] text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#070914]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-lg font-bold">{t.siteName}</p>
            <p className="text-xs text-slate-400">{t.subtitle}</p>
          </div>

          <nav className="hidden gap-6 text-sm text-slate-300 md:flex">
            <a href="#data" className="hover:text-white">
              {t.navData}
            </a>
            <a href="#method" className="hover:text-white">
              {t.navMethod}
            </a>
            <a href="#contact" className="hover:text-white">
              {t.navContact}
            </a>
          </nav>

          <select
            value={language}
            onChange={(event) => changeLanguage(event.target.value as Language)}
            className="rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-sm text-white outline-none"
          >
            {Object.entries(languageLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="mb-5 inline-flex rounded-full border border-indigo-400/30 bg-indigo-400/10 px-4 py-2 text-sm text-indigo-200">
          {t.heroBadge}
        </p>

        <h1 className="max-w-5xl text-4xl font-bold tracking-tight md:text-6xl">
          {t.heroTitle}
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          {t.heroText}
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-indigo-400/30 bg-indigo-400/10 p-6">
            <p className="text-sm text-indigo-200">{t.currentCountry}</p>
            <p className="mt-2 text-2xl font-bold">{visitorCountryName}</p>
            <p className="mt-2 text-xs text-slate-400">{t.visitorFirst}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">{t.countries}</p>
            <p className="mt-2 text-2xl font-bold">{rows.length}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">{t.indicators}</p>
            <p className="mt-2 text-2xl font-bold">7</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">{t.source}</p>
            <p className="mt-2 text-2xl font-bold">{t.sourceValue}</p>
          </div>
        </div>
      </section>

      <WorldMap
        rows={rows}
        language={language}
        visitorCountry={visitorCountry}
      />

      <section id="data" className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-300">
              Statistical Dataset
            </p>
            <h2 className="mt-2 text-3xl font-bold">{t.tableTitle}</h2>
            <p className="mt-2 text-sm text-slate-400">{t.tableNote}</p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t.searchPlaceholder}
              className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
            />

            <select
              value={region}
              onChange={(event) => setRegion(event.target.value)}
              className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none"
            >
              <option value="all">{t.allRegions}</option>
              {regions.map((regionName) => (
                <option key={regionName} value={regionName}>
                  {regionName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="mb-4 text-sm text-slate-400">
          {t.showing}:{" "}
          {filteredAndSortedRows.length.toLocaleString(languageToLocale(language))} /{" "}
          {rows.length.toLocaleString(languageToLocale(language))}
        </p>

        {errorMessage ? (
          <div className="mb-6 rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-red-100">
            {errorMessage}
          </div>
        ) : null}

        <div className="overflow-x-auto rounded-3xl border border-white/10">
          <table className="w-full min-w-[1300px] border-collapse text-left text-sm">
            <thead className="bg-white/[0.06] text-slate-400">
              <tr>
                <th className="px-5 py-4">
                  <SortHeader
                    label={t.country}
                    sortKey="country"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-5 py-4">
                  <SortHeader
                    label={t.region}
                    sortKey="region"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-5 py-4">
                  <SortHeader
                    label={t.income}
                    sortKey="incomeLevel"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-5 py-4">
                  <SortHeader
                    label={t.energy}
                    sortKey="energyImportPercent"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-5 py-4">
                  <SortHeader
                    label={t.fuel}
                    sortKey="fuelImportShare"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-5 py-4">
                  <SortHeader
                    label={t.food}
                    sortKey="foodImportShare"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-5 py-4">
                  <SortHeader
                    label={t.importsGdp}
                    sortKey="importsGdp"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-5 py-4">
                  <SortHeader
                    label={t.importsUsd}
                    sortKey="importUsd"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-5 py-4">
                  <SortHeader
                    label={t.tariff}
                    sortKey="tariffRate"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-5 py-4">
                  <SortHeader
                    label={t.logistics}
                    sortKey="logisticsIndex"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-5 py-4">
                  <SortHeader
                    label={t.coverage}
                    sortKey="dataCompleteness"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredAndSortedRows.map((row) => {
                const isVisitorCountry = row.iso2 === visitorCountry;

                return (
                  <tr
                    key={row.iso3}
                    className={`border-t border-white/10 ${
                      isVisitorCountry ? "bg-indigo-400/10" : ""
                    }`}
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold">
                        {getLocalizedCountryName(row, language)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {row.name} · {row.iso3}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-slate-300">{row.region}</td>
                    <td className="px-5 py-4 text-slate-300">
                      {row.incomeLevel}
                    </td>

                    <td className="px-5 py-4">
                      <p>{formatPercent(row.energyImportPercent, language)}</p>
                      <Year stat={row.energyImportPercent} />
                    </td>

                    <td className="px-5 py-4">
                      <p>{formatPercent(row.fuelImportShare, language)}</p>
                      <Year stat={row.fuelImportShare} />
                    </td>

                    <td className="px-5 py-4">
                      <p>{formatPercent(row.foodImportShare, language)}</p>
                      <Year stat={row.foodImportShare} />
                    </td>

                    <td className="px-5 py-4">
                      <p>{formatPercent(row.importsGdp, language)}</p>
                      <Year stat={row.importsGdp} />
                    </td>

                    <td className="px-5 py-4">
                      <p>{formatUsd(row.importUsd, language)}</p>
                      <Year stat={row.importUsd} />
                    </td>

                    <td className="px-5 py-4">
                      <p>{formatPercent(row.tariffRate, language)}</p>
                      <Year stat={row.tariffRate} />
                    </td>

                    <td className="px-5 py-4">
                      <p>{formatNumber(row.logisticsIndex, language)}</p>
                      <Year stat={row.logisticsIndex} />
                    </td>

                    <td className="px-5 py-4">{row.dataCompleteness} / 7</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section id="method" className="mx-auto max-w-7xl px-6 pb-10">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <p className="text-sm font-medium text-indigo-300">Methodology</p>
          <h2 className="mt-2 text-3xl font-bold">{t.methodTitle}</h2>
          <p className="mt-4 max-w-4xl leading-7 text-slate-300">
            {t.methodText}
          </p>
        </div>
      </section>

      <footer
        id="contact"
        className="mx-auto max-w-7xl border-t border-white/10 px-6 py-10"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold">{t.contactTitle}</h2>
            <p className="mt-2 text-sm text-slate-400">{t.contactText}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
            <p className="text-xs text-slate-500">{t.emailLabel}</p>
            <a
              href="mailto:kevinsmp123@gmail.com"
              className="text-lg font-semibold text-indigo-200 hover:text-white"
            >
              kevinsmp123@gmail.com
            </a>
          </div>

            <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
              <a href="/sources" className="hover:text-white">
                Data Sources
              </a>
              <a href="/privacy" className="hover:text-white">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-white">
                Terms of Use
              </a>
              <a href="/disclaimer" className="hover:text-white">
                Disclaimer
              </a>
            </div>

        </div>
      </footer>
    </main>
  );
}