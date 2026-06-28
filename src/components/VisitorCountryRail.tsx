"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getFlagEmoji } from "@/lib/flags";

type Language = "ko" | "en" | "ja" | "zh" | "es" | "fr" | "de";

type VisitorCountryCount = {
  country: string;
  count: number;
};

type VisitorStats = {
  configured: boolean;
  country?: string;
  total: number;
  countries: VisitorCountryCount[];
  lastUpdated: string | null;
};

const copy: Record<
  Language,
  {
    title: string;
    subtitle: string;
    total: string;
    visits: string;
    notUnique: string;
    privacy: string;
    empty: string;
    dbMissing: string;
    currentVisit: string;
  }
> = {
  ko: {
    title: "Visitors",
    subtitle: "국가별 누적 방문 횟수",
    total: "총 방문",
    visits: "회",
    notUnique: "중복 방문 포함",
    privacy: "IP 주소는 저장하지 않고 국가 코드만 집계합니다.",
    empty: "아직 방문 기록이 없습니다.",
    dbMissing: "Redis 저장소 연결 필요",
    currentVisit: "이번 접속",
  },
  en: {
    title: "Visitors",
    subtitle: "Cumulative visits by country",
    total: "Total visits",
    visits: "visits",
    notUnique: "Duplicate visits included",
    privacy: "Only country codes are counted. IP addresses are not stored.",
    empty: "No visits recorded yet.",
    dbMissing: "Redis storage required",
    currentVisit: "Current visit",
  },
  ja: {
    title: "Visitors",
    subtitle: "国別累積訪問数",
    total: "総訪問",
    visits: "回",
    notUnique: "重複訪問を含む",
    privacy: "IPアドレスは保存せず、国コードのみ集計します。",
    empty: "まだ訪問記録がありません。",
    dbMissing: "Redis保存先が必要です",
    currentVisit: "今回の接続",
  },
  zh: {
    title: "Visitors",
    subtitle: "按国家累计访问次数",
    total: "总访问",
    visits: "次",
    notUnique: "包含重复访问",
    privacy: "不存储 IP 地址，仅统计国家代码。",
    empty: "暂无访问记录。",
    dbMissing: "需要连接 Redis 存储",
    currentVisit: "本次访问",
  },
  es: {
    title: "Visitors",
    subtitle: "Visitas acumuladas por país",
    total: "Visitas totales",
    visits: "visitas",
    notUnique: "Incluye visitas duplicadas",
    privacy: "Solo se cuentan códigos de país. No se almacena la IP.",
    empty: "Aún no hay visitas registradas.",
    dbMissing: "Se requiere Redis",
    currentVisit: "Visita actual",
  },
  fr: {
    title: "Visitors",
    subtitle: "Visites cumulées par pays",
    total: "Visites totales",
    visits: "visites",
    notUnique: "Visites répétées incluses",
    privacy: "Seuls les codes pays sont comptés. L’IP n’est pas stockée.",
    empty: "Aucune visite enregistrée.",
    dbMissing: "Stockage Redis requis",
    currentVisit: "Visite actuelle",
  },
  de: {
    title: "Visitors",
    subtitle: "Kumulierte Besuche nach Land",
    total: "Gesamtbesuche",
    visits: "Besuche",
    notUnique: "Doppelte Besuche enthalten",
    privacy: "Nur Ländercodes werden gezählt. IP-Adressen werden nicht gespeichert.",
    empty: "Noch keine Besuche erfasst.",
    dbMissing: "Redis-Speicher erforderlich",
    currentVisit: "Aktueller Besuch",
  },
};

function languageToLocale(language: Language) {
  const map: Record<Language, string> = {
    ko: "ko-KR",
    en: "en-US",
    ja: "ja-JP",
    zh: "zh-CN",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
  };

  return map[language];
}

function getSavedLanguage(): Language {
  if (typeof window === "undefined") return "ko";

  const saved = localStorage.getItem("dependency-radar-language");

  if (
    saved === "ko" ||
    saved === "en" ||
    saved === "ja" ||
    saved === "zh" ||
    saved === "es" ||
    saved === "fr" ||
    saved === "de"
  ) {
    return saved;
  }

  return "ko";
}

