import type { Metadata } from "next";
import StatsDashboard from "@/components/StatsDashboard";
import { getCountryStats } from "@/lib/worldBank";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Datlora | Live Global News and Official Country Data",
  description:
    "Datlora connects live global news with official country indicators for trade, energy, food, tariff, logistics, and supply-chain exposure.",
  alternates: {
    canonical: "https://datlora.com",
  },
  openGraph: {
    title: "Datlora | Live Global News and Official Country Data",
    description:
      "Connect global news with official country data and issue briefs for trade, energy, food, tariff, and supply-chain exposure.",
    url: "https://datlora.com",
    siteName: "Datlora",
    type: "website",
  },
};

export default async function Home() {
  try {
    const rows = await getCountryStats();

    return <StatsDashboard rows={rows} />;
  } catch {
    return (
      <StatsDashboard
        rows={[]}
        errorMessage="World Bank 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
      />
    );
  }
}
