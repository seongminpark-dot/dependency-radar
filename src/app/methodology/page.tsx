import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology | Datlora",
  description:
    "Datlora methodology explains how live news links, official country indicators, issue briefs, and country exposure pages are separated and interpreted.",
  alternates: {
    canonical: "https://datlora.com/methodology",
  },
};

const methodologyBlocks = [
  {
    title: "News is external context",
    description:
      "Datlora links to external news articles and news search pages. It does not republish full news text, and it does not treat news headlines as official statistical evidence.",
  },
  {
    title: "Statistics are official public indicators",
    description:
      "Country indicators are based on public datasets such as World Bank, UN Comtrade, WITS, EIA, and related official sources where available.",
  },
  {
    title: "Issue briefs are structured interpretations",
    description:
      "Issue pages group relevant official indicators around topics such as oil shock, food import risk, tariff pressure, and supply-chain exposure.",
  },
  {
    title: "No arbitrary risk score",
    description:
      "Datlora does not convert indicators into a hidden 100-point risk score. Values, source years, and related indicators are shown directly.",
  },
];

const workflow = [
  "A user reads a global news article or opens a country page.",
  "Datlora connects that context to relevant issue briefs.",
  "Issue briefs show official indicators and exposed countries.",
  "Country pages show values, years, related news, and comparison links.",
];

export default function MethodologyPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050816]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-6 py-4">
          <a href="/" className="text-base font-black tracking-tight text-white">
            Datlora
          </a>

          <nav className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-300">
            <a href="/" className="hover:text-white">Home</a>
            <a href="/news" className="hover:text-white">News</a>
            <a href="/issues" className="hover:text-white">Issues</a>
            <a href="/topics" className="hover:text-white">Topics</a>
            <a href="/compare?a=KOR&b=USA" className="hover:text-white">Compare</a>
            <a href="/sources" className="hover:text-white">Sources</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">
          Methodology
        </p>

        <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.98] tracking-[-0.075em] md:text-7xl">
          뉴스와 공식 통계를 구분해서 연결합니다.
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          Datlora는 뉴스 사이트가 아니라, 글로벌 뉴스 흐름을 공식 국가 지표와 연결해 읽을 수 있게 돕는 데이터 플랫폼입니다. 뉴스 링크와 통계 데이터는 서로 다른 출처와 역할을 가집니다.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {methodologyBlocks.map((block) => (
            <article
              key={block.title}
              className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/20"
            >
              <h2 className="text-2xl font-black tracking-[-0.05em]">
                {block.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                {block.description}
              </p>
            </article>
          ))}
        </div>

        <section className="mt-10 rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-6">
          <h2 className="text-3xl font-black tracking-[-0.06em]">
            How Datlora connects information
          </h2>

          <div className="mt-6 grid gap-3">
            {workflow.map((item, index) => (
              <div
                key={item}
                className="grid gap-4 rounded-2xl border border-white/10 bg-slate-950/55 p-4 md:grid-cols-[48px_1fr]"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-400 text-lg font-black text-slate-950">
                  {index + 1}
                </div>
                <p className="self-center text-sm font-bold leading-7 text-slate-100">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-5 text-sm leading-7 text-amber-100">
          Datlora is for informational research only. It is not investment, trade, customs, logistics, legal, or policy advice. External news links are provided as context, while statistical values are based on official public datasets where available.
        </section>
      </section>
    </main>
  );
}
