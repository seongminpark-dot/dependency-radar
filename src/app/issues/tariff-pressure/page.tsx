import type { Metadata } from "next";
import IssueBriefPage from "@/components/IssueBriefPage";
import { getIssueBrief } from "@/lib/issueBriefs";

const issue = getIssueBrief("tariff-pressure");

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: issue.title + " | Datlora",
  description: issue.deck,
  alternates: {
    canonical: "https://datlora.com/issues/tariff-pressure",
  },
};

export default function Page() {
  return <IssueBriefPage slug="tariff-pressure" />;
}
