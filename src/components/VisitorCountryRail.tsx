"use client";

import { useEffect, useMemo, useState } from "react";
import { getFlagEmoji } from "@/lib/flags";

type Language = "ko" | "en" | "ja" | "zh" | "es" | "fr" | "de";

const copy: Record<
  Language,
  {
    title: string;
    subtitle: string;
    countryCode: string;
    privacy: string;
    accuracy: string;
    loading: string;
  }
> = {
  ko: {
    title: "현재 접속 국가",
    subtitle: "IP 기반 국가 추정",
    countryCode: "국가 코드",
    privacy: "IP 주소는 저장하지 않습니다.",
    accuracy: "VPN이나 학교/회사 네트워크에서는 다를 수 있습니다.",
    loading: "접속 국가 확인 중",
  },
  en: {
    title: "Current visitor country",
    subtitle: "IP-based country estimate",
    countryCode: "Country code",
    privacy: "The IP address is not stored.",
    accuracy: "VPNs or school/work networks may affect accuracy.",
    loading: "Checking country",
  },
  ja: {
    title: "現在の接続国",
    subtitle: "IPベースの国推定",
    countryCode: "国コード",
    privacy: "IPアドレスは保存しません。",
    accuracy: "VPNや学校/会社ネットワークでは異なる場合があります。",
    loading: "接続国を確認中",
  },
  zh: {
    title: "当前访问国家",
    subtitle: "基于 IP 的国家估计",
    countryCode: "国家代码",
    privacy: "不会存储 IP 地址。",
    accuracy: "VPN 或学校/公司网络可能影响准确性。",
    loading: "正在确认国家",
  },
  es: {
    title: "País del visitante",
    subtitle: "Estimación basada en IP",
    countryCode: "Código de país",
    privacy: "La dirección IP no se almacena.",
    accuracy: "VPN o redes escolares/laborales pueden afectar la precisión.",
    loading: "Comprobando país",
  },
  fr: {
    title: "Pays du visiteur",
    subtitle: "Estimation basée sur l’IP",
    countryCode: "Code pays",
    privacy: "L’adresse IP n’est pas stockée.",
    accuracy: "Un VPN ou un réseau scolaire/professionnel peut modifier le résultat.",
    loading: "Vérification du pays",
  },
  de: {
    title: "Aktuelles Besucherland",
    subtitle: "IP-basierte Länderschätzung",
    countryCode: "Ländercode",
    privacy: "Die IP-Adresse wird nicht gespeichert.",
    accuracy: "VPNs oder Schul-/Firmennetzwerke können die Genauigkeit beeinflussen.",
    loading: "Land wird geprüft",
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

export default function VisitorCountryRail() {
  const [country, setCountry] = useState("KR");
  const [language, setLanguage] = useState<Language>("ko");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLanguage(getSavedLanguage());

    async function loadCountry() {
      try {
        const response = await fetch("/api/geo", {
          cache: "no-store",
        });

        const data = await response.json();

        if (data.country) {
          setCountry(String(data.country).toUpperCase());
        }
      } catch {
        setCountry("KR");
      } finally {
        setLoading(false);
      }
    }

    loadCountry();

    function handleStorageChange() {
      setLanguage(getSavedLanguage());
    }

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const countryName = useMemo(() => {
    try {
      const displayNames = new Intl.DisplayNames([languageToLocale(language)], {
        type: "region",
      });

      return displayNames.of(country) ?? country;
    } catch {
      return country;
    }
  }, [country, language]);

  const t = copy[language];

  return (
    <aside className="pointer-events-none fixed right-5 top-28 z-40 hidden w-56 2xl:block">
      <div className="pointer-events-auto rounded-3xl border border-white/10 bg-[#0b0f1c]/90 p-5 text-white shadow-2xl backdrop-blur">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-400/10 text-2xl">
            {loading ? "🌐" : getFlagEmoji(country)}
          </div>

          <div>
            <p className="text-sm font-semibold">
              {loading ? t.loading : t.title}
            </p>
            <p className="text-xs text-slate-500">{t.subtitle}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-2xl font-bold">
            {getFlagEmoji(country)} {countryName}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            {t.countryCode}: {country}
          </p>
        </div>

        <div className="mt-4 space-y-2 text-xs leading-5 text-slate-500">
          <p>{t.privacy}</p>
          <p>{t.accuracy}</p>
        </div>
      </div>
    </aside>
  );
}
