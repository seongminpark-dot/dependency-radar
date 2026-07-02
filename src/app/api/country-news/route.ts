import { NextResponse } from "next/server";

type SiteLanguage = "ko" | "en" | "ja" | "zh" | "es" | "fr" | "de";

type GdeltArticle = {
  url?: string;
  title?: string;
  seendate?: string;
  socialimage?: string;
  domain?: string;
  sourcecountry?: string;
  language?: string;
};

type GdeltResponse = {
  articles?: GdeltArticle[];
};

type SourceTier = "official" | "major" | "regional" | "general";

type CountryNewsArticle = {
  title: string;
  url: string;
  image: string;
  source: string;
  sourceCountry: string;
  publishedAt: string;
  issueSlug: string;
  issueLabel: string;
  issueHref: string;
  language: string;
  isTrustedSource: boolean;
  sourceTier: SourceTier;
  sourceScore: number;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

const sourceLanguageMap: Record<SiteLanguage, string> = {
  ko: "korean",
  en: "english",
  ja: "japanese",
  zh: "chinese",
  es: "spanish",
  fr: "french",
  de: "german",
};

const fallbackImage =
  "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=1200&q=80";

const countryAliasMap: Record<string, string> = {
  KOR: "South Korea",
  USA: "United States",
  JPN: "Japan",
  CHN: "China",
  DEU: "Germany",
  GBR: "United Kingdom",
  FRA: "France",
  IND: "India",
  CAN: "Canada",
  AUS: "Australia",
  BRA: "Brazil",
  MEX: "Mexico",
  ITA: "Italy",
  ESP: "Spain",
};

const trustedDomains = [
  "reuters.com",
  "apnews.com",
  "bbc.com",
  "cnbc.com",
  "ft.com",
  "wsj.com",
  "bloomberg.com",
  "nikkei.com",
  "aljazeera.com",
  "dw.com",
  "france24.com",
  "theguardian.com",
  "worldbank.org",
  "imf.org",
  "oecd.org",
  "wto.org",
];

const blockedFragments = [
  "blogspot.",
  "wordpress.",
  "medium.com",
  "substack.com",
  "pressrelease",
  "prnewswire",
  "globenewswire",
  "einnews",
];

function normalizeLanguage(value: string | null): SiteLanguage {
  const allowed: SiteLanguage[] = ["ko", "en", "ja", "zh", "es", "fr", "de"];
  return allowed.includes(value as SiteLanguage) ? (value as SiteLanguage) : "en";
}

function normalizeCountryName(iso3: string, countryName: string) {
  const code = iso3.toUpperCase();
  return (
    countryAliasMap[code] ??
    countryName
      .replace(/, Rep\./gi, "")
      .replace(/, Dem\. Rep\./gi, "")
      .replace(/Korea, Rep\./gi, "South Korea")
      .trim()
  );
}

function getCountryAliases(iso3: string, countryName: string) {
  const normalized = normalizeCountryName(iso3, countryName);
  const aliases = [normalized];

  if (iso3 === "KOR") aliases.push("Korea", "South Korean");
  if (iso3 === "USA") aliases.push("US", "U.S.", "America");
  if (iso3 === "GBR") aliases.push("UK", "Britain");

  return Array.from(new Set(aliases.filter(Boolean)));
}

function getHostname(url: string, domain?: string) {
  if (domain) return domain.replace(/^www\./, "").toLowerCase();

  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function isTrustedSource(hostname: string) {
  return trustedDomains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
}

function isBlocked(hostname: string) {
  return blockedFragments.some((fragment) => hostname.includes(fragment));
}

function getSourceProfile(hostname: string): {
  isTrustedSource: boolean;
  sourceTier: SourceTier;
  sourceScore: number;
} {
  if (["worldbank.org", "imf.org", "oecd.org", "wto.org"].some((d) => hostname === d || hostname.endsWith(`.${d}`))) {
    return { isTrustedSource: true, sourceTier: "official", sourceScore: 100 };
  }

  if (isTrustedSource(hostname)) {
    return { isTrustedSource: true, sourceTier: "major", sourceScore: 90 };
  }

  return { isTrustedSource: false, sourceTier: "general", sourceScore: 40 };
}

function parseGdeltDate(value?: string) {
  if (!value) return new Date().toISOString();

  if (/^\d{14}$/.test(value)) {
    return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}T${value.slice(8, 10)}:${value.slice(10, 12)}:${value.slice(12, 14)}Z`;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function cleanTitle(title: string) {
  return title.replace(/\s+/g, " ").trim();
}

function classifyIssue(title: string) {
  const lower = title.toLowerCase();

  if (lower.includes("oil") || lower.includes("crude") || lower.includes("fuel") || lower.includes("energy") || lower.includes("gas")) {
    return { issueSlug: "oil-shock", issueLabel: "Oil Shock", issueHref: "/issues/oil-shock" };
  }

  if (lower.includes("food") || lower.includes("grain") || lower.includes("wheat") || lower.includes("rice") || lower.includes("crop")) {
    return { issueSlug: "food-import-risk", issueLabel: "Food Import Risk", issueHref: "/issues/food-import-risk" };
  }

  if (lower.includes("tariff") || lower.includes("customs") || lower.includes("trade war") || lower.includes("duty")) {
    return { issueSlug: "tariff-pressure", issueLabel: "Tariff Pressure", issueHref: "/issues/tariff-pressure" };
  }

  return { issueSlug: "supply-chain", issueLabel: "Trade / Supply Chain", issueHref: "/issues/supply-chain" };
}

function quote(value: string) {
  return `"${value.replace(/"/g, "")}"`;
}

