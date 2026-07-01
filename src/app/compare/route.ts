import { NextResponse } from "next/server";
import countries from "world-countries";

export const dynamic = "force-dynamic";

type CountryRecord = {
  cca2?: string;
  cca3?: string;
  name?: {
    common?: string;
  };
};

type LocalCountryRow = Record<string, unknown>;

type StatValue = {
  value: number | null;
  year: string;
};

type MetricConfig = {
  key: string;
  labelKo: string;
  labelEn: string;
  unit: "%" | "index" | "usd" | "count";
  noteKo: string;
};

const metricConfigs: MetricConfig[] = [
  {
    key: "importsGdp",
    labelKo: "수입/GDP",
    labelEn: "Imports/GDP",
    unit: "%",
    noteKo: "경제 규모 대비 수입 의존도",
  },
  {
    key: "fuelImportShare",
    labelKo: "연료 수입 비중",
    labelEn: "Fuel import share",
    unit: "%",
    noteKo: "총 수입 중 연료가 차지하는 비중",
  },
  {
    key: "foodImportShare",
    labelKo: "식량 수입 비중",
    labelEn: "Food import share",
    unit: "%",
    noteKo: "총 수입 중 식량/농산물이 차지하는 비중",
  },
  {
    key: "energyImportPercent",
    labelKo: "에너지 순수입",
    labelEn: "Net energy imports",
    unit: "%",
    noteKo: "에너지 수입 노출도 참고 지표",
  },
  {
    key: "tariffRate",
    labelKo: "관세율",
    labelEn: "Tariff rate",
    unit: "%",
    noteKo: "가중평균 또는 fallback 관세 지표",
  },
  {
    key: "logisticsIndex",
    labelKo: "물류지수",
    labelEn: "Logistics index",
    unit: "index",
    noteKo: "물류 성과 참고 지표",
  },
  {
    key: "importUsd",
    labelKo: "총 수입액",
    labelEn: "Import value",
    unit: "usd",
    noteKo: "공식 출처 기준 총 수입액",
  },
];

const countryMeta = new Map(
  (countries as CountryRecord[])
    .filter((country) => country.cca3 && country.cca2)
    .map((country) => [
      country.cca3!.toUpperCase(),
      {
        iso2: country.cca2!.toUpperCase(),
        name: country.name?.common ?? country.cca3!,
      },
    ])
);

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function getFlagEmoji(iso2: string) {
  if (!iso2 || iso2.length !== 2) return "";

  return iso2
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
}

