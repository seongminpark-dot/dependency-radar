import type { Metadata } from "next";
import CompareClient from "@/components/CompareClient";
import { getCountryStats } from "@/lib/worldBank";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Compare Countries | Datlora",
  description:
    "Compare official country indicators for trade, energy, food, tariffs, logistics, imports, and supply-chain exposure.",
  alternates: {
    canonical: "https://www.datlora.com/compare",
  },
};

type ComparePageProps = {
  searchParams?: Promise<{
    a?: string;
    b?: string;
    c?: string;
  }>;
};

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const params = searchParams ? await searchParams : {};
  const rows = await getCountryStats();

  const initialIso3 = [params.a, params.b, params.c]
    .filter((value): value is string => Boolean(value))
    .map((value) => value.toUpperCase())
    .filter((value) => rows.some((row) => row.iso3 === value));

  return <CompareClient rows={rows} initialIso3={initialIso3} />;
}
