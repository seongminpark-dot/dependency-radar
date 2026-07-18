import type { Metadata } from "next";
import CountriesPageClient from "@/components/CountriesPageClient";
import { getCountryStats } from "@/lib/worldBank";

export const metadata: Metadata = {
  title: "Countries | Datlora",
  description:
    "Explore official country indicators by country, region, income group, and data coverage. Open country data pages, country news pages, and country comparisons.",
  alternates: {
    canonical: "https://www.datlora.com/countries",
  },
};

export default async function CountriesPage() {
  const rows = await getCountryStats();

  return <CountriesPageClient rows={rows} />;
}
