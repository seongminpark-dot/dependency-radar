import type { Metadata } from "next";
import { getTopic } from "@/lib/topicContent";
import TopicPageContent from "@/components/TopicPageContent";

export const metadata: Metadata = {
  title: 'Tariff Rate by Country | Trade Dependency Atlas',
  description: 'Compare tariff rates and trade barrier conditions by country.',
  alternates: {
    canonical: '/topics/tariff-rate',
  },
};

export default function Page() {
  const topic = getTopic('tariff-rate');

  if (!topic) {
    return null;
  }

  return <TopicPageContent topic={topic} />;
}
