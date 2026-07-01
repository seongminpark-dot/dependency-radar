export type Topic = {
  slug: string;
  label: string;
  titleKo: string;
  titleEn: string;
  descriptionKo: string;
  descriptionEn: string;
  sourceKo: string;
  sourceEn: string;
  questionsKo: string[];
  indicatorsKo: string[];
  indicatorCode: string;
  statKey: string;
  indicatorNameKo: string;
  rankingTitleKo: string;
  rankingUnit: "%" | "index" | "usd";
};

export const topics: Topic[] = [
  {
    slug: "fuel-import-dependency",
    label: "Fuel import dependency",
    titleKo: "연료 수입 의존도 국가별 비교",
    titleEn: "Fuel Import Dependency by Country",
    descriptionKo:
      "국가별 연료 수입 비중과 에너지 수입 노출도를 확인하는 주제 페이지입니다. 연료 수입 비중은 에너지 가격 변동, 공급망 충격, 지정학적 리스크를 이해하는 데 참고할 수 있습니다.",
    descriptionEn:
      "Compare fuel import dependency and energy-related trade exposure by country.",
    sourceKo: "주요 참고 출처: World Bank WDI, UN Comtrade HS 27, EIA Open Data",
    sourceEn: "Main sources: World Bank WDI, UN Comtrade HS 27, EIA Open Data",
    questionsKo: [
      "어떤 국가가 연료 수입에 많이 의존하는가?",
      "연료 수입 비중은 최신 공식 연도 기준으로 어떻게 표시되는가?",
      "World Bank 구조 지표와 UN Comtrade 무역 데이터는 어떻게 다르게 해석해야 하는가?",
    ],
    indicatorsKo: ["연료 수입 비중", "연료 수입액", "에너지 순수입", "EIA 에너지 지표"],
    indicatorCode: "TM.VAL.FUEL.ZS.UN",
    statKey: "fuelImportShare",
    indicatorNameKo: "연료 수입 비중",
    rankingTitleKo: "연료 수입 비중 상위 국가",
    rankingUnit: "%",
  },
  {
    slug: "food-import-dependency",
    label: "Food import dependency",
    titleKo: "식량 수입 의존도 국가별 비교",
    titleEn: "Food Import Dependency by Country",
    descriptionKo:
      "국가별 식량·농산물 수입 노출도를 확인하는 주제 페이지입니다. 식량 수입 비중은 물가, 공급망 안정성, 식량 안보를 해석하는 데 참고할 수 있습니다.",
    descriptionEn:
      "Compare food and agricultural import dependency by country.",
    sourceKo: "주요 참고 출처: World Bank WDI, UN Comtrade HS 01–24",
    sourceEn: "Main sources: World Bank WDI, UN Comtrade HS 01–24",
    questionsKo: [
      "어떤 국가가 식량 수입에 더 크게 노출되어 있는가?",
      "식량 수입 비중은 총 수입 대비 어떻게 계산되는가?",
      "최신 공식 데이터가 없는 국가는 어떻게 표시되는가?",
    ],
    indicatorsKo: ["식량/농산물 수입액", "총 수입 대비 비중", "전년 대비 변화"],
    indicatorCode: "TM.VAL.FOOD.ZS.UN",
    statKey: "foodImportShare",
    indicatorNameKo: "식량 수입 비중",
    rankingTitleKo: "식량 수입 비중 상위 국가",
    rankingUnit: "%",
  },
  {
    slug: "imports-gdp",
    label: "Imports to GDP",
    titleKo: "수입/GDP 비중 국가별 비교",
    titleEn: "Imports-to-GDP Ratio by Country",
    descriptionKo:
      "국가별 경제 규모 대비 수입 의존도를 비교하는 주제 페이지입니다. 수입/GDP 비중은 한 국가 경제가 해외 공급에 얼마나 연결되어 있는지 이해하는 데 도움이 됩니다.",
    descriptionEn:
      "Compare import exposure relative to GDP by country.",
    sourceKo: "주요 참고 출처: World Bank WDI",
    sourceEn: "Main source: World Bank WDI",
    questionsKo: [
      "수입/GDP 비중이 높은 국가는 어디인가?",
      "수입/GDP가 높다는 것은 무엇을 의미하는가?",
      "이 지표는 무역수지와 어떻게 다르게 해석해야 하는가?",
    ],
    indicatorsKo: ["수입/GDP", "총 수입액", "최신 제공 연도"],
    indicatorCode: "NE.IMP.GNFS.ZS",
    statKey: "importsGdp",
    indicatorNameKo: "수입/GDP",
    rankingTitleKo: "수입/GDP 비중 상위 국가",
    rankingUnit: "%",
  },
  {
    slug: "tariff-rate",
    label: "Tariff rate",
    titleKo: "국가별 관세율 비교",
    titleEn: "Tariff Rate by Country",
    descriptionKo:
      "국가별 관세율과 무역 장벽을 비교하는 주제 페이지입니다. 관세 데이터는 WITS, WTO, UNCTAD TRAINS, World Bank fallback 기반으로 표시되며 국가별 최신 연도가 다를 수 있습니다.",
    descriptionEn:
      "Compare tariff rates and trade barrier conditions by country.",
    sourceKo: "주요 참고 출처: WITS, WTO, UNCTAD TRAINS, World Bank WDI",
    sourceEn: "Main sources: WITS, WTO, UNCTAD TRAINS, World Bank WDI",
    questionsKo: [
      "관세율이 높은 국가는 어디인가?",
      "왜 관세 데이터는 2024나 2025가 아닐 수 있는가?",
      "가중평균 관세와 단순평균 관세는 어떻게 다른가?",
    ],
    indicatorsKo: ["가중평균 관세율", "단순평균 관세율", "MFN 관세율"],
    indicatorCode: "TM.TAX.MRCH.WM.AR.ZS",
    statKey: "tariffRate",
    indicatorNameKo: "가중평균 관세율",
    rankingTitleKo: "가중평균 관세율 상위 국가",
    rankingUnit: "%",
  },
  {
    slug: "energy-statistics",
    label: "Energy statistics",
    titleKo: "국가별 에너지 통계",
    titleEn: "Energy Statistics by Country",
    descriptionKo:
      "국가별 에너지 지표를 확인하는 주제 페이지입니다. EIA Open Data와 World Bank 구조 지표를 함께 참고해 에너지 노출도와 공급 구조를 해석합니다.",
    descriptionEn:
      "Check country-level energy indicators using EIA and World Bank data.",
    sourceKo: "주요 참고 출처: EIA Open Data, World Bank WDI",
    sourceEn: "Main sources: EIA Open Data, World Bank WDI",
    questionsKo: [
      "국가별 에너지 데이터는 어떤 출처를 기준으로 하는가?",
      "왜 국가마다 최신 에너지 연도가 다르게 표시되는가?",
      "에너지 지표와 무역 지표는 어떻게 함께 해석해야 하는가?",
    ],
    indicatorsKo: ["석유 및 기타 액체", "총에너지", "천연가스", "에너지 순수입"],
    indicatorCode: "EG.IMP.CONS.ZS",
    statKey: "energyImportPercent",
    indicatorNameKo: "에너지 순수입",
    rankingTitleKo: "에너지 수입 노출도 상위 국가",
    rankingUnit: "%",
  },
];

export function getTopic(slug: string) {
  return topics.find((topic) => topic.slug === slug);
}
