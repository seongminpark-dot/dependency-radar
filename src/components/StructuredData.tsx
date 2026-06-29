export default function StructuredData() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://dependency-radar-three.vercel.app";

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Dependency Radar",
    url: siteUrl,
    email: "kevinsmp123@gmail.com",
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Dependency Radar",
    url: siteUrl,
    description:
      "Dependency Radar is a global statistics platform integrating official country-level supply dependency, trade, tariff, logistics, and energy indicators.",
    inLanguage: ["ko", "en", "ja", "zh", "es", "fr", "de"],
    publisher: {
      "@type": "Organization",
      name: "Dependency Radar",
      email: "kevinsmp123@gmail.com",
    },
  };

  const dataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Dependency Radar Official Country Statistics Dataset",
    description:
      "An integrated country-level statistics dataset covering supply dependency, merchandise trade, tariffs, logistics, and energy indicators. The dataset combines official public indicators from World Bank, UN Comtrade, WITS, and the U.S. Energy Information Administration for comparison and educational research purposes.",
    url: siteUrl,
    sameAs: siteUrl,
    license: `${siteUrl}/terms`,
    isAccessibleForFree: true,
    inLanguage: ["ko", "en", "ja", "zh", "es", "fr", "de"],
    creator: {
      "@type": "Organization",
      name: "Dependency Radar",
      url: siteUrl,
      email: "kevinsmp123@gmail.com",
    },
    publisher: {
      "@type": "Organization",
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
      "https://databank.worldbank.org/source/world-development-indicators",
      "https://comtradeplus.un.org/",
      "https://wits.worldbank.org/",
      "https://www.eia.gov/opendata/",
    ],
    isBasedOn: [
      "https://databank.worldbank.org/source/world-development-indicators",
      "https://comtradeplus.un.org/",
      "https://wits.worldbank.org/",
      "https://www.eia.gov/opendata/",
    ],
    temporalCoverage: "1960/2026",
    spatialCoverage: {
      "@type": "Place",
      name: "Worldwide",
    },
    distribution: [
      {
        "@type": "DataDownload",
        name: "Dependency Radar country statistics web dashboard",
        encodingFormat: "text/html",
        contentUrl: siteUrl,
      },
      {
        "@type": "DataDownload",
        name: "Dependency Radar sitemap",
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
