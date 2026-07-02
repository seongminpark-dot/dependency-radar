import type { Metadata } from "next";
import { getIssueBrief } from "@/lib/issueBriefs";

const issue = getIssueBrief("tariff-pressure");

export const metadata: Metadata = {
  title: issue.title + " | Datlora",
  description: issue.deck,
  alternates: {
    canonical: "https://datlora.com/issues/tariff-pressure",
  },
};

export default function IssuePage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050816]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-6 py-4">
          <a href="/" className="text-base font-black tracking-tight text-white">
            Datlora
          </a>

          <nav className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-300">
            <a href="/" className="hover:text-white">Home</a>
            <a href="/topics" className="hover:text-white">Topics</a>
            <a href="/compare?a=KOR&b=USA" className="hover:text-white">Compare</a>
            <a href="/issues" className="text-cyan-300">Issues</a>
            <a href="/sources" className="hover:text-white">Sources</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <a href="/issues" className="text-sm font-bold text-cyan-300 hover:text-cyan-200">
          ← Global Issue Briefs
        </a>

        <div className={"mt-6 rounded-[2.2rem] border border-white/10 bg-gradient-to-br " + issue.theme + " p-8 shadow-2xl shadow-black/30"}>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200">
            Datlora Issue Brief
          </p>

          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.075em] md:text-7xl">
            {issue.title}
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">
            {issue.description}
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6">
            <h2 className="text-2xl font-black tracking-[-0.05em]">Related official indicators</h2>
            <div className="mt-5 grid gap-3">
              {issue.metrics.map((metric) => (
                <div
                  key={metric}
                  className="rounded-2xl border border-white/10 bg-slate-950/45 p-4"
                >
                  <strong>{metric}</strong>
                </div>
              ))}
            </div>
          </section>

          <aside className="grid gap-6">
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6">
              <h2 className="text-2xl font-black tracking-[-0.05em]">Open topic data</h2>
              <div className="mt-5 grid gap-3">
                {issue.relatedTopics.map((topic) => (
                  <a
                    key={topic.href}
                    href={topic.href}
                    className="rounded-2xl border border-white/10 bg-slate-950/45 p-4 font-black text-slate-100 hover:border-cyan-300/40"
                  >
                    {topic.label}
                  </a>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6">
              <h2 className="text-2xl font-black tracking-[-0.05em]">Example country pages</h2>
              <div className="mt-5 grid gap-3">
                {issue.countryLinks.map((country) => (
                  <a
                    key={country.href}
                    href={country.href}
                    className="rounded-2xl border border-white/10 bg-slate-950/45 p-4 font-black text-slate-100 hover:border-emerald-300/40"
                  >
                    {country.label}
                  </a>
                ))}
              </div>
            </section>
          </aside>
        </div>

        <section className="mt-8 rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-5 text-sm leading-7 text-amber-100">
          뉴스는 관련 글로벌 이슈 참고용이며, Datlora의 통계 수치는 공식 공개 데이터 기준입니다. 뉴스와 통계 사이의 직접 인과관계를 단정하지 않습니다.
        </section>
      </section>
    </main>
  );
}