function getCountryName(country: string, language: Language) {
  try {
    const displayNames = new Intl.DisplayNames([languageToLocale(language)], {
      type: "region",
    });

    return displayNames.of(country) ?? country;
  } catch {
    return country;
  }
}

export default function VisitorCountryRail() {
  const countedRef = useRef(false);
  const [language, setLanguage] = useState<Language>("ko");
  const [stats, setStats] = useState<VisitorStats>({
    configured: true,
    total: 0,
    countries: [],
    lastUpdated: null,
  });
  const [currentCountry, setCurrentCountry] = useState("KR");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLanguage(getSavedLanguage());

    async function registerVisit() {
      if (countedRef.current) return;
      countedRef.current = true;

      try {
        const response = await fetch("/api/visitor/register", {
          method: "POST",
          cache: "no-store",
        });

        const data = (await response.json()) as VisitorStats;

        setStats(data);

        if (data.country) {
          setCurrentCountry(data.country);
        }
      } catch {
        try {
          const response = await fetch("/api/visitor/stats", {
            cache: "no-store",
          });
          const data = (await response.json()) as VisitorStats;
          setStats(data);
        } catch {
          setStats({
            configured: false,
            total: 0,
            countries: [],
            lastUpdated: null,
          });
        }
      } finally {
        setLoading(false);
      }
    }

    registerVisit();

    function handleStorageChange() {
      setLanguage(getSavedLanguage());
    }

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const t = copy[language];

  const topCountries = useMemo(() => {
    return stats.countries.slice(0, 6);
  }, [stats.countries]);

  const maxCount = topCountries[0]?.count ?? 1;
  const currentCountryName = getCountryName(currentCountry, language);

  return (
    <aside className="pointer-events-none fixed right-3 top-24 z-40 hidden w-48 2xl:block">
      <div className="pointer-events-auto rounded-2xl border border-white/10 bg-[#0b0f1c]/90 p-3 text-white shadow-2xl backdrop-blur">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <p className="text-base font-bold">{t.title}</p>
            <p className="text-xs text-slate-500">{t.subtitle}</p>
          </div>

          <div className="text-2xl">🌍</div>
        </div>

        <div className="mb-3 rounded-xl border border-white/10 bg-white/[0.04] p-3">
          <p className="text-xs text-slate-500">{t.total}</p>
          <p className="mt-1 text-2xl font-bold">
            {stats.total.toLocaleString(languageToLocale(language))}
          </p>
          <p className="mt-1 text-xs text-slate-500">{t.notUnique}</p>
        </div>

        <div className="mb-3 rounded-xl border border-indigo-300/20 bg-indigo-400/10 p-3">
          <p className="text-xs text-indigo-200">{t.currentVisit}</p>
          <p className="mt-1 text-sm font-semibold">
            {getFlagEmoji(currentCountry)} {currentCountryName}
          </p>
        </div>

        {!stats.configured ? (
          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-xs leading-5 text-amber-100">
            {t.dbMissing}
          </div>
        ) : loading ? (
          <div className="text-sm text-slate-500">Loading...</div>
        ) : topCountries.length === 0 ? (
          <div className="text-sm text-slate-500">{t.empty}</div>
        ) : (
          <div className="space-y-2">
            {topCountries.map((item) => {
              const width = Math.max(8, (item.count / maxCount) * 100);
              const countryName = getCountryName(item.country, language);

              return (
                <div key={item.country}>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="truncate text-xs">
                      {getFlagEmoji(item.country)} {countryName}
                    </span>
                    <span className="text-[11px] font-semibold text-indigo-200">
                      {item.count.toLocaleString(languageToLocale(language))}
                    </span>
                  </div>

                  <div className="h-1 rounded-full bg-white/10">
                    <div
                      className="h-1 rounded-full bg-indigo-400"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="mt-3 text-[10px] leading-4 text-slate-500">{t.privacy}</p>
      </div>
    </aside>
  );
}
