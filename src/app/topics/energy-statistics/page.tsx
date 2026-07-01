import type { Metadata } from "next";
import { getTopic } from "@/lib/topicContent";
import TopicPageContent from "@/components/TopicPageContent";

export const metadata: Metadata = {
  title: 'Energy Statistics by Country | Trade Dependency Atlas',
  description: 'Check country-level energy indicators using EIA and World Bank data.',
  alternates: {
    canonical: '/topics/energy-statistics',
  },
};

export default function Page() {
  const topic = getTopic('energy-statistics');

  if (!topic) {
    return null;
  }

  return <TopicPageContent topic={topic} />;
}
