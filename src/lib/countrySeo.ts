import type { Metadata } from "next";
import type { CountryRow, StatValue } from "@/lib/worldBank";
import { siteConfig } from "@/lib/site";

function formatPercent(stat: StatValue) {
  if (stat.value === null) {
    return null;
  }

  return `${Number(stat.value).toLocaleString("en-US", {
    maximumFractionDigits: 1,
  })}%${stat.year ? ` (${stat.year})` : ""}`;
}

function formatUsd(stat: StatValue) {
  if (stat.value === null) {
    return null;
  }

  const value = Number(stat.value);

  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toLocaleString("en-US", {
      maximumFractionDigits: 2,
    })}T${stat.year ? ` (${stat.year})` : ""}`;
  }

  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toLocaleString("en-US", {
      maximumFractionDigits: 2,
    })}B${stat.year ? ` (${stat.year})` : ""}`;
  }

  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toLocaleString("en-US", {
      maximumFractionDigits: 2,
    })}M${stat.year ? ` (${stat.year})` : ""}`;
  }

  return `$${value.toLocaleString("en-US")}${stat.year ? ` (${stat.year})` : ""}`;
}

function compactList(items: Array<string | null>) {
  return items.filter(Boolean).slice(0, 4).join(", ");
}

export function buildCountryMetadata(row: CountryRow): Metadata {
  const title = `${row.name} (${row.iso3}) Official Country Data | Datlora`;

  const highlights = compactList([
    row.importsGdp.value !== null
      ? `imports/GDP ${formatPercent(row.importsGdp)}`
      : null,
    row.tariffRate.value !== null
      ? `tariff rate ${formatPercent(row.tariffRate)}`
      : null,
    row.foodImportShare.value !== null
      ? `food import share ${formatPercent(row.foodImportShare)}`
      : null,
    row.fuelImportShare.value !== null
      ? `fuel import share ${formatPercent(row.fuelImportShare)}`
      : null,
  ]);

  const description = highlights
    ? `${row.name} (${row.iso3}) official country indicators including ${highlights}. Explore trade, energy, food, tariff, logistics, imports, related issue briefs, and country news links.`
    : `${row.name} (${row.iso3}) official country indicators for trade, energy, food, tariffs, logistics, imports, related issue briefs, and country news links.`;

  const canonicalPath = `/country/${row.iso3}`;
  const canonicalUrl = `${siteConfig.url}${canonicalPath}`;

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    keywords: [
      row.name,
      row.iso3,
      row.iso2,
      `${row.name} country data`,
      `${row.name} trade statistics`,
      `${row.name} tariff rate`,
      `${row.name} imports`,
      `${row.name} energy data`,
      `${row.name} food imports`,
      "official country indicators",
      "World Bank data",
      "Datlora",
    ],
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Datlora",
      type: "website",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${row.name} official country data on Datlora`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function buildCountryStructuredData(row: CountryRow) {
  const countryUrl = `${siteConfig.url}/country/${row.iso3}`;
  const newsUrl = `${siteConfig.url}/news/country/${row.iso3}`;
  const compareUrl = `${siteConfig.url}/compare?a=${row.iso3}&b=USA`;

  const variableMeasured = [
    {
      "@type": "PropertyValue",
      name: "Imports of goods and services as percentage of GDP",
      value: row.importsGdp.value,
      unitText: "percent",
      measurementTechnique: "World Bank public indicator",
      observationDate: row.importsGdp.year,
    },
    {
      "@type": "PropertyValue",
      name: "Merchandise tariff rate",
      value: row.tariffRate.value,
      unitText: "percent",
      measurementTechnique: "World Bank public indicator",
      observationDate: row.tariffRate.year,
    },
    {
      "@type": "PropertyValue",
      name: "Food import share",
      value: row.foodImportShare.value,
      unitText: "percent",
      measurementTechnique: "World Bank public indicator",
      observationDate: row.foodImportShare.year,
    },
    {
      "@type": "PropertyValue",
      name: "Fuel import share",
      value: row.fuelImportShare.value,
      unitText: "percent",
      measurementTechnique: "World Bank public indicator",
      observationDate: row.fuelImportShare.year,
    },
    {
      "@type": "PropertyValue",
      name: "Energy net imports",
      value: row.energyImportPercent.value,
      unitText: "percent",
      measurementTechnique: "World Bank public indicator",
      observationDate: row.energyImportPercent.year,
    },
    {
      "@type": "PropertyValue",
      name: "Total imports",
      value: row.importUsd.value,
      unitText: "current US dollars",
      measurementTechnique: "World Bank public indicator",
      observationDate: row.importUsd.year,
    },
    {
      "@type": "PropertyValue",
      name: "Logistics performance index",
      value: row.logisticsIndex.value,
      measurementTechnique: "World Bank public indicator",
      observationDate: row.logisticsIndex.year,
    },
  ].filter((item) => item.value !== null);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${countryUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Datlora",
            item: siteConfig.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Countries",
            item: `${siteConfig.url}/countries`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: row.name,
            item: countryUrl,
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${countryUrl}#webpage`,
        url: countryUrl,
        name: `${row.name} (${row.iso3}) Official Country Data`,
        description:
          `Official country indicators for ${row.name}, including trade, energy, food, tariffs, logistics, imports, related issue briefs, and country news links.`,
        isPartOf: {
          "@id": `${siteConfig.url}/#website`,
        },
        breadcrumb: {
          "@id": `${countryUrl}#breadcrumb`,
        },
        inLanguage: ["ko", "en"],
        about: {
          "@type": "Country",
          name: row.name,
          identifier: row.iso3,
        },
        relatedLink: [newsUrl, compareUrl, `${siteConfig.url}/sources`, `${siteConfig.url}/methodology`],
      },
      {
        "@type": "Dataset",
        "@id": `${countryUrl}#dataset`,
        name: `${row.name} (${row.iso3}) Official Country Indicators`,
        description:
          `Country-level official public indicators for ${row.name}, including imports, tariffs, food import share, fuel import share, energy imports, logistics, and related structural data.`,
        url: countryUrl,
        isAccessibleForFree: true,
        inLanguage: ["ko", "en"],
        spatialCoverage: {
          "@type": "Place",
          name: row.name,
          identifier: row.iso3,
        },
        includedInDataCatalog: {
          "@id": `${siteConfig.url}/#catalog`,
        },
        creator: {
          "@id": `${siteConfig.url}/#organization`,
        },
        publisher: {
          "@id": `${siteConfig.url}/#organization`,
        },
        variableMeasured,
        citation: [
          "World Bank World Development Indicators",
          "UN Comtrade Database where available",
          "WITS trade and tariff reference where available",
          "EIA energy reference where available",
        ],
      },
    ],
  };
}
