import type { Metadata } from "next";
import { getTopic } from "@/lib/topicContent";
import TopicPageContent from "@/components/TopicPageContent";

export const metadata: Metadata = {
  title: 'Imports-to-GDP Ratio by Country | Trade Dependency Atlas',
  description: 'Compare import exposure relative to GDP by country.',
  alternates: {
    canonical: '/topics/imports-gdp',
  },
};

export default function Page() {
  const topic = getTopic('imports-gdp');

  if (!topic) {
    return null;
  }

  return <TopicPageContent topic={topic} />;
}
