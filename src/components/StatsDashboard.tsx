"use client";

import { useEffect, useMemo, useState } from "react";
import type { CountryRow, StatValue } from "@/lib/worldBank";
import WorldMap from "@/components/WorldMap";
import ProfessionalDashboardHero from "@/components/ProfessionalDashboardHero";
import OfficialSourceOverview from "@/components/OfficialSourceOverview";
import HomeBottomLinks from "@/components/HomeBottomLinks";
import LatestMonthlyTradePanel from "@/components/LatestMonthlyTradePanel";
import OfficialTariffPanel from "@/components/OfficialTariffPanel";
import OfficialEnergyPanel from "@/components/OfficialEnergyPanel";
import { getFlagEmoji } from "@/lib/flags";
import WorldBankTableOverview from "@/components/WorldBankTableOverview";
import WorldBankExplorerControlsPanel from "@/components/WorldBankExplorerControlsPanel";
import HomeActionHub from "@/components/HomeActionHub";
import HomeDataJumpBar from "@/components/HomeDataJumpBar";

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
    siteName: "Datlora",
    subtitle: "Global Trade & Energy Intelligence",
    navData: "데이터",
    navCompare: "국가 비교",
    navMethod: "분석 기준",
    navContact: "문의",
    heroBadge: "Global Country Trade & Energy Statistics",
    heroTitle: "국가별 무역·에너지 의존도을 실제 통계로 비교합니다.",
    heroText:
      "Datlora는 임의의 위험도 점수 대신, World Bank 공개 지표를 기반으로 국가별 에너지, 연료, 식량, 수입, 관세, 물류 데이터를 비교하는 전문 통계 플랫폼입니다.",
    currentCountry: "현재 접속 국가",
    countries: "국가/경제권",
    indicators: "정확 지표",
    source: "주요 출처",
    sourceValue: "World Bank API",
    searchPlaceholder: "국가명 / ISO 코드 / 지역 검색",
    allRegions: "전체 지역",
    showing: "표시 중",
    tableTitle: "World Bank 연간 구조 지표",
    tableNote:
      "표 제목을 클릭하면 오름차순/내림차순으로 정렬할 수 있습니다. 값 아래의 작은 연도는 해당 지표의 최신 제공 연도입니다.",
    country: "국가",
    region: "지역",
    income: "소득 그룹",
    incomeOriginal: "World Bank 원문",
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
    hideNoDataRows: "데이터가 전혀 없는 국가 숨기기",
    minimumDataCount: "최소 데이터 수",
    latestYearFilter: "World Bank 최신 연도",
    allYears: "전체 연도",
    downloadCsv: "CSV 내보내기",
    dataFilters: "데이터 필터",
    filterDescription:
      "데이터 제공 여부와 최신 연도를 기준으로 국가를 필터링하고, 현재 보이는 표를 CSV로 저장할 수 있습니다.",
    compareTitle: "국가 비교",
    compareSubtitle:
      "최대 3개 국가를 선택해 주요 의존도 지표를 같은 표에서 비교합니다.",
    selectCountry: "국가 선택",
    compareTable: "비교 표",
    noCompareCountry: "비교할 국가를 선택해 주세요.",
    latestYear: "World Bank 최신 연도",
  },
  en: {
    siteName: "Datlora",
    subtitle: "Global Trade & Energy Intelligence",
    navData: "Data",
    navCompare: "Compare",
    navMethod: "Methodology",
    navContact: "Contact",
    heroBadge: "Global Country Trade & Energy Statistics",
    heroTitle:
      "Compare national dependency and supply-chain exposure with real statistics.",
    heroText:
      "Datlora is a professional statistics platform that compares energy, fuel, food, import, tariff, and logistics indicators from public World Bank data instead of using arbitrary 100-point risk scores.",
    currentCountry: "Current country",
    countries: "Countries/Economies",
    indicators: "Exact indicators",
    source: "Primary sources",
    sourceValue: "World Bank API",
    searchPlaceholder: "Search country, ISO code, or region",
    allRegions: "All regions",
    showing: "Showing",
    tableTitle: "World Bank annual structural indicators",
    tableNote:
      "Click a table header to sort ascending or descending. The small year below each value shows the latest available year for that indicator.",
    country: "Country",
    region: "Region",
    income: "Income group",
    incomeOriginal: "World Bank label",
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
    hideNoDataRows: "Hide countries with no data",
    minimumDataCount: "Minimum data count",
    latestYearFilter: "World Bank latest year",
    allYears: "All years",
    downloadCsv: "Export CSV",
    dataFilters: "Data filters",
    filterDescription:
      "Filter countries by data availability and latest year, then export the visible table as CSV.",
    compareTitle: "Country comparison",
    compareSubtitle:
      "Select up to three countries and compare their major dependency indicators in one table.",
    selectCountry: "Select country",
    compareTable: "Comparison table",
    noCompareCountry: "Select countries to compare.",
    latestYear: "World Bank latest year",
  },
  ja: {
    siteName: "Datlora",
    subtitle: "Global Trade & Energy Intelligence",
    navData: "データ",
    navCompare: "比較",
    navMethod: "分析基準",
    navContact: "お問い合わせ",
    heroBadge: "Global Country Trade & Energy Statistics",
    heroTitle: "各国の依存度とサプライチェーン脆弱性を実統計で比較します。",
    heroText:
      "Datloraは任意の100点リスクスコアではなく、World Bankの公開指標を基に各国のエネルギー、燃料、食料、輸入、関税、物流データを比較する統計プラットフォームです。",
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
    incomeOriginal: "World Bank label",
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
    hideNoDataRows: "データがない国を非表示",
    minimumDataCount: "最小データ数",
    latestYearFilter: "最新データ年",
    allYears: "すべての年",
    downloadCsv: "CSVをダウンロード",
    dataFilters: "データフィルター",
    filterDescription:
      "データの有無と最新年を基準に国を絞り込み、表示中の表をCSVで保存できます。",
    compareTitle: "国別比較",
    compareSubtitle: "最大3か国を選択して主要指標を比較します。",
    selectCountry: "国を選択",
    compareTable: "比較表",
    noCompareCountry: "比較する国を選択してください。",
    latestYear: "最新データ年",
  },
  zh: {
    siteName: "Datlora",
    subtitle: "Global Trade & Energy Intelligence",
    navData: "数据",
    navCompare: "比较",
    navMethod: "方法论",
    navContact: "联系",
    heroBadge: "Global Country Trade & Energy Statistics",
    heroTitle: "用真实统计数据比较各国依赖度与供应链脆弱性。",
    heroText:
      "Datlora 不使用任意的100分风险分数，而是基于 World Bank 公开指标比较各国能源、燃料、食品、进口、关税和物流数据。",
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
    incomeOriginal: "World Bank label",
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
    hideNoDataRows: "隐藏无数据国家",
    minimumDataCount: "最少数据数",
    latestYearFilter: "最新数据年份",
    allYears: "所有年份",
    downloadCsv: "下载CSV",
    dataFilters: "数据筛选",
    filterDescription:
      "按数据可用性和最新年份筛选国家，并导出当前可见表格。",
    compareTitle: "国家比较",
    compareSubtitle: "最多选择三个国家并比较主要依赖指标。",
    selectCountry: "选择国家",
    compareTable: "比较表",
    noCompareCountry: "请选择要比较的国家。",
    latestYear: "最新数据年份",
  },
  es: {
    siteName: "Datlora",
    subtitle: "Global Trade & Energy Intelligence",
    navData: "Datos",
    navCompare: "Comparar",
    navMethod: "Metodología",
    navContact: "Contacto",
    heroBadge: "Global Country Trade & Energy Statistics",
    heroTitle:
      "Compara la dependencia nacional y la exposición de la cadena de suministro con estadísticas reales.",
    heroText:
      "Datlora compara indicadores públicos del World Bank sobre energía, combustibles, alimentos, importaciones, aranceles y logística, sin usar puntuaciones arbitrarias de riesgo.",
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
    incomeOriginal: "World Bank label",
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
    hideNoDataRows: "Ocultar países sin datos",
    minimumDataCount: "Datos mínimos",
    latestYearFilter: "Último año de datos",
    allYears: "Todos los años",
    downloadCsv: "Descargar CSV",
    dataFilters: "Filtros de datos",
    filterDescription:
      "Filtra países por disponibilidad y año reciente, y exporta la tabla visible.",
    compareTitle: "Comparación de países",
    compareSubtitle: "Selecciona hasta tres países y compara indicadores clave.",
    selectCountry: "Seleccionar país",
    compareTable: "Tabla comparativa",
    noCompareCountry: "Selecciona países para comparar.",
    latestYear: "Último año de datos",
  },
  fr: {
    siteName: "Datlora",
    subtitle: "Global Trade & Energy Intelligence",
    navData: "Données",
    navCompare: "Comparer",
    navMethod: "Méthodologie",
    navContact: "Contact",
    heroBadge: "Global Country Trade & Energy Statistics",
    heroTitle:
      "Comparez la dépendance nationale et l’exposition des chaînes d’approvisionnement avec des statistiques réelles.",
    heroText:
      "Datlora compare les indicateurs publics de la World Bank sur l’énergie, les combustibles, l’alimentation, les importations, les droits de douane et la logistique.",
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
    incomeOriginal: "World Bank label",
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
    hideNoDataRows: "Masquer les pays sans données",
    minimumDataCount: "Nombre minimum de données",
    latestYearFilter: "Dernière année disponible",
    allYears: "Toutes les années",
    downloadCsv: "Télécharger CSV",
    dataFilters: "Filtres de données",
    filterDescription:
      "Filtrez les pays par disponibilité des données et année récente, puis exportez la table visible.",
    compareTitle: "Comparaison de pays",
    compareSubtitle: "Sélectionnez jusqu’à trois pays pour comparer les indicateurs clés.",
    selectCountry: "Sélectionner un pays",
    compareTable: "Tableau comparatif",
    noCompareCountry: "Sélectionnez des pays à comparer.",
    latestYear: "Dernière année disponible",
  },
  de: {
    siteName: "Datlora",
    subtitle: "Global Trade & Energy Intelligence",
    navData: "Daten",
    navCompare: "Vergleich",
    navMethod: "Methodik",
    navContact: "Kontakt",
    heroBadge: "Global Country Trade & Energy Statistics",
    heroTitle:
      "Vergleichen Sie nationale Abhängigkeit und Lieferkettenrisiken mit echten Statistiken.",
    heroText:
      "Datlora vergleicht öffentliche World-Bank-Indikatoren zu Energie, Brennstoffen, Lebensmitteln, Importen, Zöllen und Logistik.",
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
    incomeOriginal: "World Bank label",
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
    hideNoDataRows: "Länder ohne Daten ausblenden",
    minimumDataCount: "Mindestanzahl an Daten",
    latestYearFilter: "Neuestes Datenjahr",
    allYears: "Alle Jahre",
    downloadCsv: "CSV herunterladen",
    dataFilters: "Datenfilter",
    filterDescription:
      "Filtern Sie Länder nach Datenverfügbarkeit und aktuellem Jahr, und exportieren Sie die sichtbare Tabelle.",
    compareTitle: "Ländervergleich",
    compareSubtitle: "Wählen Sie bis zu drei Länder und vergleichen Sie wichtige Indikatoren.",
    selectCountry: "Land auswählen",
    compareTable: "Vergleichstabelle",
    noCompareCountry: "Wählen Sie Länder zum Vergleich aus.",
    latestYear: "Neuestes Datenjahr",
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


const indicatorDescriptions: Record<
  Language,
  {
    income: string;
    energy: string;
    fuel: string;
    food: string;
    importsGdp: string;
    importsUsd: string;
    tariff: string;
    logistics: string;
    coverage: string;
    latestYear: string;
  }
> = {
  ko: {
    income:
      "World Bank의 국가 소득 분류입니다. 고소득, 중상위 소득, 중하위 소득, 저소득으로 구분됩니다.",
    energy:
      "에너지 수입량에서 수출량을 뺀 순수입 비율입니다. 양수는 순수입국, 음수는 순수출국일 수 있습니다.",
    fuel:
      "전체 상품 수입 중 연료가 차지하는 비중입니다. 값이 높을수록 수입 품목에서 연료 의존도가 큽니다.",
    food:
      "전체 상품 수입 중 식량이 차지하는 비중입니다. 식량 공급망의 외부 의존도를 보는 참고 지표입니다.",
    importsGdp:
      "재화와 서비스 수입액이 GDP에서 차지하는 비율입니다. 경제 규모 대비 수입 의존도를 보여줍니다.",
    importsUsd:
      "해당 국가의 총 재화·서비스 수입액입니다. 절대적인 수입 규모를 비교할 때 사용합니다.",
    tariff:
      "수입 상품에 적용되는 평균 관세율입니다. 값이 높을수록 무역 장벽이 높을 수 있습니다.",
    logistics:
      "World Bank 물류성과지수입니다. 보통 1~5 범위이며, 값이 높을수록 물류 인프라와 효율성이 좋은 편입니다.",
    coverage:
      "이 사이트에서 사용하는 7개 지표 중 해당 국가에 제공되는 데이터 개수입니다.",
    latestYear:
      "해당 국가의 7개 지표 중 가장 최근에 제공된 데이터 연도입니다.",
  },
  en: {
    income:
      "World Bank income classification: high, upper-middle, lower-middle, or low income.",
    energy:
      "Net energy imports as a share of energy use. Positive values may indicate net import dependence, while negative values may indicate net exports.",
    fuel:
      "Fuel imports as a share of merchandise imports. Higher values suggest greater fuel concentration in imports.",
    food:
      "Food imports as a share of merchandise imports. This helps indicate exposure to external food supply.",
    importsGdp:
      "Imports of goods and services as a share of GDP. It shows import dependence relative to the size of the economy.",
    importsUsd:
      "Total imports of goods and services in current US dollars. This shows the absolute import scale.",
    tariff:
      "Weighted mean tariff rate on imported goods. Higher values may indicate stronger trade barriers.",
    logistics:
      "World Bank Logistics Performance Index. Usually ranges from 1 to 5; higher values indicate stronger logistics performance.",
    coverage:
      "Number of available indicators out of the 7 indicators used on this site.",
    latestYear:
      "The most recent available year among the 7 indicators for this country.",
  },
  ja: {
    income: "World Bankの所得分類です。",
    energy: "エネルギー純輸入比率です。正の値は純輸入、負の値は純輸出を示す場合があります。",
    fuel: "商品輸入に占める燃料の比率です。",
    food: "商品輸入に占める食料の比率です。",
    importsGdp: "GDPに対する財・サービス輸入の比率です。",
    importsUsd: "財・サービス輸入の総額です。",
    tariff: "輸入品に対する平均関税率です。",
    logistics: "World Bank物流パフォーマンス指数です。高いほど物流性能が良い傾向があります。",
    coverage: "このサイトで使用する7指標のうち利用可能なデータ数です。",
    latestYear: "7指標のうち最も新しいデータ年です。",
  },
  zh: {
    income: "World Bank 的收入分类。",
    energy: "能源净进口比例。正值可能表示净进口，负值可能表示净出口。",
    fuel: "燃料进口占商品进口的比例。",
    food: "食品进口占商品进口的比例。",
    importsGdp: "货物和服务进口占GDP的比例。",
    importsUsd: "货物和服务进口总额。",
    tariff: "进口商品的加权平均关税率。",
    logistics: "World Bank 物流绩效指数。数值越高通常表示物流表现越好。",
    coverage: "本网站使用的7个指标中可用的数据数量。",
    latestYear: "该国7个指标中最新的数据年份。",
  },
  es: {
    income: "Clasificación de ingresos del World Bank.",
    energy: "Importaciones netas de energía. Valores positivos pueden indicar dependencia de importación.",
    fuel: "Participación de combustibles en las importaciones de mercancías.",
    food: "Participación de alimentos en las importaciones de mercancías.",
    importsGdp: "Importaciones de bienes y servicios como porcentaje del GDP.",
    importsUsd: "Importaciones totales de bienes y servicios en dólares estadounidenses.",
    tariff: "Arancel medio ponderado sobre bienes importados.",
    logistics: "Índice de desempeño logístico del World Bank. Un valor más alto suele indicar mejor logística.",
    coverage: "Número de indicadores disponibles entre los 7 usados en este sitio.",
    latestYear: "Año más reciente disponible entre los 7 indicadores.",
  },
  fr: {
    income: "Classification des revenus de la World Bank.",
    energy: "Importations nettes d’énergie. Une valeur positive peut indiquer une dépendance aux importations.",
    fuel: "Part des combustibles dans les importations de marchandises.",
    food: "Part de l’alimentation dans les importations de marchandises.",
    importsGdp: "Importations de biens et services en pourcentage du GDP.",
    importsUsd: "Importations totales de biens et services en dollars américains.",
    tariff: "Taux tarifaire moyen pondéré sur les biens importés.",
    logistics: "Indice de performance logistique de la World Bank. Une valeur plus élevée indique généralement une meilleure logistique.",
    coverage: "Nombre d’indicateurs disponibles sur les 7 utilisés par ce site.",
    latestYear: "Année la plus récente disponible parmi les 7 indicateurs.",
  },
  de: {
    income: "Einkommensklassifikation der World Bank.",
    energy: "Nettoenergieimporte. Positive Werte können Importabhängigkeit anzeigen.",
    fuel: "Anteil der Brennstoffe an den Warenimporten.",
    food: "Anteil der Lebensmittel an den Warenimporten.",
    importsGdp: "Importe von Waren und Dienstleistungen als Anteil am GDP.",
    importsUsd: "Gesamtimporte von Waren und Dienstleistungen in US-Dollar.",
    tariff: "Gewichteter durchschnittlicher Zollsatz auf importierte Waren.",
    logistics: "Logistics Performance Index der World Bank. Höhere Werte deuten meist auf bessere Logistik hin.",
    coverage: "Anzahl verfügbarer Indikatoren von den 7 auf dieser Website verwendeten Indikatoren.",
    latestYear: "Das aktuellste verfügbare Jahr unter den 7 Indikatoren.",
  },
};

function countryToLanguage(countryCode: string): Language {
  const code = countryCode.toUpperCase();

  if (code === "KR") return "ko";
  if (code === "JP") return "ja";
  if (["CN", "TW", "HK", "MO", "SG"].includes(code)) return "zh";
  if (
    [
      "ES",
      "MX",
      "AR",
      "CL",
      "CO",
      "PE",
      "VE",
      "EC",
      "UY",
      "PY",
      "BO",
      "CR",
      "PA",
      "DO",
      "GT",
      "HN",
      "NI",
      "SV",
    ].includes(code)
  )
    return "es";
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

function getIncomeGroupLabel(incomeLevel: string, language: Language) {
  const normalized = incomeLevel.toLowerCase();

  const labelsKo = {
    high: {
      title: "고소득 국가",
      description: "World Bank 기준 고소득 경제권",
    },
    upperMiddle: {
      title: "중상위 소득 국가",
      description: "고소득 직전 단계의 중상위 소득 경제권",
    },
    lowerMiddle: {
      title: "중하위 소득 국가",
      description: "저소득과 중상위 소득 사이의 경제권",
    },
    low: {
      title: "저소득 국가",
      description: "World Bank 기준 저소득 경제권",
    },
    notClassified: {
      title: "소득 분류 없음",
      description: "World Bank 소득 그룹이 지정되지 않음",
    },
  };

  const labelsEn = {
    high: {
      title: "High-income economy",
      description: "World Bank high-income group",
    },
    upperMiddle: {
      title: "Upper-middle-income economy",
      description: "Economies between high and lower-middle income",
    },
    lowerMiddle: {
      title: "Lower-middle-income economy",
      description: "Economies between low and upper-middle income",
    },
    low: {
      title: "Low-income economy",
      description: "World Bank low-income group",
    },
    notClassified: {
      title: "Not classified",
      description: "No World Bank income classification",
    },
  };

  const labels = language === "ko" ? labelsKo : labelsEn;

  if (normalized.includes("high income")) return labels.high;
  if (normalized.includes("upper middle")) return labels.upperMiddle;
  if (normalized.includes("lower middle")) return labels.lowerMiddle;
  if (normalized.includes("low income")) return labels.low;

  return labels.notClassified;
}

function getSortValue(row: CountryRow, key: SortKey, language: Language) {
  if (key === "country") return getLocalizedCountryName(row, language);
  if (key === "region") return row.region;
  if (key === "incomeLevel") return getIncomeGroupLabel(row.incomeLevel, language).title;
  if (key === "dataCompleteness") return row.dataCompleteness;

  return row[key].value;
}

function isNumericSort(key: SortKey) {
  return !["country", "region", "incomeLevel"].includes(key);
}


function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex">
      <span className="flex h-5 w-5 cursor-help items-center justify-center rounded-full border border-indigo-300/40 bg-indigo-400/10 text-[11px] font-bold text-indigo-200">
        ?
      </span>
      <span className="pointer-events-none absolute left-6 top-1/2 z-50 hidden w-80 -translate-y-1/2 rounded-2xl border border-white/10 bg-[#111524] p-4 text-xs leading-5 text-slate-200 shadow-2xl group-hover:block">
        {text}
      </span>
    </span>
  );
}

