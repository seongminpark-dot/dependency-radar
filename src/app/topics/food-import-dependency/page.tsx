import type { Metadata } from "next";
import { getTopic } from "@/lib/topicContent";
import TopicPageContent from "@/components/TopicPageContent";

export const metadata: Metadata = {
  title: 'Food Import Dependency by Country | Trade Dependency Atlas',
  description: 'Compare food and agricultural import dependency by country.',
  alternates: {
    canonical: '/topics/food-import-dependency',
  },
};

export default function Page() {
  const topic = getTopic('food-import-dependency');

  if (!topic) {
    return null;
  }

  return <TopicPageContent topic={topic} />;
}
