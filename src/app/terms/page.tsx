export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#070914] px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <a href="/" className="text-sm text-indigo-300 hover:text-white">
          ← Back to Dependency Radar
        </a>

        <h1 className="mt-8 text-4xl font-bold">Terms of Use</h1>

        <div className="mt-8 space-y-6 text-slate-300">
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-bold text-white">Use of the service</h2>
            <p className="mt-3 leading-7">
              Dependency Radar provides public statistical information for
              research, educational, and general reference purposes.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-bold text-white">Data accuracy</h2>
            <p className="mt-3 leading-7">
              The service relies on third-party public datasets. We try to show
              the latest available values and years, but we do not guarantee that
              all data is complete, current, or error-free.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-bold text-white">No misuse</h2>
            <p className="mt-3 leading-7">
              You should not use the service in a way that disrupts the website,
              abuses data access, or misrepresents the data providers.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
