import type { Metadata } from "next";
import { issueBriefs } from "@/lib/issueBriefs";

export const metadata: Metadata = {
  title: "Global Issue Briefs | Datlora",
  description:
    "Datlora issue briefs connect official country statistics with global trade, energy, food, tariff, and supply-chain issues.",
  alternates: {
    canonical: "https://www.datlora.com/issues",
  },
};

export default function IssuesPage() {
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
        <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
          Global Issue Briefs
        </p>

        <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.075em] md:text-7xl">
          세계 이슈를 공식 국가 데이터로 확인하세요.
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          Datlora는 뉴스 자체를 판단하지 않습니다. 대신 무역, 에너지, 식량, 관세, 공급망 이슈를 이해하는 데 필요한 공식 지표와 국가별 구조 데이터를 연결합니다.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {issueBriefs.map((issue) => (
            <a
              key={issue.slug}
              href={`/issues/${issue.slug}`}
              className={`group rounded-[2rem] border border-white/10 bg-gradient-to-br ${issue.theme} p-6 shadow-2xl shadow-black/25 transition hover:-translate-y-1 hover:border-cyan-300/40`}
            >
              <p className="text-sm font-black text-cyan-200">{issue.shortTitle}</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.06em] text-white">
                {issue.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">{issue.deck}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {issue.metrics.slice(0, 3).map((metric) => (
                  <span
                    key={metric}
                    className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs font-bold text-slate-200"
                  >
                    {metric}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
