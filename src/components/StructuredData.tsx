export default function StructuredData() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://dependency-radar-three.vercel.app";

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Dependency Radar",
    url: siteUrl,
    email: "kevinsmp123@gmail.com",
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "Dependency Radar",
    url: siteUrl,
    description:
      "Dependency Radar is a global statistics platform integrating official country-level supply dependency, trade, tariff, logistics, and energy indicators.",
    inLanguage: ["ko", "en", "ja", "zh", "es", "fr", "de"],
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
  };

  const dataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${siteUrl}/#dataset`,
    name: "Dependency Radar Official Country Statistics Dataset",
    description:
      "Dependency Radar Official Country Statistics Dataset is an integrated country-level statistics dataset for comparing supply dependency, merchandise trade, tariff, logistics, and energy indicators. It combines official public data sources including World Bank World Development Indicators, UN Comtrade, WITS, and the U.S. Energy Information Administration. The dataset is intended for educational, research, and comparative analysis purposes.",
    url: siteUrl,
    sameAs: [
      siteUrl,
      `${siteUrl}/sources`,
      `${siteUrl}/methodology`,
    ],
    license: `${siteUrl}/terms`,
    isAccessibleForFree: true,
    inLanguage: ["ko", "en", "ja", "zh", "es", "fr", "de"],
    creator: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Dependency Radar",
      url: siteUrl,
      email: "kevinsmp123@gmail.com",
    },
    publisher: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Dependency Radar",
      url: siteUrl,
      email: "kevinsmp123@gmail.com",
    },
    includedInDataCatalog: {
      "@type": "DataCatalog",
      name: "Dependency Radar",
      url: siteUrl,
    },
    keywords: [
      "country statistics",
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
        name: "Dependency Radar web dashboard",
        description:
          "Interactive web dashboard for country-level supply dependency, trade, tariff, logistics, and energy indicators.",
        encodingFormat: "text/html",
        contentUrl: siteUrl,
      },
      {
        "@type": "DataDownload",
        name: "Dependency Radar sitemap",
        description:
          "Sitemap listing public pages available in the Dependency Radar website.",
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
