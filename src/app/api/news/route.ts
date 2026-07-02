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

type NewsArticle = {
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

const issueQueries = [
  {
    slug: "oil-shock",
    label: "Oil Shock",
    href: "/issues/oil-shock",
    query:
      '("oil prices" OR "crude oil" OR petroleum OR "energy imports" OR "fuel imports" OR "shipping disruption")',
    fallbackImage:
      "https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "food-import-risk",
    label: "Food Import Risk",
    href: "/issues/food-import-risk",
    query:
      '("food security" OR "food prices" OR wheat OR grain OR rice OR "food imports" OR "crop exports")',
    fallbackImage:
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "tariff-pressure",
    label: "Tariff Pressure",
    href: "/issues/tariff-pressure",
    query:
      '(tariff OR tariffs OR "import duty" OR customs OR "trade war" OR "trade restrictions")',
    fallbackImage:
      "https://images.unsplash.com/photo-1494412685616-a5d310fbb07d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "supply-chain",
    label: "Supply Chain",
    href: "/issues/supply-chain",
    query:
      '("supply chain" OR shipping OR logistics OR ports OR freight OR "trade routes")',
    fallbackImage:
      "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=1200&q=80",
  },
];

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
  return domains.some((domain) => {
    return hostname === domain || hostname.endsWith(`.${domain}`);
  });
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

function buildGdeltUrl(query: string, language: SiteLanguage) {
  const sourceLanguage = sourceLanguageMap[language] ?? "english";

  const params = new URLSearchParams({
    query: `${query} sourcelang:${sourceLanguage}`,
    mode: "artlist",
    format: "json",
    maxrecords: "30",
    sort: "datedesc",
    timespan: "1week",
  });

  return `https://api.gdeltproject.org/api/v2/doc/doc?${params.toString()}`;
}

async function fetchIssueNews(
  issue: (typeof issueQueries)[number],
  language: SiteLanguage
): Promise<NewsArticle[]> {
  const urls =
    language === "en"
      ? [buildGdeltUrl(issue.query, "en")]
      : [buildGdeltUrl(issue.query, language), buildGdeltUrl(issue.query, "en")];

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

          return {
            title: cleanTitle(article.title ?? ""),
            url: article.url ?? "",
            image: article.socialimage || issue.fallbackImage,
            source: source || "news source",
            sourceCountry: article.sourcecountry || "",
            publishedAt: parseGdeltDate(article.seendate),
            issueSlug: issue.slug,
            issueLabel: issue.label,
            issueHref: issue.href,
            language: article.language || sourceLanguageMap[language],
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

function dedupeArticles(articles: NewsArticle[]) {
  const seen = new Set<string>();
  const result: NewsArticle[] = [];

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

  try {
    const results = await Promise.all(
      issueQueries.map((issue) => fetchIssueNews(issue, language))
    );

    const articles = dedupeArticles(results.flat())
      .sort((a, b) => {
        if (b.sourceScore !== a.sourceScore) {
          return b.sourceScore - a.sourceScore;
        }

        return (
          new Date(b.publishedAt).getTime() -
          new Date(a.publishedAt).getTime()
        );
      })
      .slice(0, 20);

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
