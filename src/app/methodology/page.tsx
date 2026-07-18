import type { Metadata } from "next";
import MethodologyPageClient from "@/components/MethodologyPageClient";

export const metadata: Metadata = {
  title: "Methodology | Datlora",
  description:
    "Datlora methodology explains how live news links, official country indicators, issue briefs, and country exposure pages are separated and interpreted.",
  alternates: {
    canonical: "https://www.datlora.com/methodology",
  },
};

export default function MethodologyPage() {
  return <MethodologyPageClient />;
}
