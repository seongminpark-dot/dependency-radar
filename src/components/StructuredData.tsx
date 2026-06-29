export default function StructuredData() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://dependency-radar-three.vercel.app";

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Dependency Radar",
    url: siteUrl,
    description:
      "A global statistics platform integrating official country dependency, trade, tariff, and energy data from World Bank, UN Comtrade, WITS, and EIA.",
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
      "Integrated country-level statistics covering supply dependency, merchandise trade, tariffs, logistics, and energy indicators from official public data sources.",
    url: siteUrl,
    creator: {
      "@type": "Organization",
      name: "Dependency Radar",
    },
    includedInDataCatalog: {
      "@type": "DataCatalog",
      name: "Dependency Radar",
    },
    keywords: [
      "country statistics",
      "supply dependency",
      "trade data",
      "tariff data",
      "energy data",
      "World Bank",
      "UN Comtrade",
      "WITS",
      "EIA",
    ],
    isBasedOn: [
      {
        "@type": "Dataset",
        name: "World Bank World Development Indicators",
        url: "https://databank.worldbank.org/source/world-development-indicators",
      },
      {
        "@type": "Dataset",
        name: "UN Comtrade Database",
        url: "https://comtradeplus.un.org/",
      },
      {
        "@type": "Dataset",
        name: "WITS Trade Stats Tariff Data",
        url: "https://wits.worldbank.org/",
      },
      {
        "@type": "Dataset",
        name: "U.S. Energy Information Administration Open Data",
        url: "https://www.eia.gov/opendata/",
      },
    ],
  };

  return (
    <>
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
