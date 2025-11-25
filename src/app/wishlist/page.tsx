'use client';

import Link from "next/link";
import { Footer } from "@/components/footer";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCartStore } from "@/store/cart-store";

const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

export default function WishlistPage() {
  const products = useWishlistStore((state) => state.products);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const addItemToCart = useCartStore((state) => state.addItem);

  const handleAddToCart = (slug: string) => {
    addItemToCart(slug, 1);
    removeItem(slug);
  };

  return (
    <main className="bg-white text-zinc-900">
      <section className="mx-auto max-w-[1300px] px-6 py-10">
        <nav className="text-sm text-zinc-500">
          <Link href="/" className="text-[#4D9C2C] hover:underline">
            Home
          </Link>{" "}
          <span className="mx-2 text-zinc-400">/</span>
          <span className="font-medium text-zinc-700">Wishlist</span>
        </nav>

        <div className="mt-6 rounded-3xl border border-[#E6EEDF] bg-white p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-[#355B20]">
              Wishlist ({products.length})
            </h1>
            {products.length > 0 && (
              <Link href="/shop-now" className="text-sm font-semibold text-[#4D9C2C]">
                Continue Shopping
              </Link>
            )}
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {products.length === 0 && (
              <p className="text-zinc-500">
                No favorites yet.{" "}
                <Link href="/shop-now" className="text-[#4D9C2C] underline">
                  Browse products
                </Link>{" "}
                to add them to your wishlist.
              </p>
            )}

            {products.map((product) => (
              <article
                key={product.slug}
                className="flex flex-col rounded-3xl border border-[#E6EEDF] bg-[#FDFEFE] p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-[#F4F6F1]">
                    <PlaceholderThumb />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#4D9C2C]/80">
                      {product.category}
                    </p>
                    <Link
                      href={`/shop-now/${product.slug}`}
                      className="text-lg font-semibold text-[#355B20]"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-2 text-sm text-zinc-500">{product.shortDescription}</p>
                    <div className="mt-3 text-lg font-semibold text-[#4D9C2C]">
                      {formatINR(product.price)}
                      {product.oldPrice && (
                        <span className="ml-3 text-sm font-normal text-zinc-400 line-through">
                          {formatINR(product.oldPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    onClick={() => handleAddToCart(product.slug)}
                    className="inline-flex flex-1 items-center justify-center rounded-full bg-[#4D9C2C] px-6 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_10px_20px_rgba(77,156,44,0.3)] transition hover:bg-[#356F1D]"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeItem(product.slug)}
                    className="rounded-full border border-[#E6EEDF] px-6 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#4D9C2C]"
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function PlaceholderThumb() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-10 w-10 text-zinc-400"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="8" y="12" width="32" height="24" rx="4" />
      <circle cx="18" cy="20" r="2" />
      <path d="m12 32 8-8 6 6 10-10 8 8" />
    </svg>
  );
}
