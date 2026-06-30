import StatsDashboard from "@/components/StatsDashboard";
import { getCountryStats } from "@/lib/worldBank";
export const dynamic = "force-dynamic";
export const revalidate = 0;


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