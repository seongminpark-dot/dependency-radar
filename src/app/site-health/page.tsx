import type { Metadata } from "next";

const siteUrl = "https://datlora.com";

export const metadata: Metadata = {
  title: "Site Health Checklist | Datlora",
  description:
    "Internal Datlora checklist for sitemap, robots, indexing, and core page verification.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: `${siteUrl}/site-health`,
  },
};

const corePages = [
  { label: "Home", href: "/" },
  { label: "Latest Global News", href: "/news" },
  { label: "Global Issue Briefs", href: "/issues" },
  { label: "Oil Shock", href: "/issues/oil-shock" },
  { label: "Food Import Risk", href: "/issues/food-import-risk" },
  { label: "Tariff Pressure", href: "/issues/tariff-pressure" },
  { label: "Supply Chain", href: "/issues/supply-chain" },
  { label: "Topics", href: "/topics" },
  { label: "Compare", href: "/compare?a=KOR&b=USA" },
  { label: "Sources", href: "/sources" },
  { label: "Methodology", href: "/methodology" },
];

const countryPages = [
  { label: "Korea data", href: "/country/KOR" },
  { label: "United States data", href: "/country/USA" },
  { label: "Japan data", href: "/country/JPN" },
  { label: "China data", href: "/country/CHN" },
  { label: "Germany data", href: "/country/DEU" },
  { label: "India data", href: "/country/IND" },
];

const countryNewsPages = [
  { label: "Korea news", href: "/news/country/KOR" },
  { label: "United States news", href: "/news/country/USA" },
  { label: "Japan news", href: "/news/country/JPN" },
  { label: "China news", href: "/news/country/CHN" },
  { label: "Germany news", href: "/news/country/DEU" },
  { label: "India news", href: "/news/country/IND" },
];

function UrlCard({ label, href }: { label: string; href: string }) {
  const fullUrl = href.startsWith("http") ? href : `${siteUrl}${href}`;

  return (
    <a
      href={href}
      className="rounded-2xl border border-white/10 bg-slate-950/65 p-4 transition hover:border-emerald-300/40 hover:bg-emerald-300/10"
    >
      <strong className="block text-white">{label}</strong>
      <span className="mt-2 block break-all text-xs leading-5 text-slate-400">
        {fullUrl}
      </span>
    </a>
  );
}

export default function SiteHealthPage() {
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
            <a href="/sources" className="hover:text-white">Sources</a>
            <a href="/methodology" className="hover:text-white">Methodology</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">
          Internal checklist
        </p>

        <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.98] tracking-[-0.075em] md:text-7xl">
          Datlora 색인 점검 페이지
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          이 페이지는 검색 노출용이 아니라 운영 점검용입니다. sitemap, robots,
          주요 페이지, 국가 페이지, 국가별 뉴스 페이지가 정상 연결되는지 확인합니다.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <a
            href="/sitemap.xml"
            className="rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-5"
          >
            <strong className="block text-xl font-black text-white">
              Sitemap XML
            </strong>
            <span className="mt-2 block text-sm text-emerald-50/80">
              /sitemap.xml 확인
            </span>
          </a>

          <a
            href="/sitemap.txt"
            className="rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-5"
          >
            <strong className="block text-xl font-black text-white">
              Sitemap TXT
            </strong>
            <span className="mt-2 block text-sm text-cyan-50/80">
              /sitemap.txt 확인
            </span>
          </a>

          <a
            href="/robots.txt"
            className="rounded-[2rem] border border-blue-300/20 bg-blue-300/10 p-5"
          >
            <strong className="block text-xl font-black text-white">
              Robots.txt
            </strong>
            <span className="mt-2 block text-sm text-blue-50/80">
              /robots.txt 확인
            </span>
          </a>
        </div>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-3xl font-black tracking-[-0.06em]">
            Core pages
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {corePages.map((page) => (
              <UrlCard key={page.href} {...page} />
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-3xl font-black tracking-[-0.06em]">
            Country data pages
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {countryPages.map((page) => (
              <UrlCard key={page.href} {...page} />
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-3xl font-black tracking-[-0.06em]">
            Country news pages
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {countryNewsPages.map((page) => (
              <UrlCard key={page.href} {...page} />
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-5 text-sm leading-7 text-amber-100">
          Search Console에서는 먼저 sitemap.xml을 제출하고, 이후 Home, News,
          Issues, Sources, Methodology, 주요 country 페이지를 URL 검사로 확인하면
          됩니다.
        </section>
      </section>
    </main>
  );
}
