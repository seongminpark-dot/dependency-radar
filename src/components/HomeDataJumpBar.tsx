"use client";

type Language = "ko" | "en" | "ja" | "zh" | "es" | "fr" | "de";

const copy = {
  ko: {
    label: "Data shortcuts",
    title: "필요한 데이터 섹션으로 바로 이동하세요.",
    subtitle:
      "무역, 에너지, 관세, 지도, 전체 표를 긴 스크롤 없이 빠르게 확인할 수 있습니다.",
    trade: "최신 무역",
    energy: "에너지",
    tariff: "관세",
    map: "세계 지도",
    table: "전체 표",
  },
  en: {
    label: "Data shortcuts",
    title: "Jump directly to the data section you need.",
    subtitle:
      "Move quickly between trade, energy, tariff, map, and full table sections without long scrolling.",
    trade: "Trade",
    energy: "Energy",
    tariff: "Tariff",
    map: "World map",
    table: "Full table",
  },
};

function JumpLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="rounded-2xl border border-white/10 bg-[#0b0f1c] px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/[0.07] hover:text-white"
    >
      {children}
    </a>
  );
}

export default function HomeDataJumpBar({
  language,
}: {
  language: Language;
}) {
  const t = language === "ko" ? copy.ko : copy.en;

  return (
    <section className="mx-auto max-w-7xl px-6 pb-10">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 lg:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              {t.label}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              {t.title}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              {t.subtitle}
            </p>
          </div>

          <nav
            aria-label="Homepage data shortcuts"
            className="flex flex-wrap gap-2"
          >
            <JumpLink href="#latest-trade">{t.trade}</JumpLink>
            <JumpLink href="#energy-data">{t.energy}</JumpLink>
            <JumpLink href="#tariff-data">{t.tariff}</JumpLink>
            <JumpLink href="#world-map">{t.map}</JumpLink>
            <JumpLink href="#world-bank-table">{t.table}</JumpLink>
          </nav>
        </div>
      </div>
    </section>
  );
}
