'use client';

import Link from "next/link";
import { useState } from "react";
import { Footer } from "@/components/footer";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice } from "@/lib/wishlist";

export default function WishlistPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { items, loading, error, removeFromWishlist, moveToCart } = useWishlist();
  const [processingItems, setProcessingItems] = useState<Set<string>>(new Set());

  const handleMoveToCart = async (wishlistItemUid: string) => {
    setProcessingItems((prev) => new Set(prev).add(wishlistItemUid));
    try {
      await moveToCart(wishlistItemUid, 1);
    } catch (err: any) {
      console.error('Failed to move to cart:', err);
      alert(err.message || 'Failed to move item to cart');
    } finally {
      setProcessingItems((prev) => {
        const next = new Set(prev);
        next.delete(wishlistItemUid);
        return next;
      });
    }
  };

  const handleRemove = async (wishlistItemUid: string) => {
    setProcessingItems((prev) => new Set(prev).add(wishlistItemUid));
    try {
      await removeFromWishlist(wishlistItemUid);
    } catch (err: any) {
      console.error('Failed to remove from wishlist:', err);
      alert(err.message || 'Failed to remove item');
    } finally {
      setProcessingItems((prev) => {
        const next = new Set(prev);
        next.delete(wishlistItemUid);
        return next;
      });
    }
  };

  if (authLoading) {
    return (
      <main className="bg-white text-zinc-900 min-h-screen">
        <section className="mx-auto max-w-[1300px] px-6 py-10">
          <div className="flex items-center justify-center py-20">
            <p className="text-zinc-500">Loading...</p>
          </div>
        </section>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="bg-white text-zinc-900 min-h-screen">
        <section className="mx-auto max-w-[1300px] px-6 py-10">
          <nav className="text-sm text-zinc-500">
            <Link href="/" className="text-[var(--color-primary)] hover:underline">
              Home
            </Link>{" "}
            <span className="mx-2 text-zinc-400">/</span>
            <span className="font-medium text-zinc-700">Wishlist</span>
          </nav>

          <div className="mt-6 rounded-3xl border border-[var(--color-border-primary)] bg-white p-12 text-center">
            <h1 className="text-2xl font-semibold text-[var(--color-text-dark)]">
              Please Login
            </h1>
            <p className="mt-4 text-zinc-500">
              You need to be logged in to view your wishlist.
            </p>
            <Link
              href="/login?redirect=/wishlist"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_10px_20px_rgba(103,39,27,0.3)] transition hover:bg-[var(--color-primary-darker)]"
            >
              Login
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-white text-zinc-900 min-h-screen">
      <section className="mx-auto max-w-[1300px] px-6 py-10">
        <nav className="text-sm text-zinc-500">
          <Link href="/" className="text-[var(--color-primary)] hover:underline">
            Home
          </Link>{" "}
          <span className="mx-2 text-zinc-400">/</span>
          <span className="font-medium text-zinc-700">Wishlist</span>
        </nav>

        <div className="mt-6 rounded-3xl border border-[var(--color-border-primary)] bg-white p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-[var(--color-text-dark)]">
              Wishlist ({items.length})
            </h1>
            {items.length > 0 && (
              <Link href="/shop-now" className="text-sm font-semibold text-[var(--color-primary)]">
                Continue Shopping
              </Link>
            )}
          </div>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-center">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {loading && (
            <div className="mt-6 flex items-center justify-center py-20">
              <p className="text-zinc-500">Loading your wishlist...</p>
            </div>
          )}

          {!loading && items.length === 0 && (
            <div className="mt-6">
              <p className="text-zinc-500">
                No favorites yet.{" "}
                <Link href="/shop-now" className="text-[var(--color-primary)] underline">
                  Browse products
                </Link>{" "}
                to add them to your wishlist.
              </p>
            </div>
          )}

          {!loading && items.length > 0 && (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {items.map((item) => {
                const isProcessing = processingItems.has(item.uid);
                const primaryImage = item.product.images.find((img) => img.isPrimary);
                const displayPrice = formatPrice(item.sku.priceCents, item.sku.currency);
                const compareAtPrice = item.sku.compareAtPriceCents
                  ? formatPrice(item.sku.compareAtPriceCents, item.sku.currency)
                  : null;

                return (
                  <article
                    key={item.uid}
                    className="flex flex-col rounded-3xl border border-[var(--color-border-primary)] bg-[var(--color-bg-card)] p-5 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl bg-[var(--color-bg-image)]">
                        {primaryImage ? (
                          <img
                            src={primaryImage.url}
                            alt={primaryImage.altText || item.product.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <PlaceholderThumb />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-primary)]/80">
                          {item.sku.skuCode}
                        </p>
                        <Link
                          href={`/shop-now/${item.product.slug}`}
                          className="text-lg font-semibold text-[var(--color-text-dark)] hover:text-[var(--color-primary)]"
                        >
                          {item.product.title}
                        </Link>
                        <div className="mt-2 text-sm text-zinc-500">
                          {item.stockInfo && (
                            <span className={item.stockInfo.isInStock ? "text-green-600" : "text-red-600"}>
                              {item.stockInfo.isInStock ? "In Stock" : "Out of Stock"}
                              {item.stockInfo.isInStock && ` (${item.stockInfo.available} available)`}
                            </span>
                          )}
                        </div>
                        <div className="mt-3 text-lg font-semibold text-[var(--color-primary)]">
                          {displayPrice}
                          {compareAtPrice && (
                            <span className="ml-3 text-sm font-normal text-zinc-400 line-through">
                              {compareAtPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                      <button
                        onClick={() => handleMoveToCart(item.uid)}
                        disabled={isProcessing || (item.stockInfo && !item.stockInfo.isInStock && !item.sku.backorderable)}
                        className="inline-flex flex-1 items-center justify-center rounded-full bg-[var(--color-primary)] px-6 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_10px_20px_rgba(103,39,27,0.3)] transition hover:bg-[var(--color-primary-darker)] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isProcessing ? "Processing..." : "Add to Cart"}
                      </button>
                      <button
                        onClick={() => handleRemove(item.uid)}
                        disabled={isProcessing}
                        className="rounded-full border border-[var(--color-border-primary)] px-6 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] hover:bg-[var(--color-bg-secondary)] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isProcessing ? "..." : "Remove"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
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
