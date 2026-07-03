"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type DisplayLanguage = "ko" | "en";

const labels = {
  ko: {
    home: "홈",
    countries: "국가 목록",
    news: "뉴스",
    issues: "이슈",
    topics: "주제",
    compare: "비교",
    sources: "출처",
    methodology: "방법론",
  },
  en: {
    home: "Home",
    countries: "Countries",
    news: "News",
    issues: "Issues",
    topics: "Topics",
    compare: "Compare",
    sources: "Sources",
    methodology: "Methodology",
  },
};

async function detectLanguage(): Promise<DisplayLanguage> {
  const manual = localStorage.getItem("datlora-manual-language");
  const saved = localStorage.getItem("dependency-radar-language");

  if (manual === "true") {
    return saved === "ko" ? "ko" : "en";
  }

  try {
    const response = await fetch("/api/geo", { cache: "no-store" });
    const data = await response.json();

    if (data?.country === "KR") {
      return "ko";
    }
  } catch {
    return "ko";
  }

  return saved === "ko" ? "ko" : "en";
}

export default function UnifiedTopNav({
  language,
}: {
  language?: string;
}) {
  const pathname = usePathname();
  const [displayLanguage, setDisplayLanguage] = useState<DisplayLanguage>(
    language === "ko" ? "ko" : "en"
  );

  useEffect(() => {
    if (language) {
      setDisplayLanguage(language === "ko" ? "ko" : "en");
      return;
    }

    let cancelled = false;

    async function init() {
      const next = await detectLanguage();

      if (!cancelled) {
        setDisplayLanguage(next);
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [language]);

  const t = labels[displayLanguage];

  const items = [
    { href: "/", path: "/", label: t.home },
    { href: "/countries", path: "/countries", label: t.countries },
    { href: "/news", path: "/news", label: t.news },
    { href: "/issues", path: "/issues", label: t.issues },
    { href: "/topics", path: "/topics", label: t.topics },
    { href: "/compare?a=KOR&b=USA", path: "/compare", label: t.compare },
    { href: "/sources", path: "/sources", label: t.sources },
    { href: "/methodology", path: "/methodology", label: t.methodology },
  ];

  return (
    <nav className="hidden flex-wrap items-center gap-3 text-sm font-bold text-slate-300 lg:flex">
      {items.map((item) => {
        const active =
          item.path === "/"
            ? pathname === "/"
            : pathname === item.path || pathname.startsWith(`${item.path}/`);

        return (
          <a
            key={item.href}
            href={item.href}
            className={`rounded-full px-3 py-2 transition ${
              active
                ? "bg-white text-slate-950"
                : "hover:bg-white/10 hover:text-white"
            }`}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
