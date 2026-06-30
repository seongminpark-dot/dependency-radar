"use client";

type Language = "ko" | "en" | "ja" | "zh" | "es" | "fr" | "de";

const copy = {
  ko: {
    label: "Official data architecture",
    title: "공식 데이터 레이어를 분리해 최신성과 신뢰성을 함께 제공합니다.",
    subtitle:
      "Trade Dependency Atlas는 하나의 임의 점수로 국가를 평가하지 않고, 출처별 공식 지표를 분리해 보여줍니다. 각 데이터베이스의 최신 제공 연도는 서로 다를 수 있습니다.",
    worldBankRole: "장기 연간 구조 지표",
    worldBankDesc:
      "수입/GDP, 에너지 의존도, 물류지수 등 국가별 구조 비교의 기준 데이터입니다.",
    comtradeRole: "최신 공식 무역 데이터",
    comtradeDesc:
      "총 수입, 총 수출, 연료 수입, 식량/농산물 수입 등 상품무역 데이터를 보강합니다.",
    witsRole: "관세 데이터",
    witsDesc:
      "WITS, WTO, UNCTAD TRAINS, World Bank fallback 기반으로 관세율을 보강합니다.",
    eiaRole: "국제 에너지 데이터",
    eiaDesc:
      "EIA Open Data 기반으로 석유, 총에너지, 천연가스 등 에너지 지표를 보조합니다.",
    sources: "출처 보기",
    methodology: "분석 기준 보기",
    noEstimates: "추정값을 임의 생성하지 않음",
    latestLogic: "2026 → 2025 → 2024 순으로 공식 제공값 우선 적용",
  },
  en: {
    label: "Official data architecture",
    title: "Official data layers are separated for both freshness and reliability.",
    subtitle:
      "Trade Dependency Atlas does not rank countries with a single arbitrary score. It separates official indicators by source, because the latest available year can differ across databases.",
    worldBankRole: "Annual structural baseline",
    worldBankDesc:
      "Used for long-term country comparison such as imports/GDP, dependency, logistics, and structural indicators.",
    comtradeRole: "Latest official trade data",
    comtradeDesc:
      "Enriches merchandise imports, exports, fuel imports, and food/agricultural imports.",
    witsRole: "Tariff data",
    witsDesc:
      "Supplements tariff indicators through WITS, WTO, UNCTAD TRAINS, and World Bank fallback data.",
    eiaRole: "International energy data",
    eiaDesc:
      "Adds supplementary energy indicators from EIA Open Data, including petroleum, total energy, and natural gas.",
    sources: "View sources",
    methodology: "View methodology",
    noEstimates: "No artificial estimates",
    latestLogic: "Official values are prioritized in the order 2026 → 2025 → 2024",
  },
  ja: {
    label: "Official data architecture",
    title: "公式データレイヤーを分離して最新性と信頼性を両立します。",
    subtitle:
      "Trade Dependency Atlasは単一の任意スコアではなく、公式指標を出典別に分けて表示します。",
    worldBankRole: "年次構造指標",
    worldBankDesc: "長期的な国家比較の基準データです。",
    comtradeRole: "最新公式貿易データ",
    comtradeDesc: "輸入、輸出、燃料、食料輸入を補強します。",
    witsRole: "関税データ",
    witsDesc: "WITS/WTO/World Bank fallbackで関税指標を補強します。",
    eiaRole: "国際エネルギーデータ",
    eiaDesc: "EIA Open Dataによる補助エネルギー指標です。",
    sources: "出典を見る",
    methodology: "方法論を見る",
    noEstimates: "推定値を作成しません",
    latestLogic: "公式値を 2026 → 2025 → 2024 の順に優先します",
  },
  zh: {
    label: "Official data architecture",
    title: "通过分离官方数据层，同时保证最新性与可靠性。",
    subtitle: "Trade Dependency Atlas 按来源分离官方指标，而不是使用单一任意评分。",
    worldBankRole: "年度结构指标",
    worldBankDesc: "用于长期国家结构比较。",
    comtradeRole: "最新官方贸易数据",
    comtradeDesc: "补充进口、出口、燃料和食品/农产品贸易指标。",
    witsRole: "关税数据",
    witsDesc: "通过 WITS/WTO/World Bank fallback 补充关税指标。",
    eiaRole: "国际能源数据",
    eiaDesc: "来自 EIA Open Data 的补充能源指标。",
    sources: "查看来源",
    methodology: "查看方法",
    noEstimates: "不生成任意估计值",
    latestLogic: "官方值按 2026 → 2025 → 2024 优先",
  },
  es: {
    label: "Official data architecture",
    title: "Las capas oficiales se separan para combinar actualidad y fiabilidad.",
    subtitle: "Trade Dependency Atlas separa indicadores oficiales por fuente.",
    worldBankRole: "Base estructural anual",
    worldBankDesc: "Base para comparación estructural de largo plazo.",
    comtradeRole: "Comercio oficial reciente",
    comtradeDesc: "Importaciones, exportaciones, combustibles y alimentos.",
    witsRole: "Datos arancelarios",
    witsDesc: "Complemento de aranceles con WITS/WTO/World Bank.",
    eiaRole: "Datos energéticos internacionales",
    eiaDesc: "Indicadores energéticos suplementarios desde EIA.",
    sources: "Ver fuentes",
    methodology: "Ver metodología",
    noEstimates: "Sin estimaciones artificiales",
    latestLogic: "Valores oficiales priorizados 2026 → 2025 → 2024",
  },
  fr: {
    label: "Official data architecture",
    title: "Les couches officielles séparent fraîcheur et fiabilité.",
    subtitle: "Trade Dependency Atlas sépare les indicateurs officiels par source.",
    worldBankRole: "Base structurelle annuelle",
    worldBankDesc: "Base de comparaison structurelle à long terme.",
    comtradeRole: "Commerce officiel récent",
    comtradeDesc: "Importations, exportations, carburants et aliments.",
    witsRole: "Données tarifaires",
    witsDesc: "Tarifs via WITS/WTO/World Bank fallback.",
    eiaRole: "Données énergétiques internationales",
    eiaDesc: "Indicateurs énergétiques supplémentaires via EIA.",
    sources: "Voir les sources",
    methodology: "Voir la méthode",
    noEstimates: "Pas d’estimations artificielles",
    latestLogic: "Valeurs officielles priorisées 2026 → 2025 → 2024",
  },
  de: {
    label: "Official data architecture",
    title: "Offizielle Datenebenen verbinden Aktualität und Verlässlichkeit.",
    subtitle: "Trade Dependency Atlas trennt offizielle Indikatoren nach Quellen.",
    worldBankRole: "Jährliche Strukturindikatoren",
    worldBankDesc: "Langfristige strukturelle Vergleichsdaten.",
    comtradeRole: "Aktuelle offizielle Handelsdaten",
    comtradeDesc: "Importe, Exporte, Brennstoffe und Lebensmittel.",
    witsRole: "Zolldaten",
    witsDesc: "Zollindikatoren über WITS/WTO/World Bank fallback.",
    eiaRole: "Internationale Energiedaten",
    eiaDesc: "Zusätzliche Energieindikatoren der EIA.",
    sources: "Quellen ansehen",
    methodology: "Methodik ansehen",
    noEstimates: "Keine künstlichen Schätzwerte",
    latestLogic: "Offizielle Werte priorisiert 2026 → 2025 → 2024",
  },
};