function getStringValue(row: LocalCountryRow | null | undefined, keys: string[]) {
  if (!row) return "";

  for (const key of keys) {
    const value = row[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function isCountryRow(value: unknown): value is LocalCountryRow {
  if (!value || typeof value !== "object") return false;

  const row = value as LocalCountryRow;
  const iso3 = getStringValue(row, ["iso3", "cca3", "countryiso3code"]);

  if (!iso3) return false;

  return metricConfigs.some((metric) => {
    const stat = row[metric.key];
    return Boolean(stat && typeof stat === "object");
  });
}

function findRowsInValue(value: unknown, depth = 0): LocalCountryRow[] {
  if (depth > 3) return [];

  if (Array.isArray(value)) {
    if (value.some(isCountryRow)) {
      return value.filter(isCountryRow);
    }

    for (const item of value) {
      const nested = findRowsInValue(item, depth + 1);
      if (nested.length > 0) return nested;
    }

    return [];
  }

  if (value && typeof value === "object") {
    const objectValue = value as Record<string, unknown>;

    for (const key of ["rows", "data", "countries", "countryRows", "worldBankRows"]) {
      const nested = findRowsInValue(objectValue[key], depth + 1);
      if (nested.length > 0) return nested;
    }
  }

  return [];
}

async function getLocalWorldBankRows() {
  try {
    const module = await import("@/lib/worldBank");
    const values = Object.values(module as Record<string, unknown>);

    for (const value of values) {
      const rows = findRowsInValue(value);
      if (rows.length > 0) return rows;
    }

    for (const value of values) {
      if (typeof value !== "function") continue;

      try {
        const result = await (value as () => unknown | Promise<unknown>)();
        const rows = findRowsInValue(result);

        if (rows.length > 0) return rows;
      } catch {
        // 일부 함수는 인자가 필요할 수 있어서 무시
      }
    }

    return [];
  } catch {
    return [];
  }
}

function readStat(row: LocalCountryRow | null | undefined, key: string): StatValue {
  if (!row) return { value: null, year: "" };

  const raw = row[key];

  if (raw === null || raw === undefined) return { value: null, year: "" };

  if (typeof raw === "number") {
    return Number.isFinite(raw) ? { value: raw, year: "" } : { value: null, year: "" };
  }

  if (typeof raw !== "object") return { value: null, year: "" };

  const stat = raw as Record<string, unknown>;
  const numberValue = Number(stat.value);

  if (!Number.isFinite(numberValue)) {
    return { value: null, year: "" };
  }

  const year =
    typeof stat.year === "string" || typeof stat.year === "number"
      ? String(stat.year)
      : "";

  return {
    value: numberValue,
    year,
  };
}

function getRowName(row: LocalCountryRow | null | undefined, iso3: string) {
  const meta = countryMeta.get(iso3);

  return (
    getStringValue(row, ["name", "countryName", "displayName", "nameEn"]) ||
    meta?.name ||
    iso3
  );
}

function getRowIso2(row: LocalCountryRow | null | undefined, iso3: string) {
  return (
    getStringValue(row, ["iso2", "cca2"]) ||
    countryMeta.get(iso3)?.iso2 ||
    ""
  );
}

function formatStat(stat: StatValue, unit: MetricConfig["unit"]) {
  if (stat.value === null) return "—";

  if (unit === "usd") {
    const billion = stat.value / 1_000_000_000;

    return `US$${billion.toLocaleString("ko-KR", {
      maximumFractionDigits: 2,
    })}B`;
  }

  if (unit === "%") {
    return `${stat.value.toLocaleString("ko-KR", {
      maximumFractionDigits: 2,
    })}%`;
  }

  return stat.value.toLocaleString("ko-KR", {
    maximumFractionDigits: 2,
  });
}

function differenceText(left: StatValue, right: StatValue, unit: MetricConfig["unit"]) {
  if (left.value === null || right.value === null) return "비교 불가";

  const diff = left.value - right.value;
  const abs = Math.abs(diff);

  const formatted =
    unit === "%"
      ? `${abs.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}%p`
      : unit === "usd"
        ? `US$${(abs / 1_000_000_000).toLocaleString("ko-KR", {
            maximumFractionDigits: 2,
          })}B`
        : abs.toLocaleString("ko-KR", { maximumFractionDigits: 2 });

  if (diff === 0) return "차이 없음";

  return diff > 0 ? `왼쪽이 ${formatted} 높음` : `오른쪽이 ${formatted} 높음`;
}

function optionHtml(rows: LocalCountryRow[], selected: string) {
  const sorted = [...rows]
    .map((row) => {
      const iso3 = getStringValue(row, ["iso3", "cca3", "countryiso3code"]).toUpperCase();
      const meta = countryMeta.get(iso3);

      if (!iso3 || !meta) return null;

      return {
        iso3,
        name: getRowName(row, iso3),
        iso2: getRowIso2(row, iso3),
      };
    })
    .filter((item): item is { iso3: string; name: string; iso2: string } => Boolean(item))
    .sort((a, b) => a.name.localeCompare(b.name));

  return sorted
    .map(
      (item) =>
        `<option value="${escapeHtml(item.iso3)}" ${
          item.iso3 === selected ? "selected" : ""
        }>${getFlagEmoji(item.iso2)} ${escapeHtml(item.name)} · ${escapeHtml(
          item.iso3
        )}</option>`
    )
    .join("");
}

function metricRowsHtml(
  leftRow: LocalCountryRow | null,
  rightRow: LocalCountryRow | null
) {
  return metricConfigs
    .map((metric) => {
      const left = readStat(leftRow, metric.key);
      const right = readStat(rightRow, metric.key);

      return `
        <tr>
          <td>
            <strong>${escapeHtml(metric.labelKo)}</strong>
            <span>${escapeHtml(metric.noteKo)}</span>
          </td>
          <td>
            <strong>${formatStat(left, metric.unit)}</strong>
            <span>${left.year ? `제공 연도 ${escapeHtml(left.year)}` : "연도 없음"}</span>
          </td>
          <td>
            <strong>${formatStat(right, metric.unit)}</strong>
            <span>${right.year ? `제공 연도 ${escapeHtml(right.year)}` : "연도 없음"}</span>
          </td>
          <td>${escapeHtml(differenceText(left, right, metric.unit))}</td>
        </tr>
      `;
    })
    .join("");
}

function quickLinksHtml() {
  const pairs = [
    ["KOR", "USA", "한국 vs 미국"],
    ["KOR", "JPN", "한국 vs 일본"],
    ["USA", "CHN", "미국 vs 중국"],
    ["DEU", "FRA", "독일 vs 프랑스"],
    ["JPN", "CHN", "일본 vs 중국"],
  ];

  return pairs
    .map(
      ([a, b, label]) =>
        `<a href="/compare?a=${a}&b=${b}">${escapeHtml(label)}</a>`
    )
    .join("");
}

async function compareHtml(request: Request) {
  const url = new URL(request.url);
  const rows = await getLocalWorldBankRows();

  const leftIso = (url.searchParams.get("a") || "KOR").toUpperCase();
  const rightIso = (url.searchParams.get("b") || "USA").toUpperCase();

  const leftRow =
    rows.find(
      (row) =>
        getStringValue(row, ["iso3", "cca3", "countryiso3code"]).toUpperCase() ===
        leftIso
    ) ?? null;

  const rightRow =
    rows.find(
      (row) =>
        getStringValue(row, ["iso3", "cca3", "countryiso3code"]).toUpperCase() ===
        rightIso
    ) ?? null;

  const leftName = getRowName(leftRow, leftIso);
  const rightName = getRowName(rightRow, rightIso);
  const leftIso2 = getRowIso2(leftRow, leftIso);
  const rightIso2 = getRowIso2(rightRow, rightIso);

  const optionsLeft = optionHtml(rows, leftIso);
  const optionsRight = optionHtml(rows, rightIso);

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(leftName)} vs ${escapeHtml(rightName)} | Trade Dependency Atlas</title>
  <meta name="description" content="두 국가의 무역, 에너지, 관세, 물류, 수입 의존도 지표를 공식 데이터 기준으로 비교합니다." />
  <style>
    body {
      margin: 0;
      background: #070a14;
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    main {
      max-width: 1180px;
      margin: 0 auto;
      padding: 80px 24px;
    }
    a {
      color: inherit;
    }
    .back {
      display: inline-block;
      margin-bottom: 34px;
      color: #cbd5e1;
      text-decoration: none;
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 16px;
      padding: 12px 16px;
    }
    .label {
      color: #67e8f9;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: .22em;
      text-transform: uppercase;
      margin: 0;
    }
    h1 {
      max-width: 900px;
      font-size: clamp(38px, 6vw, 64px);
      line-height: 1.05;
      letter-spacing: -0.05em;
      margin: 22px 0;
    }
    .intro {
      max-width: 820px;
      color: #cbd5e1;
      font-size: 18px;
      line-height: 1.75;
    }
    .panel {
      margin-top: 34px;
      border: 1px solid rgba(255,255,255,.1);
      background: rgba(255,255,255,.045);
      border-radius: 28px;
      padding: 26px;
    }
    form {
      display: grid;
      grid-template-columns: 1fr 1fr auto;
      gap: 12px;
      align-items: end;
    }
    label {
      display: grid;
      gap: 8px;
      color: #94a3b8;
      font-size: 13px;
      font-weight: 700;
    }
    select {
      width: 100%;
      min-height: 50px;
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,.12);
      background: #0b0f1c;
      color: white;
      padding: 0 14px;
      font-size: 15px;
    }
    button {
      min-height: 50px;
      border: 0;
      border-radius: 16px;
      background: #34d399;
      color: #06130d;
      font-weight: 900;
      padding: 0 18px;
      cursor: pointer;
    }
    .country-head {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
      margin-top: 28px;
    }
    .country-card {
      border: 1px solid rgba(255,255,255,.1);
      background: #0b0f1c;
      border-radius: 24px;
      padding: 24px;
    }
    .country-card p {
      margin: 0;
      color: #94a3b8;
    }
    .country-card h2 {
      margin: 10px 0 0;
      font-size: 30px;
    }
    .table-wrap {
      margin-top: 28px;
      overflow-x: auto;
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 24px;
    }
    table {
      width: 100%;
      min-width: 860px;
      border-collapse: collapse;
      background: rgba(255,255,255,.025);
    }
    th,
    td {
      border-bottom: 1px solid rgba(255,255,255,.08);
      padding: 18px;
      text-align: left;
      vertical-align: top;
    }
    th {
      color: #c7d2fe;
      font-size: 13px;
      background: rgba(255,255,255,.04);
    }
    td strong {
      display: block;
      color: white;
      font-size: 16px;
    }
    td span {
      display: block;
      margin-top: 6px;
      color: #64748b;
      font-size: 12px;
      line-height: 1.45;
    }
    .quick {
      margin-top: 28px;
    }
    .quick div {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 14px;
    }
    .quick a {
      display: inline-block;
      border: 1px solid rgba(255,255,255,.1);
      background: #0b0f1c;
      border-radius: 16px;
      padding: 12px 14px;
      text-decoration: none;
      color: #e2e8f0;
      font-size: 14px;
      font-weight: 700;
    }
    .notice {
      margin-top: 28px;
      border: 1px solid rgba(96,165,250,.28);
      background: rgba(59,130,246,.12);
      border-radius: 24px;
      padding: 18px;
      color: #dbeafe;
      line-height: 1.65;
      font-size: 14px;
    }
    @media (max-width: 760px) {
      form,
      .country-head {
        grid-template-columns: 1fr;
      }
    }
  
    .site-nav {
      position: sticky;
      top: 0;
      z-index: 50;
      border-bottom: 1px solid rgba(255,255,255,.1);
      background: rgba(7,10,20,.86);
      backdrop-filter: blur(16px);
    }
    .site-nav-inner {
      max-width: 1180px;
      margin: 0 auto;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
    }
    .site-brand {
      color: #fff;
      text-decoration: none;
      font-size: 17px;
      font-weight: 850;
      letter-spacing: -0.02em;
    }
    .site-menu {
      display: flex;
      align-items: center;
      gap: 18px;
      flex-wrap: wrap;
    }
    .site-menu a {
      color: #cbd5e1;
      text-decoration: none;
      font-size: 14px;
      font-weight: 700;
    }
    .site-menu a:hover {
      color: #fff;
    }
    @media (max-width: 760px) {
      .site-nav-inner {
        align-items: flex-start;
        flex-direction: column;
      }
      .site-menu {
        gap: 10px;
      }
      .site-menu a {
        border: 1px solid rgba(255,255,255,.1);
        border-radius: 999px;
        padding: 8px 11px;
        background: rgba(255,255,255,.04);
        font-size: 12px;
      }
    }

  </style>
</head>
<body>
  <header class="site-nav">
    <div class="site-nav-inner">
      <a class="site-brand" href="/">Trade Dependency Atlas</a>
      <nav class="site-menu" aria-label="Main navigation">
        <a href="/#country-search">국가 검색</a>
        <a href="/topics">주제별 통계</a>
        <a href="/compare?a=KOR&b=USA">국가 비교</a>
        <a href="/sources">출처</a>
      </nav>
    </div>
  </header>

  <main>
    <a class="back" href="/">← 홈으로</a>
    <p class="label">Country comparison</p>
    <h1>${getFlagEmoji(leftIso2)} ${escapeHtml(leftName)} vs ${getFlagEmoji(
      rightIso2
    )} ${escapeHtml(rightName)}</h1>
    <p class="intro">
      두 국가의 무역, 에너지, 관세, 물류, 수입 의존도 지표를 공식 데이터 기준으로 비교합니다.
      값은 각 출처가 제공하는 최신 공식 연도 기준이며, 없는 값은 임의로 채우지 않습니다.
    </p>

    <section class="panel">
      <form method="GET" action="/compare">
        <label>
          왼쪽 국가
          <select name="a">${optionsLeft}</select>
        </label>
        <label>
          오른쪽 국가
          <select name="b">${optionsRight}</select>
        </label>
        <button type="submit">비교하기</button>
      </form>

      <div class="country-head">
        <div class="country-card">
          <p>Left country</p>
          <h2>${getFlagEmoji(leftIso2)} ${escapeHtml(leftName)}</h2>
          <p>${escapeHtml(leftIso)}</p>
        </div>
        <div class="country-card">
          <p>Right country</p>
          <h2>${getFlagEmoji(rightIso2)} ${escapeHtml(rightName)}</h2>
          <p>${escapeHtml(rightIso)}</p>
        </div>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>지표</th>
              <th>${escapeHtml(leftName)}</th>
              <th>${escapeHtml(rightName)}</th>
              <th>차이</th>
            </tr>
          </thead>
          <tbody>
            ${metricRowsHtml(leftRow, rightRow)}
          </tbody>
        </table>
      </div>

      <div class="notice">
        이 비교표는 World Bank 기반 장기 구조 지표와 저장된 공식 데이터 구조를 우선 사용합니다.
        UN Comtrade, EIA, WITS/WTO의 최신 보조 레이어는 각 국가 상세 페이지에서 함께 확인할 수 있습니다.
      </div>
    </section>

    <section class="quick">
      <h2>빠른 비교</h2>
      <div>${quickLinksHtml()}</div>
    </section>
  </main>
</body>
</html>`;
}

export async function GET(request: Request) {
  return new NextResponse(await compareHtml(request), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
    },
  });
}
