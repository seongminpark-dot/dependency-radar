import type { Metadata } from "next";
import SourcesPageClient from "@/components/SourcesPageClient";

export const metadata: Metadata = {
  title: "Data Sources | Datlora",
  description:
    "Datlora data sources include World Bank, UN Comtrade, WITS, EIA, GDELT, and external news links used for context.",
  alternates: {
    canonical: "https://www.datlora.com/sources",
  },
};

export default function SourcesPage() {
  return <SourcesPageClient />;
}
