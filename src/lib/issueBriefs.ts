export type IssueBrief = {
  slug: string;
  title: string;
  shortTitle: string;
  deck: string;
  description: string;
  theme: string;
  metrics: string[];
  relatedTopics: {
    label: string;
    href: string;
  }[];
  countryLinks: {
    label: string;
    href: string;
  }[];
};

export const issueBriefs: IssueBrief[] = [
  {
    slug: "oil-shock",
    title: "Oil Shock Exposure",
    shortTitle: "Oil Shock",
    deck: "연료 수입과 에너지 순수입 지표로 유가 충격 노출도를 확인합니다.",
    description:
      "국제 유가 상승은 연료 수입 비중이 높거나 에너지 순수입 의존도가 큰 국가에 더 직접적인 비용 압박을 만들 수 있습니다. Datlora는 공식 공개 지표를 바탕으로 국가별 구조적 노출도를 비교합니다.",
    theme: "from-cyan-400/25 to-blue-500/10",
    metrics: [
      "Fuel imports as % of merchandise imports",
      "Energy imports, net % of energy use",
      "Imports of goods and services % of GDP",
      "Logistics Performance Index",
    ],
    relatedTopics: [
      { label: "Fuel Import Dependency", href: "/topics/fuel-import-dependency" },
      { label: "Energy Statistics", href: "/topics/energy-statistics" },
      { label: "Imports / GDP", href: "/topics/imports-gdp" },
    ],
    countryLinks: [
      { label: "Korea", href: "/country/KOR" },
      { label: "Japan", href: "/country/JPN" },
      { label: "United States", href: "/country/USA" },
    ],
  },
  {
    slug: "food-import-risk",
    title: "Food Import Risk",
    shortTitle: "Food Risk",
    deck: "식량 수입 비중과 수입/GDP 지표로 식량 가격 충격을 해석합니다.",
    description:
      "식량 가격 상승이나 공급 차질은 식량 수입 비중이 높은 국가에 부담을 줄 수 있습니다. 이 페이지는 식량 수입 의존도와 전체 수입 구조를 함께 확인하는 이슈 브리프입니다.",
    theme: "from-emerald-400/25 to-lime-500/10",
    metrics: [
      "Food imports as % of merchandise imports",
      "Imports of goods and services % of GDP",
      "Logistics Performance Index",
      "Latest official data year",
    ],
    relatedTopics: [
      { label: "Food Import Dependency", href: "/topics/food-import-dependency" },
      { label: "Imports / GDP", href: "/topics/imports-gdp" },
    ],
    countryLinks: [
      { label: "Korea", href: "/country/KOR" },
      { label: "Japan", href: "/country/JPN" },
      { label: "United States", href: "/country/USA" },
    ],
  },
  {
    slug: "tariff-pressure",
    title: "Tariff Pressure",
    shortTitle: "Tariff Pressure",
    deck: "관세율과 수입 구조를 함께 보며 무역 비용 압박을 확인합니다.",
    description:
      "관세 변화는 수입 비용, 기업 마진, 소비자 가격에 영향을 줄 수 있습니다. Datlora는 국가별 관세율과 수입 의존도를 함께 보여주어 무역 비용 압박을 비교할 수 있게 합니다.",
    theme: "from-amber-400/25 to-orange-500/10",
    metrics: [
      "Tariff rate, weighted mean",
      "Imports of goods and services % of GDP",
      "Total imports",
      "Logistics Performance Index",
    ],
    relatedTopics: [
      { label: "Tariff Rate", href: "/topics/tariff-rate" },
      { label: "Imports / GDP", href: "/topics/imports-gdp" },
    ],
    countryLinks: [
      { label: "Korea", href: "/country/KOR" },
      { label: "Japan", href: "/country/JPN" },
      { label: "United States", href: "/country/USA" },
    ],
  },
  {
    slug: "supply-chain",
    title: "Supply Chain Exposure",
    shortTitle: "Supply Chain",
    deck: "수입/GDP, 물류지수, 연료·식량 수입 구조를 함께 봅니다.",
    description:
      "공급망 차질은 단일 지표로 판단하기 어렵습니다. Datlora는 수입/GDP, 물류지수, 연료·식량 수입 비중을 함께 보여주어 국가별 공급망 노출도를 이해할 수 있게 합니다.",
    theme: "from-violet-400/25 to-indigo-500/10",
    metrics: [
      "Imports of goods and services % of GDP",
      "Logistics Performance Index",
      "Fuel imports share",
      "Food imports share",
    ],
    relatedTopics: [
      { label: "Imports / GDP", href: "/topics/imports-gdp" },
      { label: "Fuel Import Dependency", href: "/topics/fuel-import-dependency" },
      { label: "Food Import Dependency", href: "/topics/food-import-dependency" },
    ],
    countryLinks: [
      { label: "Korea", href: "/country/KOR" },
      { label: "Japan", href: "/country/JPN" },
      { label: "United States", href: "/country/USA" },
    ],
  },
];

export function getIssueBrief(slug: string) {
  return issueBriefs.find((issue) => issue.slug === slug) ?? issueBriefs[0];
}
