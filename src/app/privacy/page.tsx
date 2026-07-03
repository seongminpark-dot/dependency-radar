import type { Metadata } from "next";
import LegalInfoPage from "@/components/LegalInfoPage";

export const metadata: Metadata = {
  title: "Privacy Policy | Datlora",
  description:
    "Datlora privacy policy explaining visitor country display, language preference, analytics, email inquiries, and external links.",
  alternates: {
    canonical: "https://datlora.com/privacy",
  },
};

export default function PrivacyPage() {
  return <LegalInfoPage pageType="privacy" />;
}
