const productionUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://www.datlora.com"
).replace(/\/$/, "");

export const siteConfig = {
  name: "Datlora",
  url: productionUrl,
  description:
    "Datlora connects live global news, issue briefs, and official country indicators for trade, energy, food, tariffs, logistics, imports, and supply-chain exposure.",
  keywords: [
    "country statistics",
    "global news and data",
    "issue briefs",
    "trade statistics",
    "supply chain exposure",
    "trade dependency",
    "World Bank data",
    "UN Comtrade",
    "imports",
    "tariffs",
    "logistics index",
    "energy dependency",
    "food imports",
    "global statistics",
    "국가별 통계",
    "무역 통계",
    "공급망 지표",
    "관세율",
    "에너지 통계",
  ],
};
