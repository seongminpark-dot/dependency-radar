import type { Metadata } from "next";
import LegalInfoPage from "@/components/LegalInfoPage";

export const metadata: Metadata = {
  title: "Terms of Use | Datlora",
  description:
    "Datlora terms of use for official country indicators, external news links, and informational research use.",
  alternates: {
    canonical: "https://datlora.com/terms",
  },
};

export default function TermsPage() {
  return <LegalInfoPage pageType="terms" />;
}