function buildGdeltUrl(iso3: string, countryName: string, language: SiteLanguage) {
  const sourceLanguage = sourceLanguageMap[language] ?? "english";
  const aliases = getCountryAliases(iso3, countryName);
  const countryQuery = aliases.map(quote).join(" OR ");
  const topicQuery =
    '(trade OR imports OR exports OR tariff OR energy OR oil OR food OR "supply chain" OR logistics OR shipping OR port OR freight)';

  const params = new URLSearchParams({
    query: `(${countryQuery}) ${topicQuery} sourcelang:${sourceLanguage}`,
    mode: "artlist",
    format: "json",
    maxrecords: "20",
    sort: "datedesc",
    timespan: "1week",
  });

  return `https://api.gdeltproject.org/api/v2/doc/doc?${params.toString()}`;
}

async function fetchWithTimeout(url: string, timeoutMs: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

function fallbackArticles(iso3: string, countryName: string, language: SiteLanguage): CountryNewsArticle[] {
  const normalized = normalizeCountryName(iso3, countryName);
  const encoded = encodeURIComponent(`${normalized} trade energy tariff supply chain`);

  const titlePrefix =
    language === "ko" ? `${normalized} 관련 공식 뉴스` : `${normalized} trade and supply-chain news`;

  return [
    {
      title: `${titlePrefix} · Reuters search`,
      url: `https://www.reuters.com/search/news?blob=${encoded}`,
      image: fallbackImage,
      source: "reuters.com",
      sourceCountry: "",
      publishedAt: new Date().toISOString(),
      issueSlug: "supply-chain",
      issueLabel: "Trade / Supply Chain",
      issueHref: "/issues/supply-chain",
      language: sourceLanguageMap[language],
      isTrustedSource: true,
      sourceTier: "major",
      sourceScore: 90,
    },
    {
      title: `${titlePrefix} · AP News search`,
      url: `https://apnews.com/search?q=${encoded}`,
      image: fallbackImage,
      source: "apnews.com",
      sourceCountry: "",
      publishedAt: new Date().toISOString(),
      issueSlug: "supply-chain",
      issueLabel: "Trade / Supply Chain",
      issueHref: "/issues/supply-chain",
      language: sourceLanguageMap[language],
      isTrustedSource: true,
      sourceTier: "major",
      sourceScore: 90,
    },
    {
      title: `${titlePrefix} · Google News`,
      url: `https://news.google.com/search?q=${encoded}`,
      image: fallbackImage,
      source: "news.google.com",
      sourceCountry: "",
      publishedAt: new Date().toISOString(),
      issueSlug: "supply-chain",
      issueLabel: "Trade / Supply Chain",
      issueHref: "/issues/supply-chain",
      language: sourceLanguageMap[language],
      isTrustedSource: true,
      sourceTier: "major",
      sourceScore: 85,
    },
  ];
}

async function fetchCountryNews(iso3: string, countryName: string, language: SiteLanguage) {
  const urls =
    language === "en"
      ? [buildGdeltUrl(iso3, countryName, "en")]
      : [buildGdeltUrl(iso3, countryName, language), buildGdeltUrl(iso3, countryName, "en")];

  const responses = await Promise.allSettled(
    urls.map(async (url) => {
      const response = await fetchWithTimeout(url, 6000);

      if (!response.ok) return [];

      const data = (await response.json()) as GdeltResponse;

      return (data.articles ?? [])
        .filter((article) => article.url && article.title)
        .map((article) => {
          const source = getHostname(article.url ?? "", article.domain);
          const profile = getSourceProfile(source);
          const issue = classifyIssue(article.title ?? "");

          return {
            title: cleanTitle(article.title ?? ""),
            url: article.url ?? "",
            image: article.socialimage || fallbackImage,
            source: source || "news source",
            sourceCountry: article.sourcecountry || "",
            publishedAt: parseGdeltDate(article.seendate),
            language: article.language || sourceLanguageMap[language],
            ...issue,
            ...profile,
          };
        })
        .filter((article) => {
          return (
            article.title.length > 12 &&
            article.url.startsWith("http") &&
            !isBlocked(article.source)
          );
        });
    })
  );

  return responses.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
}

function dedupeArticles(articles: CountryNewsArticle[]) {
  const seen = new Set<string>();
  const result: CountryNewsArticle[] = [];

  for (const article of articles) {
    if (seen.has(article.url)) continue;
    seen.add(article.url);
    result.push(article);
  }

  return result;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const language = normalizeLanguage(searchParams.get("lang"));
  const iso3 = (searchParams.get("iso3") ?? "").toUpperCase();
  const countryName = searchParams.get("countryName") ?? iso3;

  try {
    const liveArticles = dedupeArticles(await fetchCountryNews(iso3, countryName, language))
      .sort((a, b) => {
        if (b.sourceScore !== a.sourceScore) return b.sourceScore - a.sourceScore;
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      })
      .slice(0, 8);

    const articles =
      liveArticles.length > 0 ? liveArticles : fallbackArticles(iso3, countryName, language);

    return NextResponse.json(
      {
        ok: true,
        language,
        generatedAt: new Date().toISOString(),
        articles,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      {
        ok: true,
        language,
        generatedAt: new Date().toISOString(),
        articles: fallbackArticles(iso3, countryName, language),
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}
