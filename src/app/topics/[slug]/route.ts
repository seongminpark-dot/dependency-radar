import { NextResponse } from "next/server";
import countries from "world-countries";
import { getTopic, topics, type Topic } from "@/lib/topicContent";

export const dynamic = "force-dynamic";

type WorldBankRow = {
  countryiso3code?: string;
  date?: string;
  value?: number | null;
  country?: {
    value?: string;
  };
};

type CountryRecord = {
  cca2?: string;
  cca3?: string;
  name?: {
    common?: string;
  };
};

type LocalCountryRow = Record<string, unknown>;

type RankingItem = {
  iso3: string;
  iso2: string;
  countryName: string;
  value: number;
  year: string;
  source: string;
};

const validCountries = new Map(
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

function formatValue(value: number, unit: Topic["rankingUnit"]) {
  const formatted = value.toLocaleString("ko-KR", {
    maximumFractionDigits: 2,
  });

  if (unit === "%") return `${formatted}%`;
  if (unit === "usd") return `US$${formatted}`;

  return formatted;
}

function isUsefulRankingValue(value: unknown) {
  if (value === null || value === undefined || value === "") return false;

  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) return false;

  return numberValue > 0;
}

function getStringValue(row: LocalCountryRow, keys: string[]) {
  for (const key of keys) {
    const value = row[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function readLocalStat(row: LocalCountryRow, key: string) {
  const raw = row[key];

  if (!raw || typeof raw !== "object") return null;

  const stat = raw as Record<string, unknown>;

  if (!isUsefulRankingValue(stat.value)) return null;

  return {
    value: Number(stat.value),
    year:
      typeof stat.year === "string" || typeof stat.year === "number"
        ? String(stat.year)
        : "",
  };
}

function isCountryRow(value: unknown): value is LocalCountryRow {
  if (!value || typeof value !== "object") return false;

  const row = value as LocalCountryRow;
  const iso3 = getStringValue(row, ["iso3", "cca3", "countryiso3code"]);

  if (!iso3) return false;

  return [
    "energyImportPercent",
    "fuelImportShare",
    "foodImportShare",
    "importsGdp",
    "tariffRate",
    "logisticsIndex",
  ].some((key) => {
    const stat = row[key];
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
        // 일부 함수는 인자가 필요할 수 있으므로 무시
      }
    }

    return [];
  } catch {
    return [];
  }
}

function getLocalRanking(rows: LocalCountryRow[], topic: Topic) {
  return rows
    .map((row) => {
      const iso3 = getStringValue(row, ["iso3", "cca3", "countryiso3code"]).toUpperCase();
      const country = validCountries.get(iso3);
      const stat = readLocalStat(row, topic.statKey);

      if (!country || !stat) return null;

      const name =
        getStringValue(row, ["name", "countryName", "displayName", "nameEn"]) ||
        country.name;

      return {
        iso3,
        iso2: country.iso2,
        countryName: name,
        value: stat.value,
        year: stat.year,
        source: "World Bank WDI local dataset",
      };
    })
    .filter((item): item is RankingItem => Boolean(item))
    .sort((a, b) => b.value - a.value)
    .slice(0, 20);
}

async function fetchWorldBankRows(topic: Topic, query: string) {
  const indicator = encodeURIComponent(topic.indicatorCode);
  const url = `https://api.worldbank.org/v2/country/all/indicator/${indicator}?${query}`;

  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "User-Agent": "Trade Dependency Atlas",
      },
    });

    if (!response.ok) return [];

    const json = await response.json();

    return Array.isArray(json?.[1]) ? (json[1] as WorldBankRow[]) : [];
  } catch {
    return [];
  }
}

function rowsToApiRanking(rows: WorldBankRow[], topic: Topic) {
  const latestByCountry = new Map<string, RankingItem>();

  for (const row of rows) {
    const iso3 = row.countryiso3code?.toUpperCase() ?? "";
    const country = validCountries.get(iso3);

    if (!country) continue;
    if (!isUsefulRankingValue(row.value)) continue;

    const value = Number(row.value);
    const year = row.date ?? "";
    const previous = latestByCountry.get(iso3);

    if (!previous || Number(year) > Number(previous.year || 0)) {
      latestByCountry.set(iso3, {
        iso3,
        iso2: country.iso2,
        countryName: country.name,
        value,
        year,
        source: "World Bank API",
      });
    }
  }

  return Array.from(latestByCountry.values())
    .sort((a, b) => b.value - a.value)
    .slice(0, 20);
}

