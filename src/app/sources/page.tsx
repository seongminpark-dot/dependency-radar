export default function SourcesPage() {
  return (
    <main className="min-h-screen bg-[#070914] px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <a href="/" className="text-sm text-indigo-300 hover:text-white">
          ← Back to Dependency Radar
        </a>

        <h1 className="mt-8 text-4xl font-bold">Data Sources</h1>

        <div className="mt-8 space-y-6 text-slate-300">
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-bold text-white">World Bank Open Data</h2>
            <p className="mt-3 leading-7">
              Dependency Radar uses selected indicators from the World Bank API.
              Some values may be reformatted, translated, filtered, sorted, or
              visualized for readability.
            </p>
            <p className="mt-3 text-sm text-slate-400">
              License note: World Bank datasets are generally available under
              Creative Commons Attribution 4.0 unless a specific dataset states
              otherwise.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-bold text-white">Map boundary data</h2>
            <p className="mt-3 leading-7">
              The world map visualization uses boundary data from Natural Earth
              through the world-atlas package.
            </p>
            <p className="mt-3 text-sm text-slate-400">
              Natural Earth map data is public domain. Attribution is still
              shown for transparency.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-bold text-white">No endorsement</h2>
            <p className="mt-3 leading-7">
              Dependency Radar is not affiliated with, sponsored by, or endorsed
              by The World Bank, Natural Earth, OpenStreetMap, or any other data
              provider.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-bold text-white">Contact</h2>
            <p className="mt-3 leading-7">
              For data corrections, collaboration, or service inquiries, contact:
            </p>
            <a
              href="mailto:kevinsmp123@gmail.com"
              className="mt-3 inline-block text-lg font-semibold text-indigo-200 hover:text-white"
            >
              kevinsmp123@gmail.com
            </a>
          </section>
        </div>
      </div>
    </main>
  );
}
