import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CountryNewsPageClient from "@/components/CountryNewsPageClient";
import { getCountryStats } from "@/lib/worldBank";
import { siteConfig } from "@/lib/site";

type CountryNewsPageProps = {
  params: Promise<{ iso3: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: CountryNewsPageProps): Promise<Metadata> {
  const { iso3 } = await params;

  try {
    const rows = await getCountryStats();
    const row = rows.find(
      (item) => item.iso3.toUpperCase() === iso3.toUpperCase()
    );

    if (!row) {
      return {
        title: "Country news not found",
      };
    }

    return {
      title: `${row.name} Latest News | Datlora`,
      description: `Latest trade, energy, food, tariff, and supply-chain news related to ${row.name}, linked to Datlora country indicators and issue briefs.`,
      alternates: {
        canonical: `${siteConfig.url}/news/country/${row.iso3}`,
      },
    };
  } catch {
    return {
      title: `${iso3.toUpperCase()} Latest News | Datlora`,
    };
  }
}

export default async function CountryNewsPage({ params }: CountryNewsPageProps) {
  const { iso3 } = await params;
  const rows = await getCountryStats();

  const row = rows.find(
    (item) => item.iso3.toUpperCase() === iso3.toUpperCase()
  );

  if (!row) {
    notFound();
  }

  return (
    <CountryNewsPageClient
      iso3={row.iso3}
      iso2={row.iso2}
      countryName={row.name}
      displayName={row.name}
    />
  );
}
