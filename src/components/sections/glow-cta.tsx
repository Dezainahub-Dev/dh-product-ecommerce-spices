export function GlowRevolutionCTA() {
  return (
    <section className="bg-black px-6 py-24 text-white">
      <div className="mx-auto flex max-w-[1368px] flex-col items-center gap-12 rounded-[42px] border border-zinc-900 bg-black/60 px-10 py-16 lg:flex-row lg:gap-16">
        <div className="w-full lg:w-2/3">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[#6EE56C]">
            Avanora
          </p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight">
            Join the Glow Revolution!
          </h2>
          <p className="mt-4 text-lg text-zinc-100/80">
            Subscribe to our newsletter for exclusive offers, skincare tips, and
            early access to new products. Sign up now &amp; get 10% off your first
            purchase.
          </p>
          <button className="mt-8 inline-flex items-center justify-center gap-3 rounded-full bg-[var(--color-primary)] px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_15px_35px_rgba(103,39,27,0.5)] transition hover:bg-[var(--color-primary-dark)]">
            Shop Now
            <span aria-hidden="true">➜</span>
          </button>
        </div>
        <div className="flex w-full items-center justify-center lg:w-1/3">
          <div className="relative h-48 w-48 rounded-3xl border border-zinc-800 bg-zinc-900/70">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-700">
              <svg
                viewBox="0 0 48 48"
                className="h-16 w-16"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="8" y="12" width="32" height="24" rx="4" />
                <circle cx="18" cy="20" r="2" />
                <path d="m12 32 8-8 6 6 10-10 8 8" />
              </svg>
              <p className="mt-3 text-xs tracking-[0.2em] uppercase">
                Add Image
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
