import { notFound } from "next/navigation";
import CountryDetailClient from "@/components/CountryDetailClient";
import { getCountryStats } from "@/lib/worldBank";

export const revalidate = 86400;

export default async function CountryPage({
  params,
}: {
  params: Promise<{ iso3: string }>;
}) {
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
