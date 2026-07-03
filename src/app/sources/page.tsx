import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Sources | Datlora",
  description:
    "Datlora data sources include World Bank, UN Comtrade, WITS, EIA, GDELT, and external news links used for context.",
  alternates: {
    canonical: "https://datlora.com/sources",
  },
};

const sourceGroups = [
  {
    title: "World Bank",
    type: "Official statistics",
    description:
      "Used for annual structural indicators such as imports/GDP, fuel import share, food import share, tariff rate, logistics index, and related country metadata.",
    note: "Values may use different latest available years by indicator and country.",
  },
  {
    title: "UN Comtrade",
    type: "Official trade data",
    description:
      "Used for newer trade-data layers where available, separated from annual structural indicators.",
    note: "Trade values should be read as official trade records, not as Datlora predictions.",
  },
  {
    title: "WITS",
    type: "Trade and tariff reference",
    description:
      "Used as a reference layer for tariff and trade-related source context where applicable.",
    note: "Coverage and update timing may differ by country and indicator.",
  },
  {
    title: "EIA",
    type: "Energy reference",
    description:
      "Used as an energy-related reference source where energy market context is required.",
    note: "Energy data should be interpreted with source year and country coverage in mind.",
  },
  {
    title: "GDELT / External news links",
    type: "News context",
    description:
      "Used to discover and link recent global news articles or search pages related to trade, energy, food, tariffs, and supply chains.",
    note: "News links are external context. Datlora does not republish full article text.",
  },
];

export default function SourcesPage() {
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
            <a href="/methodology" className="hover:text-white">Methodology</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
          Data Sources
        </p>

        <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.98] tracking-[-0.075em] md:text-7xl">
          Datlora는 뉴스와 공식 통계를 분리해서 표시합니다.
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          국가 통계는 공식 공개 데이터 기준으로 표시하고, 뉴스는 외부 원문 기사 또는 뉴스 검색 링크로 제공합니다. 두 영역은 서로 연결되지만 같은 출처로 취급하지 않습니다.
        </p>

        <div className="mt-10 grid gap-5">
          {sourceGroups.map((source) => (
            <article
              key={source.title}
              className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/20"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
                    {source.type}
                  </p>
                  <h2 className="mt-3 text-3xl font-black tracking-[-0.06em]">
                    {source.title}
                  </h2>
                </div>

                <span className="w-fit rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-xs font-black text-slate-300">
                  Source layer
                </span>
              </div>

              <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-300">
                {source.description}
              </p>

              <p className="mt-4 rounded-2xl border border-white/10 bg-slate-950/55 p-4 text-xs leading-6 text-slate-400">
                {source.note}
              </p>
            </article>
          ))}
        </div>

        <section className="mt-10 rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-6">
          <h2 className="text-3xl font-black tracking-[-0.06em]">
            What Datlora does not do
          </h2>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4 text-sm leading-7 text-slate-300">
              Datlora does not claim that a news article directly causes a statistical indicator.
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4 text-sm leading-7 text-slate-300">
              Datlora does not replace official customs, legal, trade, policy, or investment advice.
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4 text-sm leading-7 text-slate-300">
              Datlora does not hide methodology behind a private risk score.
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
