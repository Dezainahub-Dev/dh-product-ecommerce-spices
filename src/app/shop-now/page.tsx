'use client';

import Link from "next/link";
import { useState } from "react";
import { Footer } from "@/components/footer";
import { ShopProductCard } from "@/components/product/shop-product-card";
import { useProducts } from "@/hooks/useProducts";
import type { ProductFilters } from "@/lib/products";

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
  { label: "Sort by Latest", sortBy: "createdAt" as const, sortOrder: "desc" as const },
  { label: "Price Low to High", sortBy: "createdAt" as const, sortOrder: "asc" as const },
  { label: "Price High to Low", sortBy: "createdAt" as const, sortOrder: "desc" as const },
  { label: "Sort by Popularity", sortBy: "createdAt" as const, sortOrder: "desc" as const },
];

export default function ShopNowPage() {
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { products, loading, error, pagination } = useProducts(filters);

  const handleSortChange = (index: number) => {
    const option = sortOptions[index];
    setFilters((prev) => ({
      ...prev,
      sortBy: option.sortBy,
      sortOrder: option.sortOrder,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };
  return (
    <main className="bg-white text-zinc-900">
      <section className="mx-auto max-w-[1368px] px-6 py-10">
        <nav className="text-sm text-zinc-500">
          <Link href="/" className="text-[var(--color-primary)] hover:underline">
            Home
          </Link>{" "}
          <span className="mx-2 text-zinc-400">/</span>
          <span className="font-medium text-zinc-700">Shop Now</span>
        </nav>

        <div className="mt-8 grid gap-8 lg:grid-cols-[300px_1fr]">
          <aside className="rounded-3xl border border-[var(--color-border-lighter)] bg-white p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-text-dark)]">
                Search Filter
              </p>
              <button className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
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
                    className="h-2 w-full appearance-none rounded-full bg-[var(--color-progress-bg)]"
                  />
                </div>
              </FilterSection>
            </div>
          </aside>

          <div>
            <header className="flex flex-col gap-4 rounded-3xl border border-[--color-border-primary] bg-background px-6 py-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[--color-primary-dark]">
                  Products ({loading ? "..." : pagination.total})
                </p>
                <h1 className="mt-1 text-3xl font-semibold text-[--color-primary-dark]">Products</h1>
              </div>
              <label className="inline-flex items-center gap-3 text-sm font-medium text-zinc-500">
                Sort By
                <select
                  onChange={(e) => handleSortChange(Number(e.target.value))}
                  className="rounded-2xl border border-[--color-border-primary] px-4 py-2 text-base text-zinc-700 focus:outline-none"
                >
                  {sortOptions.map((option, index) => (
                    <option key={option.label} value={index}>{option.label}</option>
                  ))}
                </select>
              </label>
            </header>

            {loading && (
              <div className="mt-6 flex justify-center py-20">
                <p className="text-zinc-500">Loading products...</p>
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {!loading && !error && products.length === 0 && (
              <div className="mt-6 rounded-2xl border border-[--color-border-primary] bg-background p-12 text-center">
                <p className="text-zinc-500">No products found.</p>
              </div>
            )}

            {!loading && !error && products.length > 0 && (
              <>
                <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {products.map((product) => (
                    <ShopProductCard key={product.uid} product={product} />
                  ))}
                </div>

                <div className="mt-10 flex flex-col items-center justify-between gap-6 rounded-3xl border border-[--color-border-primary] bg-background px-6 py-4 text-sm text-zinc-500 md:flex-row">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="inline-flex items-center gap-2 rounded-2xl border border-[--color-border-secondary] px-4 py-2 text-zinc-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span aria-hidden="true">‹</span> Previous
                  </button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`h-10 w-10 rounded-2xl border text-base font-semibold ${
                            pageNum === pagination.page
                              ? "border-[--color-primary] bg-[--color-primary] text-white"
                              : "border-transparent bg-[--color-bg-secondary] text-[--color-primary-dark]"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="inline-flex items-center gap-2 rounded-2xl border border-[--color-border-secondary] px-4 py-2 text-[--color-primary-dark] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next <span aria-hidden="true">›</span>
                  </button>
                </div>
              </>
            )}
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
    <div className="rounded-2xl border border-[var(--color-border-lightest)] p-4">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-text-dark)]">
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
          checked ? "border-[var(--color-primary)] bg-[var(--color-primary)]" : "border-[var(--color-border-lighter)] bg-white"
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
