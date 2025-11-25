"use client";

import Link from "next/link";
import { useTransition } from "react";
import type { Product } from "@/data/products";
import { useCartStore } from "@/store/cart-store";
import { WishlistHeartButton } from "@/components/product/wishlist-heart-button";

export function ShopProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdding, startTransition] = useTransition();

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    startTransition(() => addItem(product.slug));
  };

  return (
    <Link
      href={`/shop-now/${product.slug}`}
      className="relative flex flex-col rounded-3xl border border-[#E5EED5] bg-white p-4 shadow-[0_12px_32px_rgba(77,156,44,0.05)] transition hover:-translate-y-1 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#BEEAB3]"
    >
      <div className="relative flex h-56 w-full items-center justify-center rounded-2xl bg-[#F4F6F1]">
        <WishlistHeartButton slug={product.slug} />
        <PlaceholderImage />
      </div>
      <div className="mt-4 flex flex-1 flex-col justify-between px-1">
        <h3 className="text-base font-semibold text-zinc-800">{product.name}</h3>
        <div className="mt-3 text-lg font-semibold text-[#4D9C2C]">
          ${product.price.toFixed(2)}
          {product.oldPrice && (
            <span className="ml-3 text-base font-normal text-zinc-400 line-through">
              ${product.oldPrice.toFixed(2)}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdding}
          className="mt-4 inline-flex w-full items-center justify-center rounded-2xl border border-[#4D9C2C] px-4 py-2 text-sm font-semibold text-[#4D9C2C] transition hover:bg-[#4D9C2C] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isAdding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </Link>
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
