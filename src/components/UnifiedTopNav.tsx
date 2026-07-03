"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type DisplayLanguage = "ko" | "en";

const labels = {
  ko: {
    menu: "메뉴",
    close: "닫기",
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
    menu: "Menu",
    close: "Close",
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
  const [open, setOpen] = useState(false);
  const [displayLanguage, setDisplayLanguage] = useState<DisplayLanguage>(
    language === "ko" ? "ko" : "en"
  );

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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

  function isActive(path: string) {
    return path === "/"
      ? pathname === "/"
      : pathname === path || pathname.startsWith(`${path}/`);
  }

  return (
    <div className="relative z-50">
      <nav className="hidden flex-wrap items-center gap-3 text-sm font-bold text-slate-300 lg:flex">
        {items.map((item) => {
          const active = isActive(item.path);

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

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-black text-white transition hover:bg-white/10 lg:hidden"
        aria-expanded={open}
        aria-label={open ? t.close : t.menu}
      >
        <span>{open ? t.close : t.menu}</span>
        <span aria-hidden="true">{open ? "×" : "☰"}</span>
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+0.75rem)] w-[min(86vw,320px)] rounded-[1.5rem] border border-white/10 bg-[#070914] p-3 shadow-2xl shadow-black/50 lg:hidden">
          <div className="grid gap-2">
            {items.map((item) => {
              const active = isActive(item.path);

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                    active
                      ? "bg-white text-slate-950"
                      : "bg-white/[0.04] text-slate-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
