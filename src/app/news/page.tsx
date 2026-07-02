import type { Metadata } from "next";
import LiveNewsBoard from "@/components/LiveNewsBoard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Latest Global News | Datlora",
  description:
    "Live global trade, energy, food, tariff, and supply-chain news linked to Datlora official data issue briefs.",
  alternates: {
    canonical: "https://datlora.com/news",
  },
};

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050816]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-6 py-4">
          <a href="/" className="text-base font-black tracking-tight text-white">
            Datlora
          </a>

          <nav className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-300">
            <a href="/" className="hover:text-white">Home</a>
            <a href="/news" className="text-emerald-300">News</a>
            <a href="/issues" className="hover:text-white">Issues</a>
            <a href="/topics" className="hover:text-white">Topics</a>
            <a href="/compare?a=KOR&b=USA" className="hover:text-white">Compare</a>
            <a href="/sources" className="hover:text-white">Sources</a>
          </nav>
        </div>
      </header>

      <LiveNewsBoard />
    </main>
  );
}
