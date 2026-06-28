import { Redis } from "@upstash/redis";

export type VisitorCountryCount = {
  country: string;
  count: number;
};

const COUNTRY_HASH_KEY = "dependency-radar:visitor:countries";
const TOTAL_KEY = "dependency-radar:visitor:total";
const LAST_UPDATED_KEY = "dependency-radar:visitor:last-updated";

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  return new Redis({
    url,
    token,
  });
}

function normalizeCountry(country?: string | null) {
  const code = (country ?? "XX").trim().toUpperCase();

  if (/^[A-Z]{2}$/.test(code)) {
    return code;
  }

  return "XX";
}

export async function incrementCountryVisit(countryCode: string) {
  const redis = getRedis();
  const country = normalizeCountry(countryCode);

  if (!redis) {
    return {
      configured: false,
      country,
      total: 0,
      countries: [] as VisitorCountryCount[],
      lastUpdated: null as string | null,
    };
  }

  await redis.hincrby(COUNTRY_HASH_KEY, country, 1);
  const total = await redis.incr(TOTAL_KEY);
  const lastUpdated = new Date().toISOString();

  await redis.set(LAST_UPDATED_KEY, lastUpdated);

  const countries = await getVisitorCountries();

  return {
    configured: true,
    country,
    total,
    countries,
    lastUpdated,
  };
}

export async function getVisitorStats() {
  const redis = getRedis();

  if (!redis) {
    return {
      configured: false,
      total: 0,
      countries: [] as VisitorCountryCount[],
      lastUpdated: null as string | null,
    };
  }

  const [total, countries, lastUpdated] = await Promise.all([
    redis.get<number>(TOTAL_KEY),
    getVisitorCountries(),
    redis.get<string>(LAST_UPDATED_KEY),
  ]);

  return {
    configured: true,
    total: Number(total ?? 0),
    countries,
    lastUpdated: lastUpdated ?? null,
  };
}

async function getVisitorCountries() {
  const redis = getRedis();

  if (!redis) {
    return [] as VisitorCountryCount[];
  }

  const raw = await redis.hgetall<Record<string, number | string>>(
    COUNTRY_HASH_KEY
  );

  if (!raw) {
    return [] as VisitorCountryCount[];
  }

  return Object.entries(raw)
    .map(([country, count]) => ({
      country: normalizeCountry(country),
      count: Number(count ?? 0),
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);
}
