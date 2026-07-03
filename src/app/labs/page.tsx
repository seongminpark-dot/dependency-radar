import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datlora Labs | Data Games and Experiments",
  description:
    "Datlora Labs collects experimental data games, risk tools, and interactive interactive labs connected to global trade and country statistics.",
  alternates: {
    canonical: "https://datlora.com/labs",
  },
};

const labCards = [
  {
    title: "Data Challenge",
    description:
      "A quick country-data challenge built around trade, energy, food, tariff, and logistics indicators.",
    href: "/challenge",
    label: "Quiz",
  },
  {
    title: "Risk Lab",
    description:
      "An experimental tool for exploring country exposure through official structural indicators.",
    href: "/risk-lab",
    label: "Analysis",
  },
  {
    title: "World Voyage 3D",
    description:
      "A 3D world exploration experiment using geography and country discovery as a visual interface.",
    href: "/world-voyage",
    label: "3D Experiment",
  },
  {
    title: "Atlas Tycoon",
    description:
      "A interactive lab country-collection game that tests how trade and country data can become interactive.",
    href: "/atlas-tycoon",
    label: "Interactive lab",
  },
];

export default function LabsPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050816]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-6 py-4">
          <a href="/" className="text-base font-black tracking-tight text-white">
            Datlora
          </a>

          <nav className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-300">
            <a href="/" className="hover:text-white">Home</a>
            <a href="/news" className="hover:text-white">News</a>
            <a href="/issues" className="hover:text-white">Issues</a>
            <a href="/topics" className="hover:text-white">Topics</a>
            <a href="/compare?a=KOR&b=USA" className="hover:text-white">Compare</a>
            <a href="/labs" className="text-emerald-300">Labs</a>
            <a href="/sources" className="hover:text-white">Sources</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">
          Datlora Labs
        </p>

        <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.075em] md:text-7xl">
          데이터 게임과 실험 기능을 한곳에 모았습니다.
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          Labs는 Datlora의 실험 공간입니다. 메인 서비스는 공식 국가 데이터, 뉴스, 이슈 브리프에 집중하고, 게임과 프로토타입은 이곳에서 별도로 관리합니다.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {labCards.map((card) => (
            <a
              key={card.href}
              href={card.href}
              className="group rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-emerald-300/40"
            >
              <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-xs font-black text-emerald-200">
                {card.label}
              </span>

              <h2 className="mt-5 text-3xl font-black tracking-[-0.06em] text-white">
                {card.title}
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-300">
                {card.description}
              </p>

              <p className="mt-6 text-sm font-black text-emerald-300">
                Open →
              </p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
