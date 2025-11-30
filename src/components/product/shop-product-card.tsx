"use client";

import Link from "next/link";
import { useState } from "react";
import type { ProductListItem } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { productService } from "@/lib/products";
import { WishlistHeartButton } from "@/components/product/wishlist-heart-button";
import { LoginRequiredModal } from "@/components/modals/login-required-modal";
import { useToastStore } from "@/components/toast-notification";

export function ShopProductCard({ product }: { product: ProductListItem }) {
  const { isAuthenticated } = useAuth();
  const { addItem: addToCart } = useCart();
  const { addToast } = useToastStore();
  const [isAdding, setIsAdding] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleAddToCart = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    setIsAdding(true);
    try {
      // Fetch first SKU and add via API
      const skus = await productService.getProductSkus(product.uid);
      const firstInStockSku = skus.find(sku => sku.inStock);
      const targetSku = firstInStockSku || skus[0];

      if (!targetSku) {
        addToast('No SKU available for this product', 'error');
        return;
      }

      await addToCart({
        productUid: product.uid,
        skuUid: targetSku.uid,
        quantity: 1,
        attributes: targetSku.attributes || {},
      });
      addToast('Added to cart', 'success');
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
      addToast(error.message || 'Failed to add to cart', 'error');
    } finally{
      setIsAdding(false);
    }
  };

  return (
    <>
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        message="Please login to add items to your cart"
      />

      <div className="group flex flex-col rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md">
        <Link
          href={`/shop-now/${product.slug}`}
          className="relative flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        >
          <div className="relative flex h-64 w-full items-center justify-center overflow-hidden rounded-t-2xl bg-zinc-50">
            <div className="absolute right-3 top-3 z-10">
              <WishlistHeartButton productUid={product.uid} />
            </div>
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.title} className="h-full w-full object-cover" />
            ) : (
              <PlaceholderImage />
            )}
          </div>
        </Link>

        <div className="flex flex-1 flex-col p-4">
          <Link href={`/shop-now/${product.slug}`}>
            <h3 className="text-base font-medium text-zinc-900 line-clamp-2 hover:text-[var(--color-primary)] transition">
              {product.title}
            </h3>
          </Link>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-semibold text-[var(--color-primary)]">
              {formatPrice(product.minPriceCents)}
            </span>
            {product.maxPriceCents && product.maxPriceCents > product.minPriceCents && (
              <span className="text-sm text-zinc-400 line-through">
                {formatPrice(product.maxPriceCents)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding || !product.inStock}
            className="mt-4 inline-flex w-full items-center justify-center rounded-full border-2 border-[var(--color-primary)] px-6 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[var(--color-primary)]"
          >
            {!product.inStock ? "Out of Stock" : isAdding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </>
  );
}

function PlaceholderImage() {
  return (
    <div className="flex flex-col items-center text-sm text-zinc-400">
      <svg
        viewBox="0 0 48 48"
        className="h-12 w-12"
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
      <span className="mt-2 text-xs uppercase tracking-[0.2em]">Image Placeholder</span>
    </div>
  );
}
