const indicators = [
  {
    name: "Energy net imports",
    code: "EG.IMP.CONS.ZS",
    meaning:
      "Energy imports, net (% of energy use). Positive values can indicate net import dependence; negative values can indicate net exports.",
  },
  {
    name: "Fuel import share",
    code: "TM.VAL.FUEL.ZS.UN",
    meaning:
      "Fuel imports as a share of merchandise imports.",
  },
  {
    name: "Food import share",
    code: "TM.VAL.FOOD.ZS.UN",
    meaning:
      "Food imports as a share of merchandise imports.",
  },
  {
    name: "Imports/GDP",
    code: "NE.IMP.GNFS.ZS",
    meaning:
      "Imports of goods and services as a share of GDP.",
  },
  {
    name: "Total imports USD",
    code: "NE.IMP.GNFS.CD",
    meaning:
      "Imports of goods and services in current US dollars.",
  },
  {
    name: "Tariff rate",
    code: "TM.TAX.MRCH.WM.AR.ZS",
    meaning:
      "Tariff rate, weighted mean, all products.",
  },
  {
    name: "Logistics index",
    code: "LP.LPI.OVRL.XQ",
    meaning:
      "Logistics Performance Index overall score.",
  },
];

export default function SourcesPage() {
  return (
    <main className="min-h-screen bg-[#070914] px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl">
        <a href="/" className="text-sm text-indigo-300 hover:text-white">
          ← Back to Dependency Radar
        </a>

        <h1 className="mt-8 text-4xl font-bold">Data Sources</h1>

        <p className="mt-4 max-w-3xl leading-7 text-slate-300">
          Dependency Radar uses public statistical indicators from the World Bank API
          and map boundary data from Natural Earth through the world-atlas package.
          Some values are reformatted, translated, filtered, sorted, or visualized
          for readability.
        </p>

        <div className="mt-8 space-y-6 text-slate-300">
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-bold text-white">
              World Bank indicator codes
            </h2>

            <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead className="bg-white/[0.06] text-slate-400">
                  <tr>
                    <th className="px-5 py-4">Indicator</th>
                    <th className="px-5 py-4">World Bank code</th>
                    <th className="px-5 py-4">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {indicators.map((indicator) => (
                    <tr key={indicator.code} className="border-t border-white/10">
                      <td className="px-5 py-4 font-semibold text-white">
                        {indicator.name}
                      </td>
                      <td className="px-5 py-4 font-mono text-indigo-200">
                        {indicator.code}
                      </td>
                      <td className="px-5 py-4 text-slate-300">
                        {indicator.meaning}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              License note: World Bank datasets are generally available under
              Creative Commons Attribution 4.0 unless a specific dataset states
              otherwise.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-bold text-white">Map boundary data</h2>
            <p className="mt-3 leading-7">
              The world map visualization uses boundary data from Natural Earth
              through the world-atlas package. Natural Earth map data is public
              domain. Attribution is still shown for transparency.
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
