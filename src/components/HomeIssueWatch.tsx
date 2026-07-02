"use client";

import { useEffect, useMemo, useState } from "react";
import { issueBriefs } from "@/lib/issueBriefs";

const watchCards = [
  {
    title: "Energy price and import exposure",
    label: "Oil Shock",
    href: "/issues/oil-shock",
    image: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Food security and import dependence",
    label: "Food Import Risk",
    href: "/issues/food-import-risk",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Tariff pressure and trade costs",
    label: "Tariff Pressure",
    href: "/issues/tariff-pressure",
    image: "https://images.unsplash.com/photo-1494412685616-a5d310fbb07d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Supply chain routes and logistics risk",
    label: "Supply Chain",
    href: "/issues/supply-chain",
    image: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function HomeIssueWatch() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCard = watchCards[activeIndex];

  const issueMap = useMemo(() => issueBriefs, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % watchCards.length);
    }, 4000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return (
    <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950 p-6 text-white shadow-2xl shadow-black/20">
          <p className="text-xs font-black uppercase tracking-[0.26em] text-cyan-300">
            Global Issue Briefs
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.07em]">
            뉴스 흐름을 공식 지표로 확인하세요.
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Datlora는 뉴스 자체를 판단하지 않습니다. 글로벌 이슈를 이해하는 데 필요한 공식 국가 지표와 관련 페이지를 연결합니다.
          </p>

          <div className="mt-6 grid gap-3">
            {issueMap.map((issue) => (
              <a
                key={issue.slug}
                href={`/issues/${issue.slug}`}
                className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 transition hover:border-cyan-300/40"
              >
                <strong className="block text-white">{issue.shortTitle}</strong>
                <span className="mt-1 block text-sm leading-6 text-slate-400">{issue.deck}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 text-white shadow-2xl shadow-black/20">
          <div className="relative h-[420px]">
            <img
              src={activeCard.image}
              alt={activeCard.title}
              className="h-full w-full object-cover opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300">
                Related News Watch
              </p>
              <h3 className="mt-3 max-w-xl text-4xl font-black leading-tight tracking-[-0.06em]">
                {activeCard.title}
              </h3>
              <p className="mt-3 text-sm font-bold text-slate-300">
                Related issue: {activeCard.label}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href={activeCard.href}
                  className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-black text-slate-950"
                >
                  View issue brief
                </a>
                <button
                  type="button"
                  onClick={() => setActiveIndex((activeIndex - 1 + watchCards.length) % watchCards.length)}
                  className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-black text-white"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => setActiveIndex((activeIndex + 1) % watchCards.length)}
                  className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-black text-white"
                >
                  Next
                </button>
              </div>

              <div className="mt-5 flex gap-2">
                {watchCards.map((card, index) => (
                  <button
                    key={card.href}
                    type="button"
                    aria-label={card.label}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === activeIndex ? "w-10 bg-emerald-300" : "w-2 bg-white/35"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 bg-slate-950 px-6 py-4 text-xs leading-6 text-slate-400">
            뉴스는 관련 글로벌 이슈 참고용이며, Datlora의 통계 수치는 공식 공개 데이터 기준입니다.
          </div>
        </div>
      </div>
    </section>
  );
}
