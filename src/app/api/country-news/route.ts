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

const supportedLanguages: SiteLanguage[] = ["ko", "en", "ja", "zh", "es", "fr", "de"];

const sourceLanguageMap: Record<SiteLanguage, string> = {
  ko: "korean",
  en: "english",
  ja: "japanese",
  zh: "chinese",
  es: "spanish",
  fr: "french",
  de: "german",
};

const officialDomains = [
  "worldbank.org",
  "imf.org",
  "oecd.org",
  "wto.org",
  "unctad.org",
  "fao.org",
  "iea.org",
  "ec.europa.eu",
  "europa.eu",
  "commerce.gov",
  "ustr.gov",
];

const majorNewsDomains = [
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
  "economist.com",
];

const regionalTrustedDomains = [
  "koreaherald.com",
  "koreatimes.co.kr",
  "yna.co.kr",
  "japantimes.co.jp",
  "scmp.com",
  "straitstimes.com",
];

const blockedDomainFragments = [
  "blogspot.",
  "wordpress.",
  "medium.com",
  "substack.com",
  "pressrelease",
  "prnewswire",
  "globenewswire",
  "einnews",
];

const fallbackImage =
  "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=1200&q=80";

function normalizeLanguage(value: string | null): SiteLanguage {
  if (value && supportedLanguages.includes(value as SiteLanguage)) {
    return value as SiteLanguage;
  }

  return "en";
}

function getHostname(url: string, domain?: string) {
  if (domain) {
    return domain.replace(/^www\./, "").toLowerCase();
  }

  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function matchesDomain(hostname: string, domains: string[]) {
  return domains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
}

function isBlockedDomain(hostname: string) {
  return blockedDomainFragments.some((fragment) => hostname.includes(fragment));
}

function getSourceProfile(hostname: string): {
  isTrustedSource: boolean;
  sourceTier: SourceTier;
  sourceScore: number;
} {
  if (matchesDomain(hostname, officialDomains)) {
    return {
      isTrustedSource: true,
      sourceTier: "official",
      sourceScore: 100,
    };
  }

  if (matchesDomain(hostname, majorNewsDomains)) {
    return {
      isTrustedSource: true,
      sourceTier: "major",
      sourceScore: 90,
    };
  }

  if (matchesDomain(hostname, regionalTrustedDomains)) {
    return {
      isTrustedSource: true,
      sourceTier: "regional",
      sourceScore: 80,
    };
  }

  return {
    isTrustedSource: false,
    sourceTier: "general",
    sourceScore: 40,
  };
}

function parseGdeltDate(value?: string) {
  if (!value) return new Date().toISOString();

  if (/^\d{14}$/.test(value)) {
    const year = value.slice(0, 4);
    const month = value.slice(4, 6);
    const day = value.slice(6, 8);
    const hour = value.slice(8, 10);
    const minute = value.slice(10, 12);
    const second = value.slice(12, 14);

    return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }

  return date.toISOString();
}

function cleanTitle(title: string) {
  return title.replace(/\s+/g, " ").trim();
}

function normalizeCountryName(iso3: string, countryName: string) {
  const code = iso3.toUpperCase();

  const map: Record<string, string> = {
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

  return map[code] ?? countryName.replace(/, Rep\./gi, "").replace(/, Dem\. Rep\./gi, "").trim();
}

function getCountryAliases(iso3: string, countryName: string) {
  const normalized = normalizeCountryName(iso3, countryName);

  const aliases = [normalized];

  if (iso3.toUpperCase() === "KOR") aliases.push("Korea", "South Korean");
  if (iso3.toUpperCase() === "USA") aliases.push("US", "U.S.", "America");
  if (iso3.toUpperCase() === "GBR") aliases.push("UK", "Britain");

  return Array.from(new Set(aliases.filter(Boolean)));
}

function quote(value: string) {
  return `"${value.replace(/"/g, "")}"`;
}

function classifyIssue(title: string) {
  const lower = title.toLowerCase();

  if (
    lower.includes("oil") ||
    lower.includes("crude") ||
    lower.includes("fuel") ||
    lower.includes("energy") ||
    lower.includes("gas")
  ) {
    return {
      issueSlug: "oil-shock",
      issueLabel: "Oil Shock",
      issueHref: "/issues/oil-shock",
    };
  }

  if (
    lower.includes("food") ||
    lower.includes("grain") ||
    lower.includes("wheat") ||
    lower.includes("rice") ||
    lower.includes("crop")
  ) {
    return {
      issueSlug: "food-import-risk",
      issueLabel: "Food Import Risk",
      issueHref: "/issues/food-import-risk",
    };
  }

  if (
    lower.includes("tariff") ||
    lower.includes("customs") ||
    lower.includes("trade war") ||
    lower.includes("duty")
  ) {
    return {
      issueSlug: "tariff-pressure",
      issueLabel: "Tariff Pressure",
      issueHref: "/issues/tariff-pressure",
    };
  }

  if (
    lower.includes("supply chain") ||
    lower.includes("shipping") ||
    lower.includes("logistics") ||
    lower.includes("freight") ||
    lower.includes("port")
  ) {
    return {
      issueSlug: "supply-chain",
      issueLabel: "Supply Chain",
      issueHref: "/issues/supply-chain",
    };
  }

  return {
    issueSlug: "supply-chain",
    issueLabel: "Trade / Supply Chain",
    issueHref: "/issues/supply-chain",
  };
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
    maxrecords: "24",
    sort: "datedesc",
    timespan: "1week",
  });

  return `https://api.gdeltproject.org/api/v2/doc/doc?${params.toString()}`;
}

async function fetchCountryNews(
  iso3: string,
  countryName: string,
  language: SiteLanguage
): Promise<CountryNewsArticle[]> {
  const urls =
    language === "en"
      ? [buildGdeltUrl(iso3, countryName, "en")]
      : [buildGdeltUrl(iso3, countryName, language), buildGdeltUrl(iso3, countryName, "en")];

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) continue;

      const data = (await response.json()) as GdeltResponse;
      const articles = data.articles ?? [];

      const normalized = articles
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
            !isBlockedDomain(article.source)
          );
        });

      if (normalized.length > 0) {
        return normalized;
      }
    } catch {
      continue;
    }
  }

  return [];
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

  if (!iso3 && !countryName) {
    return NextResponse.json(
      {
        ok: false,
        language,
        generatedAt: new Date().toISOString(),
        articles: [],
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }

  try {
    const articles = dedupeArticles(await fetchCountryNews(iso3, countryName, language))
      .sort((a, b) => {
        if (b.sourceScore !== a.sourceScore) {
          return b.sourceScore - a.sourceScore;
        }

        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      })
      .slice(0, 8);

    return NextResponse.json(
      {
        ok: true,
        language,
        generatedAt: new Date().toISOString(),
        articles,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        language,
        generatedAt: new Date().toISOString(),
        articles: [],
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
