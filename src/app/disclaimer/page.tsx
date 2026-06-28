export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-[#070914] px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <a href="/" className="text-sm text-indigo-300 hover:text-white">
          ← Back to Dependency Radar
        </a>

        <h1 className="mt-8 text-4xl font-bold">Disclaimer</h1>

        <div className="mt-8 space-y-6 text-slate-300">
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-bold text-white">
              Not professional advice
            </h2>
            <p className="mt-3 leading-7">
              Dependency Radar is for informational purposes only. It is not
              investment, legal, trade, customs, logistics, or policy advice.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-bold text-white">Third-party data</h2>
            <p className="mt-3 leading-7">
              Data comes from public third-party sources. Values may be delayed,
              revised, missing, or formatted differently from the original source.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-bold text-white">No endorsement</h2>
            <p className="mt-3 leading-7">
              Data providers do not sponsor, endorse, or approve Dependency
              Radar.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
