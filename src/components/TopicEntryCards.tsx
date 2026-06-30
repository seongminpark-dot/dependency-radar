"use client";

import { topics } from "@/lib/topicContent";

type Language = "ko" | "en" | "ja" | "zh" | "es" | "fr" | "de";

const copy = {
  ko: {
    label: "Explore by topic",
    title: "궁금한 지표부터 바로 확인하세요.",
    subtitle:
      "국가명을 몰라도 연료 수입, 식량 수입, 수입/GDP, 관세율, 에너지 통계 같은 주제별 페이지에서 필요한 정보를 먼저 볼 수 있습니다.",
    open: "주제 보기",
    allTopics: "모든 주제 보기",
  },
  en: {
    label: "Explore by topic",
    title: "Start with the indicator you care about.",
    subtitle:
      "Even without choosing a country first, topic pages help visitors explore fuel imports, food imports, imports/GDP, tariff rates, and energy statistics.",
    open: "Open topic",
    allTopics: "View all topics",
  },
};

export default function TopicEntryCards({
  language,
}: {
  language: Language;
}) {
  const t = language === "ko" ? copy.ko : copy.en;

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
              {t.label}
            </p>
            <h2 className="mt-4 max-w-4xl text-4xl font-bold leading-tight text-white">
              {t.title}
            </h2>
            <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-300">
              {t.subtitle}
            </p>
          </div>

          <a
            href="/topics"
            className="rounded-2xl border border-white/10 bg-[#0b0f1c] px-5 py-3 text-sm font-semibold text-white hover:bg-white/[0.07]"
          >
            {t.allTopics} →
          </a>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {topics.map((topic) => (
            <a
              key={topic.slug}
              href={`/topics/${topic.slug}`}
              className="rounded-3xl border border-white/10 bg-[#0b0f1c] p-5 transition hover:bg-white/[0.07]"
            >
              <p className="text-sm font-semibold text-cyan-300">
                {topic.label}
              </p>
              <p className="mt-3 text-lg font-bold leading-snug text-white">
                {language === "ko" ? topic.titleKo : topic.titleEn}
              </p>
              <p className="mt-4 text-sm font-semibold text-indigo-300">
                {t.open} →
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
