"use client";

import { useMemo, useState } from "react";
import type { CountryRow, StatValue } from "@/lib/worldBank";
import { getFlagEmoji } from "@/lib/flags";

type MetricKey =
  | "energyImportPercent"
  | "fuelImportShare"
  | "foodImportShare"
  | "importsGdp"
  | "importUsd"
  | "tariffRate"
  | "logisticsIndex";

const metricRows: {
  key: MetricKey;
  label: string;
  issue?: string;
  issueHref?: string;
  description: string;
}[] = [
  {
    key: "fuelImportShare",
    label: "Fuel import share",
    issue: "Oil Shock",
    issueHref: "/issues/oil-shock",
    description: "Fuel imports as a share of merchandise imports.",
  },
  {
    key: "foodImportShare",
    label: "Food import share",
    issue: "Food Risk",
    issueHref: "/issues/food-import-risk",
    description: "Food imports as a share of merchandise imports.",
  },
  {
    key: "tariffRate",
    label: "Tariff rate",
    issue: "Tariff Pressure",
    issueHref: "/issues/tariff-pressure",
    description: "Weighted mean tariff rate on imported goods.",
  },
  {
    key: "importsGdp",
    label: "Imports / GDP",
    issue: "Supply Chain",
    issueHref: "/issues/supply-chain",
    description: "Imports of goods and services as a share of GDP.",
  },
  {
    key: "energyImportPercent",
    label: "Energy net imports",
    description: "Net energy imports as a share of energy use.",
  },
  {
    key: "importUsd",
    label: "Total imports",
    description: "Imports of goods and services in current US dollars.",
  },
  {
    key: "logisticsIndex",
    label: "Logistics index",
    description: "World Bank Logistics Performance Index.",
  },
];

function getLatestAvailableYear(row: CountryRow) {
  const years = [
    row.energyImportPercent,
    row.fuelImportShare,
    row.foodImportShare,
    row.importsGdp,
    row.importUsd,
    row.tariffRate,
    row.logisticsIndex,
  ]
    .map((stat) => (stat.year ? Number(stat.year) : null))
    .filter((year): year is number => year !== null && !Number.isNaN(year));

  if (years.length === 0) return null;

  return Math.max(...years);
}

function formatValue(stat: StatValue, key: MetricKey) {
  if (stat.value === null) return "—";

  if (key === "importUsd") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(stat.value);
  }

  if (key === "logisticsIndex") {
    return stat.value.toLocaleString("en-US", {
      maximumFractionDigits: 2,
    });
  }

  return `${stat.value.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })}%`;
}

function getCountryName(row: CountryRow) {
  return row.name;
}

function getExposureText(row: CountryRow) {
  const items = [
    {
      label: "Oil",
      value: row.fuelImportShare.value,
    },
    {
      label: "Food",
      value: row.foodImportShare.value,
    },
    {
      label: "Tariff",
      value: row.tariffRate.value,
    },
    {
      label: "Imports/GDP",
      value: row.importsGdp.value,
    },
  ];

  const strongest = items
    .filter((item) => typeof item.value === "number")
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))[0];

  if (!strongest) return "Limited comparable data";

  return `${strongest.label} exposure stands out`;
}

