import type { Metadata } from "next";
import { getTopic } from "@/lib/topicContent";
import TopicPageContent from "@/components/TopicPageContent";

export const metadata: Metadata = {
  title: 'Fuel Import Dependency by Country | Trade Dependency Atlas',
  description: 'Compare fuel import dependency and energy-related trade exposure by country.',
  alternates: {
    canonical: '/topics/fuel-import-dependency',
  },
};

export default function Page() {
  const topic = getTopic('fuel-import-dependency');

  if (!topic) {
    return null;
  }

  return <TopicPageContent topic={topic} />;
}
