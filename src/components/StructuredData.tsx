export default function StructuredData() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://dependency-radar-three.vercel.app";

  const siteName = "Trade Dependency Atlas";

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: siteName,
    alternateName: [
      "Global Trade Dependency Atlas",
      "국가별 무역·에너지 의존도 통계",
      "국가별 무역통계",
      "무역통계 사이트",
      "Trade Dependency Atlas",
      "dependency-radar-three.vercel.app",
    ],
    url: siteUrl,
    email: "kevinsmp123@gmail.com",
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: siteName,
    alternateName: [
      "Global Trade Dependency Atlas",
      "국가별 무역·에너지 의존도 통계",
      "국가별 무역통계",
      "무역통계 사이트",
      "Trade Dependency Atlas",
      "dependency-radar-three.vercel.app",
    ],
    url: siteUrl,
    description:
      "Trade Dependency Atlas is a country statistics website for checking official trade, tariff, energy, logistics, and supply dependency indicators by country.",
    inLanguage: ["ko", "en", "ja", "zh", "es", "fr", "de"],
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
  };

  const dataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${siteUrl}/#dataset`,
    name: "Trade Dependency Atlas Official Trade Dependency Statistics Dataset",
    description:
      "Trade Dependency Atlas Official Trade Dependency Statistics Dataset is an integrated country-level statistics dataset for comparing supply dependency, merchandise trade, tariff, logistics, and energy indicators. It combines official public data sources including World Bank World Development Indicators, UN Comtrade, WITS, and the U.S. Energy Information Administration. The dataset is intended for educational, research, and public information purposes.",
    url: siteUrl,
    sameAs: [siteUrl, `${siteUrl}/sources`, `${siteUrl}/methodology`],
    license: `${siteUrl}/terms`,
    isAccessibleForFree: true,
    inLanguage: ["ko", "en", "ja", "zh", "es", "fr", "de"],
    creator: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
      email: "kevinsmp123@gmail.com",
    },
    publisher: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
      email: "kevinsmp123@gmail.com",
    },
    includedInDataCatalog: {
      "@type": "DataCatalog",
      name: siteName,
      url: siteUrl,
    },
    keywords: [
      "country statistics",
      "trade statistics",
      "무역통계",
      "국가별 무역통계",
      "supply dependency",
      "trade data",
      "tariff data",
      "energy data",
      "logistics indicators",
      "World Bank",
      "UN Comtrade",
      "WITS",
      "EIA",
    ],
    citation: [
      "World Bank World Development Indicators: https://databank.worldbank.org/source/world-development-indicators",
      "UN Comtrade Database: https://comtradeplus.un.org/",
      "WITS Trade Stats Tariff Data: https://wits.worldbank.org/",
      "U.S. Energy Information Administration Open Data: https://www.eia.gov/opendata/",
    ],
    temporalCoverage: "1960/2026",
    spatialCoverage: {
      "@type": "Place",
      name: "Worldwide",
    },
    distribution: [
      {
        "@type": "DataDownload",
        name: "Trade Dependency Atlas web dashboard",
        description:
          "Interactive web dashboard for country-level supply dependency, trade, tariff, logistics, and energy indicators.",
        encodingFormat: "text/html",
        contentUrl: siteUrl,
      },
      {
        "@type": "DataDownload",
        name: "Trade Dependency Atlas sitemap",
        description:
          "Sitemap listing public pages available in the Trade Dependency Atlas website.",
        encodingFormat: "application/xml",
        contentUrl: `${siteUrl}/sitemap.xml`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dataset) }}
      />
    </>
  );
}
