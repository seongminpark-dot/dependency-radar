import type { Metadata } from "next";
import IssueBriefPage from "@/components/IssueBriefPage";
import { getIssueBrief } from "@/lib/issueBriefs";

const issue = getIssueBrief("supply-chain");

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: issue.title + " | Datlora",
  description: issue.deck,
  alternates: {
    canonical: "https://datlora.com/issues/supply-chain",
  },
};

export default function Page() {
  return <IssueBriefPage slug="supply-chain" />;
}