function CountrySelect({
  rows,
  value,
  onChange,
  label,
}: {
  rows: CountryRow[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <label className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-transparent text-sm font-bold text-white outline-none"
      >
        {rows.map((row) => (
          <option key={row.iso3} value={row.iso3}>
            {getFlagEmoji(row.iso2)} {row.name} · {row.iso3}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function CompareClient({
  rows,
  initialIso3,
}: {
  rows: CountryRow[];
  initialIso3: string[];
}) {
  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => a.name.localeCompare(b.name));
  }, [rows]);

  const defaultSelection = initialIso3.length > 0 ? initialIso3 : ["KOR", "USA"];

  const [selectedIso3, setSelectedIso3] = useState<string[]>([
    defaultSelection[0] ?? sortedRows[0]?.iso3 ?? "",
    defaultSelection[1] ?? sortedRows[1]?.iso3 ?? "",
    defaultSelection[2] ?? "",
  ]);

  const selectedRows = selectedIso3
    .filter(Boolean)
    .map((iso3) => rows.find((row) => row.iso3 === iso3))
    .filter((row): row is CountryRow => Boolean(row));

  function changeCountry(index: number, value: string) {
    setSelectedIso3((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  }

  const shareUrl = `/compare?${selectedRows
    .map((row, index) => `${index === 0 ? "a" : index === 1 ? "b" : "c"}=${row.iso3}`)
    .join("&")}`;

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
            <a href="/compare" className="text-emerald-300">Compare</a>
            <a href="/sources" className="hover:text-white">Sources</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">
          Country Comparison
        </p>

        <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.98] tracking-[-0.075em] md:text-7xl">
          Compare country exposure with official indicators.
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          Compare trade, energy, food, tariff, logistics, and import-dependency indicators across countries. Values are shown with their latest available official source year.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <CountrySelect
              key={index}
              rows={sortedRows}
              value={selectedIso3[index] ?? ""}
              onChange={(value) => changeCountry(index, value)}
              label={`Country ${index + 1}`}
            />
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={shareUrl}
            className="rounded-full bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950"
          >
            Update compare URL
          </a>

          <a
            href="/news"
            className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white"
          >
            Open latest news
          </a>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {selectedRows.map((row) => (
            <article
              key={row.iso3}
              className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6"
            >
              <p className="text-4xl">{getFlagEmoji(row.iso2)}</p>

              <h2 className="mt-4 text-3xl font-black tracking-[-0.06em]">
                {getCountryName(row)}
              </h2>

              <p className="mt-2 text-sm font-bold text-slate-400">
                {row.region} · {row.iso3}
              </p>

              <div className="mt-5 grid gap-3">
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                    Data coverage
                  </span>
                  <strong className="mt-2 block text-xl">{row.dataCompleteness} / 7</strong>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                    Latest year
                  </span>
                  <strong className="mt-2 block text-xl">
                    {getLatestAvailableYear(row) ?? "—"}
                  </strong>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                    Reading
                  </span>
                  <strong className="mt-2 block text-sm text-emerald-200">
                    {getExposureText(row)}
                  </strong>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href={`/country/${row.iso3}`}
                  className="rounded-full bg-white px-4 py-2 text-xs font-black text-slate-950"
                >
                  Country page
                </a>

                <a
                  href={`/news/country/${row.iso3}`}
                  className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black text-white"
                >
                  Country news
                </a>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-3xl font-black tracking-[-0.06em]">
            Issue-level comparison
          </h2>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[880px] border-collapse text-left text-sm">
              <thead className="bg-white/[0.06] text-slate-400">
                <tr>
                  <th className="px-5 py-4">Indicator</th>
                  {selectedRows.map((row) => (
                    <th key={row.iso3} className="px-5 py-4">
                      {getFlagEmoji(row.iso2)} {row.name}
                    </th>
                  ))}
                  <th className="px-5 py-4">Related issue</th>
                </tr>
              </thead>

              <tbody>
                {metricRows.map((metric) => (
                  <tr key={metric.key} className="border-t border-white/10">
                    <td className="px-5 py-4">
                      <strong className="block text-white">{metric.label}</strong>
                      <span className="mt-1 block text-xs text-slate-500">
                        {metric.description}
                      </span>
                    </td>

                    {selectedRows.map((row) => {
                      const stat = row[metric.key];

                      return (
                        <td key={`${row.iso3}-${metric.key}`} className="px-5 py-4">
                          <strong className="block text-white">
                            {formatValue(stat, metric.key)}
                          </strong>
                          <span className="mt-1 block text-xs text-slate-500">
                            {stat.year ? `Year: ${stat.year}` : "No data"}
                          </span>
                        </td>
                      );
                    })}

                    <td className="px-5 py-4">
                      {metric.issueHref ? (
                        <a
                          href={metric.issueHref}
                          className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-black text-emerald-100"
                        >
                          {metric.issue}
                        </a>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs leading-6 text-slate-500">
            This comparison displays official indicator values directly. Source years may differ by country and indicator.
          </p>
        </section>
      </section>
    </main>
  );
}
