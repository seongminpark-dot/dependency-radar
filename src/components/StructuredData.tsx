import {
  SITE_ALTERNATE_NAMES,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/brand";

export default function StructuredData() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: SITE_ALTERNATE_NAMES,
    url: SITE_URL,
    email: "kevinsmp123@gmail.com",
  };

  const website = {
    "@context": "https://schema.org",
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
  };

  const dataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${SITE_URL}/#dataset`,
    name: `${SITE_NAME} Official Country Trade & Energy Dataset`,
    description:
      "Integrated country-level data for comparing merchandise trade, energy, tariff, logistics, and supply dependency indicators. Datlora combines official public data sources including World Bank World Development Indicators, UN Comtrade, WITS, and the U.S. Energy Information Administration.",
    url: SITE_URL,
    sameAs: [SITE_URL, `${SITE_URL}/sources`, `${SITE_URL}/methodology`],
    license: `${SITE_URL}/terms`,
    isAccessibleForFree: true,
    inLanguage: ["ko", "en", "ja", "zh", "es", "fr", "de"],
    creator: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      email: "kevinsmp123@gmail.com",
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      email: "kevinsmp123@gmail.com",
    },
    includedInDataCatalog: {
      "@type": "DataCatalog",
      name: SITE_NAME,
      url: SITE_URL,
    },
    keywords: [
      "country statistics",
      "trade statistics",
      "energy data",
      "tariff data",
      "supply dependency",
      "무역통계",
      "국가별 무역통계",
      "국가별 에너지 통계",
      "World Bank",
      "UN Comtrade",
      "WITS",
      "EIA"
    ],
    citation: [
      "World Bank World Development Indicators: https://databank.worldbank.org/source/world-development-indicators",
      "UN Comtrade Database: https://comtradeplus.un.org/",
      "WITS Trade Stats Tariff Data: https://wits.worldbank.org/",
      "U.S. Energy Information Administration Open Data: https://www.eia.gov/opendata/"
    ],
    temporalCoverage: "1960/2026",
    spatialCoverage: {
      "@type": "Place",
      name: "Worldwide",
    },
    distribution: [
      {
        "@type": "DataDownload",
        name: `${SITE_NAME} web dashboard`,
        description:
          "Interactive web dashboard for country-level trade, tariff, logistics, energy, and dependency indicators.",
        encodingFormat: "text/html",
        contentUrl: SITE_URL,
      },
      {
        "@type": "DataDownload",
        name: `${SITE_NAME} sitemap`,
        description: `Sitemap listing public pages available in ${SITE_NAME}.`,
        encodingFormat: "application/xml",
        contentUrl: `${SITE_URL}/sitemap.xml`,
      }
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
