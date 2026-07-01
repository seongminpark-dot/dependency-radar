import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sources | Datlora",
  description:
    "Official data sources used by Datlora, including World Bank WDI, UN Comtrade, WITS, and EIA.",
};

const sourceGroups = [
  {
    name: "World Bank World Development Indicators",
    shortName: "World Bank WDI",
    role: "Annual structural indicators",
    roleKo: "연간 구조 지표",
    url: "https://databank.worldbank.org/source/world-development-indicators",
    description:
      "Used as the long-term baseline for country-level structural indicators such as imports/GDP, energy-related indicators, logistics, and other development indicators.",
    descriptionKo:
      "수입/GDP, 에너지 관련 지표, 물류지수 등 국가별 장기 구조 지표의 기준 데이터로 사용합니다.",
    freshness:
      "Latest years vary by country and indicator. Some indicators may be 2024, while others can be older depending on publication cycles.",
    freshnessKo:
      "최신 연도는 국가와 지표별로 다릅니다. 일부 지표는 2024가 최신일 수 있고, 발표 주기에 따라 더 오래된 연도가 표시될 수 있습니다.",
  },
  {
    name: "UN Comtrade Database",
    shortName: "UN Comtrade",
    role: "Official merchandise trade layer",
    roleKo: "공식 상품무역 데이터",
    url: "https://comtradeplus.un.org/",
    description:
      "Used to enrich trade-related indicators such as total imports, total exports, merchandise trade balance, fuel imports, and food/agricultural imports.",
    descriptionKo:
      "총 수입액, 총 수출액, 상품 무역수지, 연료 수입, 식량/농산물 수입 등 무역 관련 지표를 보강하는 데 사용합니다.",
    freshness:
      "When available, the site displays the latest official reported period. Saved official response snapshots may be used to avoid showing blank values.",
    freshnessKo:
      "공식 보고 기간이 확인되면 최신 공식 제공 기간 기준으로 표시합니다. 빈 화면을 방지하기 위해 저장된 공식 응답 스냅샷을 사용할 수 있습니다.",
  },
  {
    name: "WITS Trade Stats Tariff Data",
    shortName: "WITS / WTO",
    role: "Tariff layer",
    roleKo: "관세 데이터",
    url: "https://wits.worldbank.org/",
    description:
      "Used to supplement tariff indicators with WITS, WTO, UNCTAD TRAINS, and World Bank fallback data where available.",
    descriptionKo:
      "관세율 지표를 보강하기 위해 WITS, WTO, UNCTAD TRAINS, World Bank fallback 데이터를 사용합니다.",
    freshness:
      "Tariff data is not updated like real-time market data. Latest available years can vary significantly by country.",
    freshnessKo:
      "관세 데이터는 실시간 시장 데이터처럼 갱신되지 않습니다. 국가별로 최신 제공 연도가 크게 다를 수 있습니다.",
  },
  {
    name: "U.S. Energy Information Administration Open Data",
    shortName: "EIA",
    role: "International energy layer",
    roleKo: "국제 에너지 데이터",
    url: "https://www.eia.gov/opendata/",
    description:
      "Used as a supplementary official energy layer for international energy indicators such as petroleum, total energy, and natural gas series.",
    descriptionKo:
      "석유, 총에너지, 천연가스 등 국제 에너지 지표를 보조 공식 데이터 레이어로 표시하는 데 사용합니다.",
    freshness:
      "Energy series and latest years vary by country, product, and EIA publication schedule.",
    freshnessKo:
      "에너지 지표와 최신 연도는 국가, 상품, EIA 발표 일정에 따라 다를 수 있습니다.",
  },
];

export default function SourcesPage() {
  return (
    <main className="min-h-screen bg-[#070a14] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-indigo-300">
          Official Sources
        </p>

        <h1 className="mt-4 max-w-4xl text-5xl font-bold leading-tight">
          공식 공공 데이터 출처를 통합해 국가별 무역·에너지 의존도을 비교합니다.
        </h1>

        <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
          Datlora는 임의 점수나 추정값을 우선하지 않고, World Bank,
          UN Comtrade, WITS, EIA 같은 공식 공공 데이터 출처의 최신 제공값을
          출처별로 분리해 표시합니다. 각 지표의 최신 연도는 국가와 데이터베이스
          갱신 주기에 따라 다를 수 있습니다.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">Data principle</p>
            <p className="mt-3 text-2xl font-bold">Official-first</p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              공식 출처가 제공하는 값을 우선하며, 출처별 최신 제공 연도를 함께
              표시합니다.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">No artificial filling</p>
            <p className="mt-3 text-2xl font-bold">No estimates</p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              공식값이 없는 국가는 임의 수치를 만들지 않고 데이터 상태를
              명확히 표시합니다.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">Latest period logic</p>
            <p className="mt-3 text-2xl font-bold">2026 → 2025 → 2024</p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              공식 2026 값이 있으면 우선 사용하고, 없으면 2025, 그다음 2024
              또는 해당 지표의 최신 제공 연도를 사용합니다.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-6">
          {sourceGroups.map((source) => (
            <article
              key={source.name}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-300">
                    {source.role} · {source.roleKo}
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">{source.name}</h2>

                  <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-300">
                    {source.descriptionKo}
                  </p>

                  <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-400">
                    {source.description}
                  </p>
                </div>

                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-white/10 bg-[#0b0f1c] px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-white/[0.08]"
                >
                  Official source ↗
                </a>
              </div>

              <div className="mt-6 rounded-2xl border border-blue-400/20 bg-blue-400/10 p-5">
                <p className="text-sm font-semibold text-blue-100">
                  Latest year interpretation
                </p>
                <p className="mt-2 text-sm leading-6 text-blue-50/80">
                  {source.freshnessKo}
                </p>
                <p className="mt-2 text-sm leading-6 text-blue-50/70">
                  {source.freshness}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6">
          <h2 className="text-2xl font-bold text-amber-100">
            데이터 해석 주의
          </h2>
          <p className="mt-4 text-sm leading-7 text-amber-50/80">
            이 사이트의 정보는 교육, 연구, 비교 분석 목적입니다. 투자, 법률,
            관세, 물류, 정책, 사업 의사결정에 대한 전문 조언이 아닙니다.
            공식값은 출처 기관의 업데이트, 국가별 보고 일정, 데이터 정정에 따라
            변경될 수 있습니다.
          </p>
        </div>
      </section>
    </main>
  );
}
