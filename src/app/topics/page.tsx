import type { Metadata } from "next";
import { topics } from "@/lib/topicContent";

export const metadata: Metadata = {
  title: "Topics | Trade Dependency Atlas",
  description:
    "Explore country trade dependency, fuel import dependency, food import dependency, tariff rates, imports/GDP, and energy statistics by topic.",
};

export default function TopicsPage() {
  return (
    <main className="min-h-screen bg-[#070a14] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
          Topics
        </p>

        <h1 className="mt-4 max-w-4xl text-5xl font-bold leading-tight">
          국가를 고르기 전에, 필요한 지표부터 찾아보세요.
        </h1>

        <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
          Trade Dependency Atlas는 국가별 무역, 에너지, 관세, 수입 의존도 정보를
          주제별로 탐색할 수 있도록 정리합니다.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <a
              key={topic.slug}
              href={`/topics/${topic.slug}`}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:bg-white/[0.08]"
            >
              <p className="text-sm font-semibold text-cyan-300">
                {topic.label}
              </p>
              <h2 className="mt-3 text-2xl font-bold">{topic.titleKo}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                {topic.descriptionKo}
              </p>
              <p className="mt-5 text-sm font-semibold text-indigo-300">
                Open topic →
              </p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
