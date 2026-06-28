export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#070914] px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <a href="/" className="text-sm text-indigo-300 hover:text-white">
          ← Back to Dependency Radar
        </a>

        <h1 className="mt-8 text-4xl font-bold">Privacy Policy</h1>

        <div className="mt-8 space-y-6 text-slate-300">
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-bold text-white">Information we use</h2>
            <p className="mt-3 leading-7">
              Dependency Radar may use the visitor country code provided by the
              hosting platform to select a default language and show the current
              visitor country. The service does not need to store your full IP
              address for this feature.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-bold text-white">Language preference</h2>
            <p className="mt-3 leading-7">
              If you manually change the language, your browser may store that
              preference locally so the same language can be shown on your next
              visit.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-bold text-white">Contact by email</h2>
            <p className="mt-3 leading-7">
              If you contact us by email, your email address and message content
              will be used only to respond to your inquiry.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-bold text-white">Contact</h2>
            <a
              href="mailto:kevinsmp123@gmail.com"
              className="mt-3 inline-block text-lg font-semibold text-indigo-200 hover:text-white"
            >
              kevinsmp123@gmail.com
            </a>
          </section>
        </div>
      </div>
    </main>
  );
}
