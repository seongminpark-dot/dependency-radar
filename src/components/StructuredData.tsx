import {
  SITE_ALTERNATE_NAMES,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/brand";

export default function StructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        alternateName: SITE_ALTERNATE_NAMES,
        url: SITE_URL,
        email: "kevinsmp123@gmail.com",
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        alternateName: SITE_ALTERNATE_NAMES,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        inLanguage: ["ko", "en", "ja", "zh", "es", "fr", "de"],
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
      },
      {
        "@type": "DataCatalog",
        "@id": `${SITE_URL}/#catalog`,
        name: `${SITE_NAME} Country Data Catalog`,
        url: SITE_URL,
        description:
          "A public catalog of country-level trade, energy, food, tariff, logistics, import, and supply-chain exposure indicators connected to global issue briefs and external news links.",
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
        dataset: {
          "@id": `${SITE_URL}/#dataset`,
        },
      },
      {
        "@type": "Dataset",
        "@id": `${SITE_URL}/#dataset`,
        name: `${SITE_NAME} Official Country Indicators`,
        description:
          "Country-level indicators for comparing trade, energy, food import share, fuel import share, tariff rate, logistics performance, imports/GDP, and related structural data. Datlora separates official public statistics from external news context.",
        url: SITE_URL,
        sameAs: [
          SITE_URL,
          `${SITE_URL}/sources`,
          `${SITE_URL}/methodology`,
          `${SITE_URL}/issues`,
          `${SITE_URL}/news`,
        ],
        license: `${SITE_URL}/terms`,
        isAccessibleForFree: true,
        inLanguage: ["ko", "en", "ja", "zh", "es", "fr", "de"],
        creator: {
          "@id": `${SITE_URL}/#organization`,
        },
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
        includedInDataCatalog: {
          "@id": `${SITE_URL}/#catalog`,
        },
        keywords: [
          "country statistics",
          "trade statistics",
          "energy data",
          "tariff data",
          "supply-chain exposure",
          "imports",
          "food imports",
          "fuel imports",
          "logistics index",
          "World Bank",
          "UN Comtrade",
          "WITS",
          "EIA",
          "무역통계",
          "국가별 무역통계",
          "국가별 에너지 통계",
          "국가별 관세율 비교",
        ],
        citation: [
          "World Bank World Development Indicators",
          "UN Comtrade Database",
          "WITS Trade Stats Tariff Data",
          "U.S. Energy Information Administration Open Data",
          "GDELT Project for external news discovery",
        ],
        spatialCoverage: {
          "@type": "Place",
          name: "Worldwide",
        },
        distribution: [
          {
            "@type": "DataDownload",
            name: `${SITE_NAME} web dashboard`,
            description:
              "Interactive web dashboard for country-level trade, energy, tariff, logistics, import, and supply-chain exposure indicators.",
            encodingFormat: "text/html",
            contentUrl: SITE_URL,
          },
          {
            "@type": "DataDownload",
            name: `${SITE_NAME} sitemap`,
            description: `Sitemap listing public pages available in ${SITE_NAME}.`,
            encodingFormat: "application/xml",
            contentUrl: `${SITE_URL}/sitemap.xml`,
          },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/#main-pages`,
        name: `${SITE_NAME} main pages`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Latest Global News",
            url: `${SITE_URL}/news`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Global Issue Briefs",
            url: `${SITE_URL}/issues`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Topics",
            url: `${SITE_URL}/topics`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: "Compare Countries",
            url: `${SITE_URL}/compare`,
          },
          {
            "@type": "ListItem",
            position: 5,
            name: "Data Sources",
            url: `${SITE_URL}/sources`,
          },
          {
            "@type": "ListItem",
            position: 6,
            name: "Methodology",
            url: `${SITE_URL}/methodology`,
          },
        ],
      },
      {
        "@type": "SiteNavigationElement",
        "@id": `${SITE_URL}/#site-navigation`,
        name: [
          "Home",
          "News",
          "Issues",
          "Topics",
          "Compare",
          "Sources",
          "Methodology",
        ],
        url: [
          SITE_URL,
          `${SITE_URL}/news`,
          `${SITE_URL}/issues`,
          `${SITE_URL}/topics`,
          `${SITE_URL}/compare`,
          `${SITE_URL}/sources`,
          `${SITE_URL}/methodology`,
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
