import type { Metadata } from "next";
import countries from "world-countries";

type CountryRecord = {
  cca3?: string;
  cca2?: string;
  name?: {
    common?: string;
    official?: string;
  };
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://dependency-radar-three.vercel.app";

function normalizeIso3(value: string) {
  return value.trim().toUpperCase();
}

function getCountryName(iso3: string) {
  const code = normalizeIso3(iso3);

  const match = (countries as CountryRecord[]).find(
    (country) => country.cca3?.toUpperCase() === code
  );

  return match?.name?.common ?? code;
}

function getCountryFlag(iso3: string) {
  const code = normalizeIso3(iso3);

  const match = (countries as CountryRecord[]).find(
    (country) => country.cca3?.toUpperCase() === code
  );

  const iso2 = match?.cca2;

  if (!iso2 || iso2.length !== 2) return "";

  return iso2
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
}

export function buildCountryMetadata(iso3: string): Metadata {
  const code = normalizeIso3(iso3);
  const countryName = getCountryName(code);
  const flag = getCountryFlag(code);
  const displayName = `${flag ? `${flag} ` : ""}${countryName}`;

  const title = `${countryName} Supply Dependency, Trade, Tariff & Energy Statistics | Dependency Radar`;

  const description = `${countryName} country dashboard integrating official World Bank WDI, UN Comtrade, WITS/WTO, and EIA data for supply dependency, merchandise trade, tariff, logistics, and energy indicators.`;

  const canonicalPath = `/country/${code}`;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Dependency Radar",
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
    keywords: [
      countryName,
      code,
      "country statistics",
      "supply dependency",
      "trade data",
      "tariff data",
      "energy data",
      "World Bank",
      "UN Comtrade",
      "WITS",
      "EIA",
      "Dependency Radar",
      displayName,
    ],
  };
}
