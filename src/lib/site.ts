const productionUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://dependency-radar-three.vercel.app"
).replace(/\/$/, "");

export const siteConfig = {
  name: "Trade Dependency Atlas",
  url: productionUrl,
  description:
    "A global statistics platform for country dependency, supply exposure, imports, tariffs, and logistics indicators using public World Bank data.",
  keywords: [
    "country statistics",
    "supply chain risk",
    "trade dependency",
    "World Bank data",
    "imports",
    "tariffs",
    "logistics index",
    "energy dependency",
    "food imports",
    "global statistics",
  ],
};
