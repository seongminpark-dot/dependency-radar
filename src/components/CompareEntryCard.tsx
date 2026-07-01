"use client";

type Language = "ko" | "en" | "ja" | "zh" | "es" | "fr" | "de";

export default function CompareEntryCard({
  language,
}: {
  language: Language;
}) {
  const isKo = language === "ko";

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16">
      <div className="rounded-[2rem] border border-emerald-400/20 bg-emerald-400/10 p-6 lg:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
          Country comparison
        </p>

        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 className="max-w-4xl text-4xl font-bold leading-tight text-white">
              {isKo
                ? "두 국가의 무역·에너지 의존도를 한 화면에서 비교하세요."
                : "Compare two countries in one view."}
            </h2>
            <p className="mt-4 max-w-4xl text-sm leading-7 text-emerald-50/80">
              {isKo
                ? "한국과 미국, 한국과 일본처럼 두 국가를 선택하면 수입/GDP, 연료 수입 비중, 식량 수입 비중, 관세율, 물류지수를 한 번에 비교할 수 있습니다."
                : "Select two countries to compare imports/GDP, fuel imports, food imports, tariffs, logistics, and energy indicators."}
            </p>
          </div>

          <a
            href="/compare?a=KOR&b=USA"
            className="rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-bold text-[#06130d]"
          >
            {isKo ? "국가 비교하기" : "Compare countries"} →
          </a>
        </div>
      </div>
    </section>
  );
}
