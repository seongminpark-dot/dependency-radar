import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Atlas Tycoon | Datlora",
  description:
    "Datlora Atlas Tycoon is a world-building tycoon game where players unlock countries, collect rewards, upgrade landmarks, and grow a global atlas.",
  alternates: {
    canonical: "https://datlora.com/atlas-tycoon",
  },
};

const countryCards = [
  {
    flag: "🇰🇷",
    name: "Korea",
    role: "Starter Hub",
    bonus: "+12% Tech Output",
  },
  {
    flag: "🇺🇸",
    name: "United States",
    role: "Mega Market",
    bonus: "+18% Coin Flow",
  },
  {
    flag: "🇯🇵",
    name: "Japan",
    role: "Precision Industry",
    bonus: "+10% Upgrade Speed",
  },
  {
    flag: "🇸🇬",
    name: "Singapore",
    role: "Trade Gateway",
    bonus: "+15% Port Revenue",
  },
];

export default function AtlasTycoonPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050816]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-6 py-4">
          <a href="/" className="text-base font-black tracking-tight text-white">
            Datlora
          </a>

          <nav className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-300">
            <a href="/" className="hover:text-white">
              Home
            </a>
            <a href="/world-voyage" className="hover:text-white">
              World Voyage
            </a>
            <a href="/atlas-tycoon" className="text-emerald-300">
              Atlas Tycoon
            </a>
            <a href="/risk-lab" className="hover:text-white">
              Risk Lab
            </a>
            <a href="/challenge" className="hover:text-white">
              Challenge
            </a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
          Datlora Atlas Tycoon
        </p>

        <div className="mt-5 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.075em] md:text-7xl">
              국가를 해금하고, 세계 지도를 성장시키세요.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              국가 카드, 랜드마크, 코인 생산, 업그레이드, 보상 상자를 중심으로 설계되는
              Datlora의 메인 수집형 타이쿤 게임입니다.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/30">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black text-slate-400">Global Income</p>
                <strong className="mt-2 block text-4xl font-black tracking-[-0.06em]">
                  12,480 / min
                </strong>
              </div>
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-emerald-400 text-3xl shadow-lg shadow-emerald-400/20">
                🌍
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <p className="text-xs font-bold text-slate-400">Coins</p>
                <strong className="mt-1 block text-xl">8,240</strong>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <p className="text-xs font-bold text-slate-400">Gems</p>
                <strong className="mt-1 block text-xl">120</strong>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <p className="text-xs font-bold text-slate-400">Level</p>
                <strong className="mt-1 block text-xl">7</strong>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-sky-950 via-slate-950 to-black shadow-2xl shadow-black/40">
            <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/10 blur-3xl" />
            <div className="absolute left-1/2 top-1/2 h-[310px] w-[310px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/25 bg-sky-500/15 shadow-2xl shadow-cyan-400/20" />
            <div className="absolute left-1/2 top-1/2 grid h-[230px] w-[230px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-br from-emerald-300 via-sky-400 to-indigo-700 text-8xl shadow-2xl shadow-sky-500/30">
              🌐
            </div>

            <div className="absolute left-8 top-8 rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur-xl">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
                Atlas Core
              </p>
              <strong className="mt-2 block text-2xl font-black">World Map Lv.1</strong>
            </div>

            <div className="absolute bottom-8 left-8 right-8 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur-xl">
                <p className="text-xs font-bold text-slate-300">Next Unlock</p>
                <strong className="mt-1 block text-lg">Trade Port</strong>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur-xl">
                <p className="text-xs font-bold text-slate-300">Boost</p>
                <strong className="mt-1 block text-lg">2x Income</strong>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur-xl">
                <p className="text-xs font-bold text-slate-300">Reward Box</p>
                <strong className="mt-1 block text-lg">Ready</strong>
              </div>
            </div>
          </div>

          <aside className="grid gap-5">
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6">
              <h2 className="text-2xl font-black tracking-[-0.05em]">Game Loop</h2>
              <div className="mt-5 grid gap-3">
                {[
                  "국가 카드팩 열기",
                  "국가 해금",
                  "랜드마크 건설",
                  "코인 생산량 증가",
                  "더 높은 등급의 국가 해금",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/45 p-4"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-400 font-black text-slate-950">
                      {index + 1}
                    </span>
                    <strong>{item}</strong>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6">
              <h2 className="text-2xl font-black tracking-[-0.05em]">Country Cards</h2>
              <div className="mt-5 grid gap-3">
                {countryCards.map((country) => (
                  <div
                    key={country.name}
                    className="rounded-2xl border border-white/10 bg-slate-950/45 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <strong className="text-lg">
                          {country.flag} {country.name}
                        </strong>
                        <p className="mt-1 text-sm text-slate-400">{country.role}</p>
                      </div>
                      <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-black text-emerald-300">
                        {country.bonus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </section>
      </section>
    </main>
  );
}
