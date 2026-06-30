import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology | Trade Dependency Atlas",
  description:
    "Methodology for Trade Dependency Atlas official country dependency, trade, tariff, and energy indicators.",
};

const layers = [
  {
    title: "1. Annual structural baseline",
    titleKo: "1. 연간 구조 지표 기준",
    source: "World Bank WDI",
    explanation:
      "World Bank annual indicators are used as the stable baseline for long-term country comparison. These indicators are not expected to update in real time.",
    explanationKo:
      "World Bank 연간 지표는 장기 국가 비교를 위한 안정적인 기준값으로 사용합니다. 이 지표들은 실시간으로 갱신되는 데이터가 아닙니다.",
  },
  {
    title: "2. Latest official trade enrichment",
    titleKo: "2. 최신 공식 무역 데이터 보강",
    source: "UN Comtrade",
    explanation:
      "UN Comtrade data is used to enrich import, export, fuel import, and food/agricultural import indicators where official reported values are available.",
    explanationKo:
      "UN Comtrade 데이터는 공식 보고값이 확인되는 경우 수입, 수출, 연료 수입, 식량/농산물 수입 지표를 보강하는 데 사용합니다.",
  },
  {
    title: "3. Tariff layer",
    titleKo: "3. 관세 데이터 레이어",
    source: "WITS / WTO / World Bank fallback",
    explanation:
      "Tariff data can lag behind trade data because it depends on country reporting and specialized tariff databases. The latest available official year is shown.",
    explanationKo:
      "관세 데이터는 국가별 보고와 전문 관세 데이터베이스에 의존하기 때문에 무역 데이터보다 최신 연도가 늦을 수 있습니다. 따라서 공식 최신 제공 연도를 그대로 표시합니다.",
  },
  {
    title: "4. Energy layer",
    titleKo: "4. 에너지 데이터 레이어",
    source: "EIA Open Data",
    explanation:
      "EIA international energy data is used as a supplementary layer. The available energy products and latest years vary by country.",
    explanationKo:
      "EIA 국제 에너지 데이터는 보조 레이어로 사용합니다. 제공되는 에너지 항목과 최신 연도는 국가별로 다를 수 있습니다.",
  },
];

const priorityRules = [
  {
    title: "Use official 2026 data if available",
    titleKo: "공식 2026 데이터가 있으면 우선 사용",
    description:
      "Because 2026 is still an active year, finalized annual data is usually limited. Monthly, quarterly, or forecast data must be separated from finalized annual indicators.",
    descriptionKo:
      "2026년은 진행 중인 연도이므로 확정 연간 데이터는 제한적일 수 있습니다. 월간, 분기, 전망 데이터는 확정 연간 지표와 구분해 표시합니다.",
  },
  {
    title: "Use official 2025 data when 2026 is unavailable",
    titleKo: "2026 공식값이 없으면 2025 공식값 사용",
    description:
      "Trade data may have 2025 official values earlier than development indicators. These are displayed in a separate latest trade layer.",
    descriptionKo:
      "무역 데이터는 개발지표보다 2025 공식값이 먼저 제공될 수 있습니다. 이 값은 최신 무역 데이터 레이어에서 별도로 표시합니다.",
  },
  {
    title: "Use 2024 or latest available year when newer values do not exist",
    titleKo: "2025도 없으면 2024 또는 해당 지표 최신 제공 연도 사용",
    description:
      "Some indicators, especially tariffs and logistics, may not have 2025/2026 values. The site displays the latest official source year instead of generating estimates.",
    descriptionKo:
      "관세와 물류 같은 일부 지표는 2025/2026 값이 없을 수 있습니다. 이 사이트는 추정값을 만들지 않고 해당 출처의 최신 공식 제공 연도를 표시합니다.",
  },
];

export default function MethodologyPage() {
  return (
    <main className="min-h-screen bg-[#070a14] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-indigo-300">
          Methodology
        </p>

        <h1 className="mt-4 max-w-4xl text-5xl font-bold leading-tight">
          출처별 최신 제공 연도를 분리해 국가별 의존도와 공급망 지표를 비교합니다.
        </h1>

        <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
          Trade Dependency Atlas는 하나의 임의 위험점수 대신, 공식 공공 데이터 출처의
          값과 제공 연도를 함께 표시합니다. 데이터가 없는 국가나 지표에는 값을
          추정해 채우지 않고, 공식 데이터 사용 가능 상태를 표시합니다.
        </p>

        <div className="mt-12 grid gap-6">
          {layers.map((layer) => (
            <article
              key={layer.title}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-300">
                    {layer.source}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">{layer.titleKo}</h2>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    {layer.explanationKo}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-400">
                    {layer.explanation}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-14 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm font-medium text-blue-300">
            Latest data priority
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            최신성 적용 기준
          </h2>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {priorityRules.map((rule) => (
              <div
                key={rule.title}
                className="rounded-2xl border border-white/10 bg-[#0b0f1c] p-5"
              >
                <p className="text-lg font-bold text-white">{rule.titleKo}</p>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {rule.descriptionKo}
                </p>
                <p className="mt-3 text-xs leading-5 text-slate-500">
                  {rule.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6">
          <p className="text-sm font-medium text-emerald-200">
            No artificial estimates
          </p>
          <h2 className="mt-2 text-2xl font-bold text-emerald-50">
            추정값을 임의로 생성하지 않습니다.
          </h2>
          <p className="mt-4 text-sm leading-7 text-emerald-50/80">
            공식값이 없는 항목은 2025나 2026으로 임의 보정하지 않습니다.
            대신 출처별 최신 공식 제공 연도와 데이터 상태를 표시합니다. 이
            방식은 사이트의 최신성을 높이면서도, 통계적 신뢰성을 유지하기 위한
            기준입니다.
          </p>
        </section>
      </section>
    </main>
  );
}