async function fetchWorldBankRanking(topic: Topic) {
  const localRows = await getLocalWorldBankRows();
  const localRanking = getLocalRanking(localRows, topic);

  if (localRanking.length > 0) {
    return localRanking;
  }

  const queries = [
    "format=json&per_page=20000&MRNEV=1",
    "format=json&per_page=20000&date=2010:2026",
    "format=json&per_page=20000&date=2000:2026",
  ];

  for (const query of queries) {
    const rows = await fetchWorldBankRows(topic, query);
    const ranking = rowsToApiRanking(rows, topic);

    if (ranking.length > 0) {
      return ranking;
    }
  }

  return [];
}

function fallbackRankingHtml(topic: Topic) {
  return `
    <section class="box wide">
      <h2>${escapeHtml(topic.rankingTitleKo)}</h2>
      <p class="muted">
        이 지표는 현재 국가별 최신 공식값 목록을 충분히 확보하지 못했습니다.
        값을 임의로 채우지 않고, 국가 상세 페이지와 공식 출처 기준 설명을 우선 표시합니다.
      </p>
      <div class="fallback-grid">
        <a href="/country/KOR">🇰🇷 대한민국 상세 보기</a>
        <a href="/country/USA">🇺🇸 United States 상세 보기</a>
        <a href="/country/JPN">🇯🇵 Japan 상세 보기</a>
        <a href="/country/CHN">🇨🇳 China 상세 보기</a>
      </div>
    </section>
  `;
}

function rankingHtml(topic: Topic, ranking: RankingItem[]) {
  if (ranking.length === 0) {
    return fallbackRankingHtml(topic);
  }

  const rows = ranking
    .map(
      (item, index) => `
        <a class="rank-row" href="/country/${item.iso3}">
          <div>
            <p class="rank-name">#${index + 1} ${getFlagEmoji(item.iso2)} ${escapeHtml(
              item.countryName
            )}</p>
            <p class="rank-meta">${item.iso3} · 제공 연도 ${escapeHtml(
              item.year || "—"
            )} · ${escapeHtml(item.source)}</p>
          </div>
          <strong>${formatValue(item.value, topic.rankingUnit)}</strong>
        </a>
      `
    )
    .join("");

  return `
    <section class="box wide">
      <div class="section-head">
        <div>
          <p class="small-label">Official ranking</p>
          <h2>${escapeHtml(topic.rankingTitleKo)}</h2>
        </div>
        <p class="source-pill">${escapeHtml(topic.indicatorNameKo)} · ${escapeHtml(
          topic.indicatorCode
        )}</p>
      </div>
      <p class="muted">
        아래 순위는 공식 출처에서 확인 가능한 최신 비어 있지 않은 값 기준입니다.
        국가별 최신 연도는 다를 수 있으며, 값이 없는 국가는 순위에서 제외됩니다.
      </p>
      <div class="rank-list">
        ${rows}
      </div>
    </section>
  `;
}

