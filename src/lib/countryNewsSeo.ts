import type { Metadata } from "next";
import type { CountryRow } from "@/lib/worldBank";
import { siteConfig } from "@/lib/site";

export function buildCountryNewsMetadata(row: CountryRow): Metadata {
  const title = `${row.name} (${row.iso3}) Country News Links | Datlora`;

  const description =
    `Latest external news links and search results related to ${row.name} (${row.iso3}), connected with Datlora country indicators, issue briefs, trade, energy, food, tariffs, logistics, imports, and supply-chain context.`;

  const canonicalPath = `/news/country/${row.iso3}`;
  const canonicalUrl = `${siteConfig.url}${canonicalPath}`;

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    keywords: [
      row.name,
      row.iso3,
      row.iso2,
      `${row.name} news`,
      `${row.name} trade news`,
      `${row.name} energy news`,
      `${row.name} tariff news`,
      `${row.name} food import news`,
      `${row.name} supply chain news`,
      "external news links",
      "country news",
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
          alt: `${row.name} country news links on Datlora`,
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

export function buildCountryNewsStructuredData(row: CountryRow) {
  const newsUrl = `${siteConfig.url}/news/country/${row.iso3}`;
  const countryUrl = `${siteConfig.url}/country/${row.iso3}`;
  const issuesUrl = `${siteConfig.url}/issues`;
  const sourcesUrl = `${siteConfig.url}/sources`;
  const methodologyUrl = `${siteConfig.url}/methodology`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${newsUrl}#breadcrumb`,
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
            name: "News",
            item: `${siteConfig.url}/news`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `${row.name} News`,
            item: newsUrl,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": `${newsUrl}#collection`,
        url: newsUrl,
        name: `${row.name} (${row.iso3}) Country News Links`,
        description:
          `External news links and search results related to ${row.name}, connected with Datlora country indicators and issue briefs.`,
        isPartOf: {
          "@id": `${siteConfig.url}/#website`,
        },
        breadcrumb: {
          "@id": `${newsUrl}#breadcrumb`,
        },
        inLanguage: ["ko", "en"],
        about: {
          "@type": "Country",
          name: row.name,
          identifier: row.iso3,
        },
        mainEntity: {
          "@type": "ItemList",
          "@id": `${newsUrl}#news-link-list`,
          name: `${row.name} external news links and searches`,
          description:
            "A live list of external news links and news search destinations. Datlora does not republish full article text.",
          itemListOrder: "https://schema.org/ItemListOrderDescending",
        },
        relatedLink: [
          countryUrl,
          issuesUrl,
          sourcesUrl,
          methodologyUrl,
          `${siteConfig.url}/compare?a=${row.iso3}&b=USA`,
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${newsUrl}#webpage`,
        url: newsUrl,
        name: `${row.name} Country News Links`,
        description:
          `Country-specific external news context for ${row.name}, separated from official Datlora country indicators.`,
        isPartOf: {
          "@id": `${siteConfig.url}/#website`,
        },
        breadcrumb: {
          "@id": `${newsUrl}#breadcrumb`,
        },
        about: [
          {
            "@type": "Country",
            name: row.name,
            identifier: row.iso3,
          },
          {
            "@type": "Dataset",
            "@id": `${countryUrl}#dataset`,
          },
        ],
      },
    ],
  };
}
