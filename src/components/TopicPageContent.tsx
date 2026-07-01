import type { Topic } from "@/lib/topicContent";

export default function TopicPageContent({ topic }: { topic: Topic }) {
  return (
    <main className="min-h-screen bg-[#070a14] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <a
          href="/topics"
          className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-white/[0.08]"
        >
          ← Topics
        </a>

        <p className="mt-10 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
          {topic.label}
        </p>

        <h1 className="mt-4 max-w-4xl text-5xl font-bold leading-tight">
          {topic.titleKo}
        </h1>

        <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
          {topic.descriptionKo}
        </p>

        <div className="mt-8 rounded-3xl border border-blue-400/20 bg-blue-400/10 p-6">
          <p className="text-sm font-semibold text-blue-100">
            공식 출처 기준
          </p>
          <p className="mt-3 text-sm leading-7 text-blue-50/80">
            {topic.sourceKo}
          </p>
          <p className="mt-3 text-sm leading-7 text-blue-50/70">
            {topic.sourceEn}
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-bold">이 페이지에서 확인할 질문</h2>
            <div className="mt-5 space-y-3">
              {topic.questionsKo.map((question) => (
                <div
                  key={question}
                  className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-4 text-sm leading-6 text-slate-300"
                >
                  {question}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-bold">관련 지표</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {topic.indicatorsKo.map((indicator) => (
                <div
                  key={indicator}
                  className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-4 text-sm font-semibold text-white"
                >
                  {indicator}
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-10 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6">
          <h2 className="text-2xl font-bold text-emerald-50">
            국가별 상세 데이터로 이동
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-emerald-50/80">
            특정 국가의 실제 수치가 필요하면 국가 상세 페이지에서 World Bank,
            UN Comtrade, WITS/WTO, EIA 데이터를 함께 확인하세요.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/"
              className="rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-bold text-[#07120d]"
            >
              국가 검색하기 →
            </a>
            <a
              href="/country/KOR"
              className="rounded-2xl border border-white/10 bg-white/[0.08] px-5 py-3 text-sm font-semibold text-white"
            >
              대한민국 보기
            </a>
            <a
              href="/country/USA"
              className="rounded-2xl border border-white/10 bg-white/[0.08] px-5 py-3 text-sm font-semibold text-white"
            >
              United States 보기
            </a>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6">
          <h2 className="text-2xl font-bold text-amber-50">
            최신성 해석 기준
          </h2>
          <p className="mt-4 text-sm leading-7 text-amber-50/80">
            공식 통계는 출처마다 발표 주기가 다릅니다. 2026 공식값이 있으면
            우선 사용하고, 없으면 2025, 2024 또는 해당 지표의 최신 공식 제공
            연도를 표시합니다. 공식값이 없는 항목은 임의 추정값으로 채우지 않습니다.
          </p>
        </section>
      </section>
    </main>
  );
}
