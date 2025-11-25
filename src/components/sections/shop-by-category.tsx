const categories = [
  { name: "Blended Spices", count: 31 },
  { name: "Powdered Spices", count: 24 },
  { name: "Whole Spices", count: 16 },
];

const tabs = ["Spices", "Nuts & Seeds"];

export function ShopByCategorySection() {
  return (
    <section className="bg-[#F3F9ED] py-20 text-center text-emerald-950">
      <div className="mx-auto max-w-[1368px] px-6">
        <h2 className="text-4xl font-semibold text-[#355B20]">
          Shop By Category
        </h2>
        <div className="mt-6 flex items-center justify-center gap-4">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              className={`rounded-full border px-6 py-2 text-sm font-semibold transition ${
                index === 0
                  ? "border-[#4D9C2C] bg-[#4D9C2C] text-white"
                  : "border-[#B9D6AA] bg-white text-[#4D9C2C]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-14 grid gap-6 xl:grid-cols-3">
          {categories.map((category) => (
            <article
              key={category.name}
              className="flex h-[280px] flex-col justify-between rounded-3xl bg-gradient-to-b from-[#78B543] to-[#1D3B1A] p-8 text-left text-white"
            >
              <div>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-white">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="5" y="7" width="14" height="10" rx="2" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <h3 className="mt-8 text-xl font-semibold uppercase tracking-wide">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm text-white/80">
                  {category.count} Products
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em]"
              >
                View
                <span aria-hidden="true">→</span>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
