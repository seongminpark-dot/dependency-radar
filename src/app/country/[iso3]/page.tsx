import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CountryDetailClient from "@/components/CountryDetailClient";
import { getCountryStats } from "@/lib/worldBank";
import { siteConfig } from "@/lib/site";
import { buildCountryMetadata } from "@/lib/countrySeo";

export const revalidate = 86400;

type CountryPageProps = {
  params: Promise<{ iso3: string }>;
};

export async function generateMetadata({
  params,
}: CountryPageProps): Promise<Metadata> {
  const { iso3 } = await params;

  try {
    const rows = await getCountryStats();
    const row = rows.find(
      (item) => item.iso3.toUpperCase() === iso3.toUpperCase()
    );

    if (!row) {
      return {
        title: "Country not found",
      };
    }

    const title = `${row.name} (${row.iso3})`;
    const description = `Country dependency and supply exposure indicators for ${row.name}, including imports, tariffs, logistics, energy, food, and fuel data from the World Bank API.`;

    return {
      title,
      description,
      alternates: {
        canonical: `/country/${row.iso3}`,
      },
      openGraph: {
        title: `${title} | Datlora`,
        description,
        url: `${siteConfig.url}/country/${row.iso3}`,
        type: "website",
        images: [
          {
            url: "/opengraph-image",
            width: 1200,
            height: 630,
            alt: `${row.name} country dependency statistics`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | Datlora`,
        description,
        images: ["/opengraph-image"],
      },
    };
  } catch {
    return {
      title: `Country ${iso3.toUpperCase()}`,
    };
  }
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { iso3 } = await params;
  const rows = await getCountryStats();

  const row = rows.find(
    (item) => item.iso3.toUpperCase() === iso3.toUpperCase()
  );

  if (!row) {
    notFound();
  }

  return <CountryDetailClient row={row} rows={rows} />;
}