async function topicHtml(slug: string) {
  const topic = getTopic(slug);

  if (!topic) return null;

  const ranking = await fetchWorldBankRanking(topic);

  const questions = topic.questionsKo
    .map((question) => `<li>${escapeHtml(question)}</li>`)
    .join("");

  const indicators = topic.indicatorsKo
    .map((indicator) => `<span>${escapeHtml(indicator)}</span>`)
    .join("");

  const otherTopics = topics
    .filter((item) => item.slug !== topic.slug)
    .map((item) => `<a href="/topics/${item.slug}">${escapeHtml(item.titleKo)}</a>`)
    .join("");

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(topic.titleEn)} | Trade Dependency Atlas</title>
  <meta name="description" content="${escapeHtml(topic.descriptionEn)}" />
  <style>
    body {
      margin: 0;
      background: #070a14;
      color: #fff;
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
    .label,
    .small-label {
      color: #67e8f9;
      font-size: 13px;
      font-weight: 700;
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
      max-width: 850px;
      color: #cbd5e1;
      font-size: 18px;
      line-height: 1.75;
    }
    .notice {
      margin-top: 34px;
      border: 1px solid rgba(96,165,250,.28);
      background: rgba(59,130,246,.12);
      border-radius: 28px;
      padding: 24px;
      color: #dbeafe;
      line-height: 1.7;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 22px;
      margin-top: 36px;
    }
    .box {
      border: 1px solid rgba(255,255,255,.1);
      background: rgba(255,255,255,.045);
      border-radius: 28px;
      padding: 26px;
    }
    .wide {
      margin-top: 36px;
    }
    .box h2 {
      margin: 0 0 18px;
      font-size: 24px;
    }
    li {
      margin: 12px 0;
      color: #cbd5e1;
      line-height: 1.6;
    }
    .chips,
    .fallback-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .chips span,
    .links a,
    .fallback-grid a {
      display: inline-block;
      border: 1px solid rgba(255,255,255,.1);
      background: #0b0f1c;
      border-radius: 16px;
      padding: 12px 14px;
      color: #e2e8f0;
      text-decoration: none;
      font-size: 14px;
      font-weight: 650;
    }
    .section-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 18px;
      margin-bottom: 16px;
    }
    .source-pill {
      margin: 0;
      border: 1px solid rgba(255,255,255,.1);
      background: #0b0f1c;
      border-radius: 999px;
      padding: 10px 14px;
      color: #cbd5e1;
      font-size: 12px;
      white-space: nowrap;
    }
    .muted {
      color: #94a3b8;
      line-height: 1.7;
    }
    .rank-list {
      margin-top: 20px;
      display: grid;
      gap: 10px;
    }
    .rank-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
      text-decoration: none;
      border: 1px solid rgba(255,255,255,.1);
      background: #0b0f1c;
      border-radius: 18px;
      padding: 16px 18px;
      transition: background .15s ease, transform .15s ease;
    }
    .rank-row:hover {
      background: rgba(255,255,255,.075);
      transform: translateY(-1px);
    }
    .rank-name {
      margin: 0;
      color: white;
      font-weight: 750;
    }
    .rank-meta {
      margin: 5px 0 0;
      color: #64748b;
      font-size: 13px;
    }
    .rank-row strong {
      color: #c7d2fe;
      font-size: 18px;
      white-space: nowrap;
    }
    .cta {
      margin-top: 36px;
      border: 1px solid rgba(16,185,129,.28);
      background: rgba(16,185,129,.12);
      border-radius: 28px;
      padding: 26px;
    }
    .cta a {
      display: inline-block;
      margin-top: 18px;
      margin-right: 10px;
      border-radius: 16px;
      background: #34d399;
      color: #06130d;
      text-decoration: none;
      font-weight: 800;
      padding: 12px 16px;
    }
    .links {
      margin-top: 36px;
    }
    .links div {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 14px;
    }
    @media (max-width: 760px) {
      .grid {
        grid-template-columns: 1fr;
      }
      .section-head {
        flex-direction: column;
      }
      .rank-row {
        align-items: flex-start;
        flex-direction: column;
      }
    }
  </style>
</head>
<body>
  <main>
    <a class="back" href="/topics">← Topics</a>
    <p class="label">${escapeHtml(topic.label)}</p>
    <h1>${escapeHtml(topic.titleKo)}</h1>
    <p class="intro">${escapeHtml(topic.descriptionKo)}</p>

    <section class="notice">
      <strong>공식 출처 기준</strong><br />
      ${escapeHtml(topic.sourceKo)}<br />
      ${escapeHtml(topic.sourceEn)}
    </section>

    ${rankingHtml(topic, ranking)}

    <section class="grid">
      <div class="box">
        <h2>이 페이지에서 확인할 질문</h2>
        <ul>${questions}</ul>
      </div>
      <div class="box">
        <h2>관련 지표</h2>
        <div class="chips">${indicators}</div>
      </div>
    </section>

    <section class="cta">
      <h2>국가별 상세 데이터로 이동</h2>
      <p>
        특정 국가의 실제 수치가 필요하면 국가 상세 페이지에서 World Bank,
        UN Comtrade, WITS/WTO, EIA 데이터를 함께 확인하세요.
      </p>
      <a href="/">국가 검색하기 →</a>
      <a href="/country/KOR">대한민국 보기</a>
      <a href="/country/USA">United States 보기</a>
    </section>

    <section class="links">
      <h2>다른 주제 보기</h2>
      <div>${otherTopics}</div>
    </section>
  </main>
</body>
</html>`;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const html = await topicHtml(slug);

  if (!html) {
    return new NextResponse("Topic not found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
    },
  });
}
