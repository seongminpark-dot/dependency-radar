import type { Metadata } from "next";
import AtlasTycoonClient from "@/features/atlas-tycoon/components/AtlasTycoonClient";

export const metadata: Metadata = {
  title: "Atlas Tycoon | Datlora",
  description:
    "Datlora Atlas Tycoon is a country collection and world-building tycoon game where players unlock countries, upgrade landmarks, and grow global income.",
  alternates: {
    canonical: "https://www.datlora.com/atlas-tycoon",
  },
};

export default function AtlasTycoonPage() {
  return <AtlasTycoonClient />;
}
