import type { Metadata } from "next";
import LegalInfoPage from "@/components/LegalInfoPage";

export const metadata: Metadata = {
  title: "Disclaimer | Datlora",
  description:
    "Datlora disclaimer explaining that the service is for informational research and does not replace professional advice.",
  alternates: {
    canonical: "https://datlora.com/disclaimer",
  },
};

export default function DisclaimerPage() {
  return <LegalInfoPage pageType="disclaimer" />;
}
