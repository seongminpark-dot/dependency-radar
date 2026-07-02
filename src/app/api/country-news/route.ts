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
  relevanceScore: number;
};

type CountryProfile = {
  displayName: string;
  aliases: string[];
  koAliases: string[];
  exclude: string[];
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

const countryProfiles: Record<string, CountryProfile> = {
  KOR: {
    displayName: "South Korea",
    aliases: ["South Korea", "Republic of Korea", "Korea", "Korean", "Seoul"],
    koAliases: ["대한민국", "한국", "서울", "국내"],
    exclude: ["North Korea", "DPRK", "Pyongyang", "Kim Jong", "북한", "평양"],
  },
  JPN: {
    displayName: "Japan",
    aliases: ["Japan", "Japanese", "Tokyo"],
    koAliases: ["일본", "도쿄"],
    exclude: [],
  },
  USA: {
    displayName: "United States",
    aliases: ["United States", "U.S.", "US economy", "American trade", "Washington"],
    koAliases: ["미국", "미 경제", "워싱턴"],
    exclude: [],
  },
  CHN: {
    displayName: "China",
    aliases: ["China", "Chinese", "Beijing"],
    koAliases: ["중국", "베이징"],
    exclude: [],
  },
  DEU: {
    displayName: "Germany",
    aliases: ["Germany", "German", "Berlin"],
    koAliases: ["독일", "베를린"],
    exclude: [],
  },
  GBR: {
    displayName: "United Kingdom",
    aliases: ["United Kingdom", "UK", "Britain", "British", "London"],
    koAliases: ["영국", "런던"],
    exclude: [],
  },
  FRA: {
    displayName: "France",
    aliases: ["France", "French", "Paris"],
    koAliases: ["프랑스", "파리"],
    exclude: [],
  },
  IND: {
    displayName: "India",
    aliases: ["India", "Indian", "New Delhi"],
    koAliases: ["인도", "뉴델리"],
    exclude: [],
  },
  CAN: {
    displayName: "Canada",
    aliases: ["Canada", "Canadian", "Ottawa"],
    koAliases: ["캐나다", "오타와"],
    exclude: [],
  },
  AUS: {
    displayName: "Australia",
    aliases: ["Australia", "Australian", "Canberra"],
    koAliases: ["호주", "오스트레일리아"],
    exclude: [],
  },
  BRA: {
    displayName: "Brazil",
    aliases: ["Brazil", "Brazilian", "Brasilia"],
    koAliases: ["브라질"],
    exclude: [],
  },
  MEX: {
    displayName: "Mexico",
    aliases: ["Mexico", "Mexican"],
    koAliases: ["멕시코"],
    exclude: [],
  },
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

function normalizeCountryName(countryName: string) {
  return countryName
    .replace(/Korea, Rep\./gi, "South Korea")
    .replace(/Korea, Dem\. People's Rep\./gi, "North Korea")
    .replace(/, Rep\./gi, "")
    .replace(/, Dem\. Rep\./gi, "")
    .trim();
}

function getCountryProfile(iso3: string, countryName: string): CountryProfile {
  const code = iso3.toUpperCase();

  if (countryProfiles[code]) {
    return countryProfiles[code];
  }

  const displayName = normalizeCountryName(countryName || code);

  return {
    displayName,
    aliases: [displayName],
    koAliases: [displayName],
    exclude: [],
  };
}

function getHostname(url: string, domain?: string) {
  if (domain) return domain.replace(/^www\./, "").toLowerCase();

  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function matchesDomain(hostname: string, domains: string[]) {
  return domains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
}

function isBlocked(hostname: string) {
  return blockedFragments.some((fragment) => hostname.includes(fragment));
}

function getSourceProfile(hostname: string): {
  isTrustedSource: boolean;
  sourceTier: SourceTier;
  sourceScore: number;
} {
  if (matchesDomain(hostname, officialDomains)) {
    return { isTrustedSource: true, sourceTier: "official", sourceScore: 100 };
  }

  if (matchesDomain(hostname, majorNewsDomains)) {
    return { isTrustedSource: true, sourceTier: "major", sourceScore: 90 };
  }

  if (matchesDomain(hostname, regionalTrustedDomains)) {
    return { isTrustedSource: true, sourceTier: "regional", sourceScore: 80 };
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

function containsAny(text: string, terms: string[]) {
  const lower = text.toLowerCase();

  return terms.some((term) => {
    const cleaned = term.toLowerCase().trim();
    return cleaned.length > 1 && lower.includes(cleaned);
  });
}

function classifyIssue(title: string) {
  const lower = title.toLowerCase();

  if (lower.includes("oil") || lower.includes("crude") || lower.includes("fuel") || lower.includes("energy") || lower.includes("gas") || lower.includes("석유") || lower.includes("에너지")) {
    return { issueSlug: "oil-shock", issueLabel: "Oil Shock", issueHref: "/issues/oil-shock" };
  }

  if (lower.includes("food") || lower.includes("grain") || lower.includes("wheat") || lower.includes("rice") || lower.includes("crop") || lower.includes("식량") || lower.includes("곡물")) {
    return { issueSlug: "food-import-risk", issueLabel: "Food Import Risk", issueHref: "/issues/food-import-risk" };
  }

  if (lower.includes("tariff") || lower.includes("customs") || lower.includes("trade war") || lower.includes("duty") || lower.includes("관세")) {
    return { issueSlug: "tariff-pressure", issueLabel: "Tariff Pressure", issueHref: "/issues/tariff-pressure" };
  }

  return { issueSlug: "supply-chain", issueLabel: "Trade / Supply Chain", issueHref: "/issues/supply-chain" };
}

function getTopicTerms(language: SiteLanguage) {
  if (language === "ko") {
    return '(무역 OR 수입 OR 수출 OR 관세 OR 에너지 OR 석유 OR 식량 OR 공급망 OR 물류 OR 해운 OR 항만)';
  }

  return '(trade OR imports OR exports OR tariff OR energy OR oil OR food OR "supply chain" OR logistics OR shipping OR port OR freight)';
}

function quote(value: string) {
  return `"${value.replace(/"/g, "")}"`;
}

function buildGdeltUrl(iso3: string, countryName: string, language: SiteLanguage) {
  const sourceLanguage = sourceLanguageMap[language] ?? "english";
  const profile = getCountryProfile(iso3, countryName);
  const aliases = language === "ko"
    ? [...profile.koAliases, ...profile.aliases]
    : profile.aliases;

  const countryQuery = aliases.slice(0, 7).map(quote).join(" OR ");
  const topicQuery = getTopicTerms(language);

  const params = new URLSearchParams({
    query: `(${countryQuery}) ${topicQuery} sourcelang:${sourceLanguage}`,
    mode: "artlist",
    format: "json",
    maxrecords: "30",
    sort: "datedesc",
    timespan: "2weeks",
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

function calculateRelevanceScore(article: {
  title: string;
  url: string;
  sourceScore: number;
  publishedAt: string;
}, profile: CountryProfile) {
  const title = article.title.toLowerCase();
  const url = article.url.toLowerCase();

  const aliases = [...profile.aliases, ...profile.koAliases];
  const titleHit = containsAny(title, aliases);
  const urlHit = containsAny(url, aliases);

  const issueHit = containsAny(title, [
    "trade",
    "import",
    "export",
    "tariff",
    "energy",
    "oil",
    "food",
    "supply",
    "logistics",
    "shipping",
    "무역",
    "수입",
    "수출",
    "관세",
    "에너지",
    "공급망",
    "물류",
  ]);

  const publishedTime = new Date(article.publishedAt).getTime();
  const ageDays = Number.isNaN(publishedTime)
    ? 14
    : Math.max(0, (Date.now() - publishedTime) / (1000 * 60 * 60 * 24));

  const recencyScore = Math.max(0, 14 - ageDays);

  return (
    article.sourceScore +
    (titleHit ? 60 : 0) +
    (urlHit ? 20 : 0) +
    (issueHit ? 15 : 0) +
    recencyScore
  );
}

function fallbackArticles(iso3: string, countryName: string, language: SiteLanguage): CountryNewsArticle[] {
  const profile = getCountryProfile(iso3, countryName);
  const encoded = encodeURIComponent(`${profile.displayName} trade energy tariff supply chain`);

  const titlePrefix =
    language === "ko"
      ? `${profile.displayName} 관련 공식 뉴스`
      : `${profile.displayName} trade and supply-chain news`;

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
      relevanceScore: 90,
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
      relevanceScore: 90,
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
      relevanceScore: 85,
    },
  ];
}

async function fetchCountryNews(iso3: string, countryName: string, language: SiteLanguage) {
  const profile = getCountryProfile(iso3, countryName);

  const urls =
    language === "en"
      ? [buildGdeltUrl(iso3, countryName, "en")]
      : [buildGdeltUrl(iso3, countryName, language), buildGdeltUrl(iso3, countryName, "en")];

  const responses = await Promise.allSettled(
    urls.map(async (url) => {
      const response = await fetchWithTimeout(url, 6500);

      if (!response.ok) return [];

      const data = (await response.json()) as GdeltResponse;

      return (data.articles ?? [])
        .filter((article) => article.url && article.title)
        .map((article) => {
          const source = getHostname(article.url ?? "", article.domain);
          const sourceProfile = getSourceProfile(source);
          const issue = classifyIssue(article.title ?? "");

          const baseArticle = {
            title: cleanTitle(article.title ?? ""),
            url: article.url ?? "",
            image: article.socialimage || fallbackImage,
            source: source || "news source",
            sourceCountry: article.sourcecountry || "",
            publishedAt: parseGdeltDate(article.seendate),
            language: article.language || sourceLanguageMap[language],
            ...issue,
            ...sourceProfile,
            relevanceScore: 0,
          };

          return {
            ...baseArticle,
            relevanceScore: calculateRelevanceScore(baseArticle, profile),
          };
        })
        .filter((article) => {
          const combinedText = `${article.title} ${article.url}`;

          const hasCountryMention =
            containsAny(combinedText, profile.aliases) ||
            containsAny(combinedText, profile.koAliases);

          return (
            article.title.length > 12 &&
            article.url.startsWith("http") &&
            !isBlocked(article.source) &&
            !containsAny(combinedText, profile.exclude) &&
            (hasCountryMention || article.isTrustedSource)
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
        if (b.relevanceScore !== a.relevanceScore) return b.relevanceScore - a.relevanceScore;
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