function SortHeader({
  label,
  sortKey,
  sortConfig,
  onSort,
  description,
}: {
  label: string;
  sortKey: SortKey;
  sortConfig: SortConfig;
  onSort: (key: SortKey) => void;
  description?: string;
}) {
  const active = sortConfig?.key === sortKey;
  const arrow = active ? (sortConfig.direction === "asc" ? "↑" : "↓") : "↕";

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onSort(sortKey)}
        className="flex items-center gap-1 text-left hover:text-white"
      >
        <span>{label}</span>
        <span className={active ? "text-indigo-300" : "text-slate-600"}>
          {arrow}
        </span>
      </button>
      {description ? <InfoTooltip text={description} /> : null}
    </div>
  );
}

function LoadingScreen({ language }: { language: Language }) {
  const t = copy[language];

  return (
    <main className="dependency-radar-page flex min-h-screen items-center justify-center bg-[#070914] text-white">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
        <p className="text-xl font-bold">{t.siteName}</p>
        <p className="mt-3 text-sm text-slate-400">{t.loading}</p>
      </div>
    </main>
  );
}

function formatMetricValue(
  row: CountryRow,
  metric:
    | "energyImportPercent"
    | "fuelImportShare"
    | "foodImportShare"
    | "importsGdp"
    | "importUsd"
    | "tariffRate"
    | "logisticsIndex",
  language: Language
) {
  const stat = row[metric];

  if (metric === "importUsd") return formatUsd(stat, language);
  if (metric === "logisticsIndex") return formatNumber(stat, language);

  return formatPercent(stat, language);
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
  const [hideNoDataRows, setHideNoDataRows] = useState(true);
  const [minimumDataCount, setMinimumDataCount] = useState(1);
  const [minimumLatestYear, setMinimumLatestYear] = useState("all");
  const [compareIso3, setCompareIso3] = useState(["KOR", "JPN", "USA"]);

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

          const visitorRow = rows.find((row) => row.iso2 === data.country);
          if (visitorRow) {
            const defaults = [visitorRow.iso3, "JPN", "USA"].filter(
              (code, index, array) => array.indexOf(code) === index
            );

            setCompareIso3(defaults.slice(0, 3));
          }

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
  }, [rows]);

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

  function handleCompareChange(index: number, nextIso3: string) {
    setCompareIso3((current) => {
      const next = [...current];
      next[index] = nextIso3;
      return next;
    });
  }

  const t = copy[language];

  const regions = useMemo(() => {
    const uniqueRegions = Array.from(new Set(rows.map((row) => row.region)));
    return uniqueRegions.sort();
  }, [rows]);

  const countryOptions = useMemo(() => {
    return [...rows].sort((a, b) =>
      getLocalizedCountryName(a, language).localeCompare(
        getLocalizedCountryName(b, language),
        languageToLocale(language)
      )
    );
  }, [rows, language]);

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
  }, [
    rows,
    search,
    region,
    language,
    sortConfig,
    visitorCountry,
    hideNoDataRows,
    minimumDataCount,
    minimumLatestYear,
  ]);

  const compareRows = useMemo(() => {
    return compareIso3
      .map((iso3) => rows.find((row) => row.iso3 === iso3))
      .filter((row): row is CountryRow => Boolean(row));
  }, [compareIso3, rows]);

  const compareMetrics = [
    {
      label: t.energy,
      description: indicatorDescriptions[language].energy,
      key: "energyImportPercent" as const,
    },
    {
      label: t.fuel,
      description: indicatorDescriptions[language].fuel,
      key: "fuelImportShare" as const,
    },
    {
      label: t.food,
      description: indicatorDescriptions[language].food,
      key: "foodImportShare" as const,
    },
    {
      label: t.importsGdp,
      description: indicatorDescriptions[language].importsGdp,
      key: "importsGdp" as const,
    },
    {
      label: t.importsUsd,
      description: indicatorDescriptions[language].importsUsd,
      key: "importUsd" as const,
    },
    {
      label: t.tariff,
      description: indicatorDescriptions[language].tariff,
      key: "tariffRate" as const,
    },
    {
      label: t.logistics,
      description: indicatorDescriptions[language].logistics,
      key: "logisticsIndex" as const,
    },
  ];

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

  function downloadCsv() {
    const headers = [
      "Country",
      "Original country name",
      "ISO2",
      "ISO3",
      "Region",
      "Income group",
      "Income group original",
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

    const csvRows = filteredAndSortedRows.map((row) => {
      const income = getIncomeGroupLabel(row.incomeLevel, language);

      return [
        getLocalizedCountryName(row, language),
        row.name,
        row.iso2,
        row.iso3,
        row.region,
        income.title,
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
      ];
    });

    const csv =
      "\uFEFF" +
      [headers, ...csvRows]
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

          <nav className="hidden gap-6 text-sm font-semibold text-slate-300 md:flex">
          <a href="#country-search" className="transition hover:text-white">
            {language === "ko" ? "국가 검색" : "Country search"}
          </a>
          <a href="/topics" className="transition hover:text-white">
            {language === "ko" ? "주제별 통계" : "Topics"}
          </a>
          <a href="/compare?a=KOR&b=USA" className="transition hover:text-white">
            {language === "ko" ? "국가 비교" : "Compare"}
          </a>
          <a href="/challenge" className="transition hover:text-white">
            {language === "ko" ? "데이터 챌린지" : "Challenge"}
          </a>
          <a href="/risk-lab" className="transition hover:text-white">
            Risk Lab
          </a>
          <a href="/world-voyage" className="transition hover:text-white">
            World Voyage 3D
          </a>
          <a href="/sources" className="transition hover:text-white">
            {language === "ko" ? "출처" : "Sources"}
          </a>
        </nav>

          <select
            value={language}
            onChange={(event) => changeLanguage(event.target.value as Language)}
            className="rounded-full border border-white/15 bg-[#111524] px-4 py-2 text-sm text-white outline-none"
          >
            {Object.entries(languageLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </header>

      <ProfessionalDashboardHero
        language={language}
        visitorCountry={visitorCountry}
        visitorCountryName={visitorCountryName}
        countryCount={rows.length}
        indicatorCount={7}
      />

      <HomeActionHub rows={rows} language={language} />

      <HomeDataJumpBar language={language} />
      <div id="latest-trade" className="scroll-mt-28" />
      <div id="energy-data" className="scroll-mt-28" />
      <div id="tariff-data" className="scroll-mt-28" />


{(() => {
              const tradeRow =
                rows.find((item) => item.iso2 === visitorCountry) ??
                rows.find((item) => item.iso3 === "USA") ??
                rows[0];
      
              return tradeRow ? (
                <LatestMonthlyTradePanel
                  iso3={tradeRow.iso3}
                  countryName={`${getFlagEmoji(tradeRow.iso2)} ${getLocalizedCountryName(
                    tradeRow,
                    language
                  )}`}
                  language={language}
                />
              ) : null;
            })()}

      {(() => {
              const tariffRow =
                rows.find((item) => item.iso2 === visitorCountry) ??
                rows.find((item) => item.iso3 === "USA") ??
                rows[0];
      
              return tariffRow ? (
                <OfficialTariffPanel
                  iso3={tariffRow.iso3}
                  countryName={`${getFlagEmoji(tariffRow.iso2)} ${getLocalizedCountryName(
                    tariffRow,
                    language
                  )}`}
                  language={language}
                />
              ) : null;
            })()}
      
            {(() => {
              const energyRow =
                rows.find((item) => item.iso2 === visitorCountry) ??
                rows.find((item) => item.iso3 === "USA") ??
                rows[0];
      
              return energyRow ? (
                <OfficialEnergyPanel
                  iso3={energyRow.iso3}
                  countryName={`${getFlagEmoji(energyRow.iso2)} ${getLocalizedCountryName(
                    energyRow,
                    language
                  )}`}
                  language={language}
                />
              ) : null;
            })()}

      {(() => {
              const tariffRow =
                rows.find((item) => item.iso2 === visitorCountry) ??
                rows.find((item) => item.iso3 === "KOR") ??
                rows.find((item) => item.iso3 === "USA") ??
                rows[0];
      
              return tariffRow ? (
                <OfficialTariffPanel
                  iso3={tariffRow.iso3}
                  countryName={`${getFlagEmoji(tariffRow.iso2)} ${getLocalizedCountryName(
                    tariffRow,
                    language
                  )}`}
                  language={language}
                />
              ) : null;
            })()}
      <div id="world-map" className="scroll-mt-28" />


      <WorldMap rows={rows} language={language} visitorCountry={visitorCountry} />
      <div id="world-bank-table" className="scroll-mt-28" />


      <WorldBankTableOverview rows={rows} language={language} />

      <WorldBankExplorerControlsPanel language={language} />
<section id="compare" className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="mb-6">
            <p className="text-sm font-medium text-indigo-300">
              Country Comparison
            </p>
            <h2 className="mt-2 text-3xl font-bold">{t.compareTitle}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              {t.compareSubtitle}
            </p>
          </div>

          <div className="mb-6 grid gap-3 md:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <label
                key={index}
                className="rounded-2xl border border-white/10 bg-[#0b0f1c] px-4 py-3 text-sm text-slate-300"
              >
                <span className="mb-2 block text-xs text-slate-500">
                  {t.selectCountry} {index + 1}
                </span>
                <select
                  value={compareIso3[index] ?? ""}
                  onChange={(event) =>
                    handleCompareChange(index, event.target.value)
                  }
                  className="w-full bg-[#0b0f1c] text-white outline-none"
                >
                  <option value="">{t.selectCountry}</option>
                  {countryOptions.map((row) => (
                    <option key={row.iso3} value={row.iso3}>
                      {getFlagEmoji(row.iso2)} {getLocalizedCountryName(row, language)} · {row.iso3}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          {compareRows.length === 0 ? (
            <p className="text-sm text-slate-400">{t.noCompareCountry}</p>
          ) : (
            <>
              <div className="mb-6 grid gap-4 md:grid-cols-3">
                {compareRows.map((row) => {
                  const income = getIncomeGroupLabel(row.incomeLevel, language);

                  return (
                    <div
                      key={row.iso3}
                      className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-5"
                    >
                      <a
                        href={`/country/${row.iso3}`}
                        className="text-lg font-bold hover:text-indigo-200 hover:underline"
                      >
                        {getFlagEmoji(row.iso2)} {getLocalizedCountryName(row, language)}
                      </a>
                      <p className="mt-1 text-xs text-slate-500">
                        {row.name} · {row.iso3}
                      </p>
                      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                        <p className="text-sm font-semibold text-white">
                          {income.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {income.description}
                        </p>
                        <p className="mt-2 text-xs text-slate-600">
                          {t.incomeOriginal}: {row.incomeLevel}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="overflow-x-auto rounded-2xl border border-white/10">
                <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                  <thead className="bg-white/[0.06] text-slate-400">
                    <tr>
                      <th className="px-5 py-4">{t.compareTable}</th>
                      {compareRows.map((row) => (
                        <th key={row.iso3} className="px-5 py-4">
                          {getFlagEmoji(row.iso2)} {getLocalizedCountryName(row, language)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {compareMetrics.map((metric) => (
                      <tr key={metric.key} className="border-t border-white/10">
                        <td className="px-5 py-4 font-semibold">
                          <div className="flex items-center gap-2">
                            <span>{metric.label}</span>
                            <InfoTooltip text={metric.description} />
                          </div>
                        </td>
                        {compareRows.map((row) => {
                          const stat = row[metric.key];

                          return (
                            <td key={`${row.iso3}-${metric.key}`} className="px-5 py-4">
                              <p>{formatMetricValue(row, metric.key, language)}</p>
                              <Year stat={stat} />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                    <tr className="border-t border-white/10">
                      <td className="px-5 py-4 font-semibold">
                        {t.latestYear}
                      </td>
                      {compareRows.map((row) => (
                        <td key={`${row.iso3}-latest`} className="px-5 py-4">
                          {getLatestAvailableYear(row) ?? "—"}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </section>

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
              className="rounded-2xl border border-white/10 bg-[#111524] px-4 py-3 text-sm text-white outline-none"
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

        <div className="mb-6 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">
                {t.dataFilters}
              </p>
              <p className="text-xs text-slate-500">
                {t.filterDescription}
              </p>
            </div>

            <button
              onClick={downloadCsv}
              className="rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-400"
            >
              {t.downloadCsv}
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0b0f1c] px-4 py-3 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={hideNoDataRows}
                onChange={(event) => setHideNoDataRows(event.target.checked)}
                className="h-4 w-4"
              />
              <span>{t.hideNoDataRows}</span>
            </label>

            <label className="rounded-2xl border border-white/10 bg-[#0b0f1c] px-4 py-3 text-sm text-slate-300">
              <span className="mb-2 block text-xs text-slate-500">
                {t.minimumDataCount}
              </span>
              <select
                value={minimumDataCount}
                onChange={(event) =>
                  setMinimumDataCount(Number(event.target.value))
                }
                className="w-full bg-[#0b0f1c] text-white outline-none"
              >
                {[0, 1, 2, 3, 4, 5, 6, 7].map((count) => (
                  <option key={count} value={count}>
                    {count} / 7
                  </option>
                ))}
              </select>
            </label>

            <label className="rounded-2xl border border-white/10 bg-[#0b0f1c] px-4 py-3 text-sm text-slate-300">
              <span className="mb-2 block text-xs text-slate-500">
                {t.latestYearFilter}
              </span>
              <select
                value={minimumLatestYear}
                onChange={(event) => setMinimumLatestYear(event.target.value)}
                className="w-full bg-[#0b0f1c] text-white outline-none"
              >
                <option value="all">{t.allYears}</option>
                <option value="2024">2024+</option>
                <option value="2023">2023+</option>
                <option value="2022">2022+</option>
                <option value="2021">2021+</option>
                <option value="2020">2020+</option>
              </select>
            </label>
          </div>
        </div>

        <p className="mb-4 text-sm text-slate-400">
          {t.showing}:{" "}
          {filteredAndSortedRows.length.toLocaleString(
            languageToLocale(language)
          )}{" "}
          / {rows.length.toLocaleString(languageToLocale(language))}
        </p>

        {errorMessage ? (
          <div className="mb-6 rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-red-100">
            {errorMessage}
          </div>
        ) : null}

        <div className="overflow-x-auto rounded-3xl border border-white/10">
          <table className="w-full min-w-[1500px] border-collapse text-left text-sm">
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
                    description={indicatorDescriptions[language].income}
                    sortKey="incomeLevel"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-5 py-4">
                  <SortHeader
                    label={t.energy}
                    description={indicatorDescriptions[language].energy}
                    sortKey="energyImportPercent"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-5 py-4">
                  <SortHeader
                    label={t.fuel}
                    description={indicatorDescriptions[language].fuel}
                    sortKey="fuelImportShare"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-5 py-4">
                  <SortHeader
                    label={t.food}
                    description={indicatorDescriptions[language].food}
                    sortKey="foodImportShare"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-5 py-4">
                  <SortHeader
                    label={t.importsGdp}
                    description={indicatorDescriptions[language].importsGdp}
                    sortKey="importsGdp"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-5 py-4">
                  <SortHeader
                    label={t.importsUsd}
                    description={indicatorDescriptions[language].importsUsd}
                    sortKey="importUsd"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-5 py-4">
                  <SortHeader
                    label={t.tariff}
                    description={indicatorDescriptions[language].tariff}
                    sortKey="tariffRate"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-5 py-4">
                  <SortHeader
                    label={t.logistics}
                    description={indicatorDescriptions[language].logistics}
                    sortKey="logisticsIndex"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-5 py-4">
                  <SortHeader
                    label={t.coverage}
                    description={indicatorDescriptions[language].coverage}
                    sortKey="dataCompleteness"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span>{t.latestYearFilter}</span>
                    <InfoTooltip text={indicatorDescriptions[language].latestYear} />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredAndSortedRows.map((row) => {
                const isVisitorCountry = row.iso2 === visitorCountry;
                const income = getIncomeGroupLabel(row.incomeLevel, language);

                return (
                  <tr
                    key={row.iso3}
                    className={`border-t border-white/10 ${
                      isVisitorCountry ? "bg-indigo-400/10" : ""
                    }`}
                  >
                    <td className="px-5 py-4">
                      <a
                        href={`/country/${row.iso3}`}
                        className="font-semibold text-white hover:text-indigo-200 hover:underline"
                      >
                        {getFlagEmoji(row.iso2)} {getLocalizedCountryName(row, language)}
                      </a>
                      <p className="text-xs text-slate-500">
                        {row.name} · {row.iso3}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-slate-300">{row.region}</td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-100">
                        {income.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {income.description}
                      </p>
                      <p className="mt-1 text-xs text-slate-600">
                        {t.incomeOriginal}: {row.incomeLevel}
                      </p>
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

                    <td className="px-5 py-4">
                      {getLatestAvailableYear(row) ?? "—"}
                    </td>
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
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-xl font-bold">{t.contactTitle}</h2>
            <p className="mt-2 text-sm text-slate-400">{t.contactText}</p>

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

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
            <p className="text-xs text-slate-500">{t.emailLabel}</p>
            <a
              href="mailto:kevinsmp123@gmail.com"
              className="text-lg font-semibold text-indigo-200 hover:text-white"
            >
              kevinsmp123@gmail.com
            </a>
          </div>
        </div>
      </footer>
      <OfficialSourceOverview language={language} />

      <HomeBottomLinks language={language} />
</main>
  );
}