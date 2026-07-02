import type { Metadata } from "next";
import VoyageProClient from "@/features/voyage-pro/components/VoyageProClient";

export const metadata: Metadata = {
  title: "Voyage Pro | Datlora",
  description:
    "Datlora Voyage Pro is a premium-style 3D voyage game prototype with contracts, coins, gems, upgrades, ports, and replay loops.",
  alternates: {
    canonical: "https://datlora.com/voyage-pro",
  },
};

export default function VoyageProPage() {
  return <VoyageProClient />;
}
