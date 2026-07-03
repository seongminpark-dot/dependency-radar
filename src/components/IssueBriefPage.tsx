import { getIssueBrief } from "@/lib/issueBriefs";
import { getCountryStats } from "@/lib/worldBank";
import {
  flagEmoji,
  getIssueExposureRows,
  getIssueMetricConfig,
} from "@/lib/issueExposure";

import UnifiedTopNav from "@/components/UnifiedTopNav";
export default async function IssueBriefPage({ slug }: { slug: string }) {
  const issue = getIssueBrief(slug);
  const config = getIssueMetricConfig(slug);

  let exposureRows: ReturnType<typeof getIssueExposureRows> = [];
  let dataError = "";

  try {
    const rows = await getCountryStats();
    exposureRows = getIssueExposureRows(slug, rows);
  } catch {
    dataError = "공식 데이터를 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.";
  }

  const compareHref =
    exposureRows.length >= 2
      ? `/compare?a=${exposureRows[0].iso3}&b=${exposureRows[1].iso3}`
      : "/compare?a=KOR&b=USA";

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050816]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-6 py-4">
          <a href="/" className="text-base font-black tracking-tight text-white">
            Datlora
          </a>
          <UnifiedTopNav />

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

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300">
                  Official exposure snapshot
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.06em]">
                  Top countries by {config.primaryLabel}
                </h2>
              </div>

              <a
                href={compareHref}
                className="w-fit rounded-full bg-emerald-400 px-4 py-2 text-sm font-black text-slate-950"
              >
                Compare top countries
              </a>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-300">
              {config.methodology}
            </p>

            {dataError ? (
              <div className="mt-5 rounded-2xl border border-red-300/20 bg-red-300/10 p-4 text-sm text-red-100">
                {dataError}
              </div>
            ) : (
              <div className="mt-6 grid gap-3">
                {exposureRows.map((row, index) => (
                  <a
                    key={row.iso3}
                    href={`/country/${row.iso3}`}
                    className="grid gap-4 rounded-2xl border border-white/10 bg-slate-950/45 p-4 transition hover:border-cyan-300/40 md:grid-cols-[48px_1fr_auto]"
                  >
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-lg font-black">
                      {index + 1}
                    </div>

                    <div>
                      <strong className="block text-lg">
                        {flagEmoji(row.iso2)} {row.name}
                      </strong>
                      <span className="mt-1 block text-sm text-slate-400">
                        {row.region} · {row.iso3}
                      </span>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {row.secondaryStats.map((stat) => (
                          <span
                            key={stat.label}
                            className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1 text-xs font-bold text-slate-300"
                          >
                            {stat.label}: {stat.value}
                            {stat.year ? ` · ${stat.year}` : ""}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-left md:text-right">
                      <span className="block text-xs font-black uppercase tracking-[0.12em] text-cyan-300">
                        {row.primaryLabel}
                      </span>
                      <strong className="mt-1 block text-2xl tracking-[-0.05em]">
                        {row.primaryFormatted}
                      </strong>
                      <span className="mt-1 block text-xs text-slate-400">
                        {row.primaryYear || "Latest official year"}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}
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
              <h2 className="text-2xl font-black tracking-[-0.05em]">How to read this</h2>
              <div className="mt-5 grid gap-3 text-sm leading-7 text-slate-300">
                <p className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                  이 표는 공식 지표의 최신 제공값을 기준으로 정렬합니다. 국가별 최신 연도는 서로 다를 수 있습니다.
                </p>
                <p className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                  순위는 해당 이슈를 이해하기 위한 출발점이며, 정책·투자·법률 판단을 대체하지 않습니다.
                </p>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6">
              <h2 className="text-2xl font-black tracking-[-0.05em]">Country news links</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                이 이슈에서 노출도가 높은 국가의 관련 최신 뉴스를 바로 확인합니다.
              </p>

              <div className="mt-5 grid gap-3">
                {exposureRows.length > 0 ? (
                  exposureRows.slice(0, 6).map((country) => (
                    <div
                      key={country.iso3}
                      className="rounded-2xl border border-white/10 bg-slate-950/45 p-4"
                    >
                      <div>
                        <strong className="block text-white">
                          {flagEmoji(country.iso2)} {country.name}
                        </strong>
                        <span className="mt-1 block text-xs leading-5 text-slate-400">
                          {country.primaryLabel}: {country.primaryFormatted}
                          {country.primaryYear ? ` · ${country.primaryYear}` : ""}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <a
                          href={`/news/country/${country.iso3}`}
                          className="rounded-full bg-emerald-400 px-3 py-2 text-xs font-black text-slate-950"
                        >
                          Country news
                        </a>

                        <a
                          href={`/country/${country.iso3}`}
                          className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-black text-white"
                        >
                          Country data
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4 text-sm text-slate-400">
                    국가별 뉴스 링크를 표시할 공식 지표가 충분하지 않습니다.
                  </div>
                )}
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
