import Link from "next/link";
import { Footer } from "@/components/footer";
import { products as productData } from "@/data/products";
import { ShopProductCard } from "@/components/product/shop-product-card";

const categoryFilters = [
  { label: "Blended Spices", checked: false },
  { label: "Powdered Spices", checked: true },
  { label: "Whole Spices", checked: false },
];

const highlightFilters = [
  { label: "Best Seller/Popular Product", checked: false },
  { label: "New Arrival/Special Release", checked: true },
];

const sortOptions = [
  "Sort by Latest",
  "Price Low to High",
  "Price High to Low",
  "Sort by Popularity",
];

export default function ShopNowPage() {
  return (
    <main className="bg-white text-zinc-900">
      <section className="mx-auto max-w-[1368px] px-6 py-10">
        <nav className="text-sm text-zinc-500">
          <Link href="/" className="text-[#4D9C2C] hover:underline">
            Home
          </Link>{" "}
          <span className="mx-2 text-zinc-400">/</span>
          <span className="font-medium text-zinc-700">Shop Now</span>
        </nav>

        <div className="mt-8 grid gap-8 lg:grid-cols-[300px_1fr]">
          <aside className="rounded-3xl border border-[#DDE8CC] bg-white p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#355B20]">
                Search Filter
              </p>
              <button className="text-sm font-semibold text-[#4D9C2C] hover:underline">
                Reset All
              </button>
            </div>

            <div className="mt-6 space-y-6">
              <FilterSection title="Search By Category">
                {categoryFilters.map((filter) => (
                  <Checkbox key={filter.label} label={filter.label} checked={filter.checked} />
                ))}
              </FilterSection>

              <FilterSection title="Search By Product Highlight">
                {highlightFilters.map((filter) => (
                  <Checkbox key={filter.label} label={filter.label} checked={filter.checked} />
                ))}
              </FilterSection>

              <FilterSection title="Pricing">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-zinc-500">
                    <span>$250</span>
                    <span>$900</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    defaultValue={60}
                    className="h-2 w-full appearance-none rounded-full bg-[#E0E9CF]"
                  />
                </div>
              </FilterSection>
            </div>
          </aside>

          <div>
            <header className="flex flex-col gap-4 rounded-3xl border border-[#DDE8CC] bg-white px-6 py-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#355B20]">
                  Products (32)
                </p>
                <h1 className="mt-1 text-3xl font-semibold text-[#355B20]">Products</h1>
              </div>
              <label className="inline-flex items-center gap-3 text-sm font-medium text-zinc-500">
                Sort By
                <select className="rounded-2xl border border-[#DDE8CC] px-4 py-2 text-base text-zinc-700 focus:outline-none">
                  {sortOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
            </header>

            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {productData.map((product) => (
                <ShopProductCard key={product.slug} product={product} />
              ))}
            </div>

            <div className="mt-10 flex flex-col items-center justify-between gap-6 rounded-3xl border border-[#DDE8CC] bg-white px-6 py-4 text-sm text-zinc-500 md:flex-row">
              <button className="inline-flex items-center gap-2 rounded-2xl border border-[#E5EED5] px-4 py-2 text-zinc-400">
                <span aria-hidden="true">‹</span> Previous
              </button>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    className={`h-10 w-10 rounded-2xl border text-base font-semibold ${
                      page === 1
                        ? "border-[#4D9C2C] bg-[#4D9C2C] text-white"
                        : "border-transparent bg-[#F4F8ED] text-[#355B20]"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button className="inline-flex items-center gap-2 rounded-2xl border border-[#E5EED5] px-4 py-2 text-[#355B20]">
                Next <span aria-hidden="true">›</span>
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#EBF2DE] p-4">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#355B20]">
        {title}
      </p>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function Checkbox({ label, checked }: { label: string; checked?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-zinc-700">
      <span
        className={`inline-flex h-5 w-5 items-center justify-center rounded-md border ${
          checked ? "border-[#4D9C2C] bg-[#4D9C2C]" : "border-[#DDE8CC] bg-white"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 20 20" className="h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M5 10 8 13 15 6" />
          </svg>
        )}
      </span>
      {label}
    </label>
  );
}