function SourceCard({
  name,
  role,
  description,
  accent,
}: {
  name: string;
  role: string;
  description: string;
  accent: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0b0f1c] p-6">
      <div className={`mb-5 h-1 w-14 rounded-full ${accent}`} />
      <p className="text-sm font-semibold text-white">{name}</p>
      <p className="mt-2 text-lg font-bold text-slate-100">{role}</p>
      <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}

export default function OfficialSourceOverview({
  language,
}: {
  language: Language;
}) {
  const t = copy[language] ?? copy.en;

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-300">
              {t.label}
            </p>
            <h2 className="mt-4 max-w-4xl text-4xl font-bold leading-tight text-white">
              {t.title}
            </h2>
            <p className="mt-4 max-w-4xl text-base leading-7 text-slate-300">
              {t.subtitle}
            </p>
          </div>

          <div className="grid gap-3">
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
              <p className="text-sm font-semibold text-emerald-100">
                {t.noEstimates}
              </p>
            </div>
            <div className="rounded-2xl border border-blue-400/20 bg-blue-400/10 p-4">
              <p className="text-sm font-semibold text-blue-100">
                {t.latestLogic}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          <SourceCard
            name="World Bank WDI"
            role={t.worldBankRole}
            description={t.worldBankDesc}
            accent="bg-blue-400"
          />
          <SourceCard
            name="UN Comtrade"
            role={t.comtradeRole}
            description={t.comtradeDesc}
            accent="bg-emerald-400"
          />
          <SourceCard
            name="WITS / WTO"
            role={t.witsRole}
            description={t.witsDesc}
            accent="bg-cyan-400"
          />
          <SourceCard
            name="EIA"
            role={t.eiaRole}
            description={t.eiaDesc}
            accent="bg-amber-400"
          />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="/sources"
            className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white hover:bg-white/[0.1]"
          >
            {t.sources} →
          </a>
          <a
            href="/methodology"
            className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white hover:bg-white/[0.1]"
          >
            {t.methodology} →
          </a>
        </div>
      </div>
    </section>
  );
}
