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

export function ShopProductCard({ product }: { product: ProductListItem }) {
  const { isAuthenticated } = useAuth();
  const { addItem: addToCart } = useCart();
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
        alert('No SKU available for this product');
        return;
      }

      await addToCart({
        productUid: product.uid,
        skuUid: targetSku.uid,
        quantity: 1,
        attributes: targetSku.attributes || {},
      });
      alert('Added to cart!');
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
      alert(error.message || 'Failed to add to cart');
    } finally {
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

      <Link
        href={`/shop-now/${product.slug}`}
        className="relative flex flex-col rounded-3xl border border-[--color-border-secondary] bg-background p-4 shadow-[0_12px_32px_rgba(103,39,27,0.05)] transition hover:-translate-y-1 focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-border-light)]"
      >
      <div className="relative flex h-56 w-full items-center justify-center rounded-2xl bg-[--color-bg-image]">
        <WishlistHeartButton productUid={product.uid} />
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.title} className="h-full w-full object-cover rounded-2xl" />
        ) : (
          <PlaceholderImage />
        )}
      </div>
      <div className="mt-4 flex flex-1 flex-col justify-between px-1">
        <h3 className="text-base font-semibold text-zinc-800">{product.title}</h3>
        <div className="mt-3 text-lg font-semibold text-[--color-primary]">
          {formatPrice(product.minPriceCents)}
          {product.maxPriceCents && product.maxPriceCents > product.minPriceCents && (
            <span className="ml-3 text-base font-normal text-zinc-400 line-through">
              {formatPrice(product.maxPriceCents)}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdding || !product.inStock}
          className="mt-4 inline-flex w-full items-center justify-center rounded-2xl border border-[--color-primary] px-4 py-2 text-sm font-semibold text-[--color-primary] transition hover:bg-[--color-primary] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {!product.inStock ? "Out of Stock" : isAdding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </Link>
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
