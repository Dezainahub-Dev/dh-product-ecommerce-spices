"use client";

import { MouseEvent, useState } from "react";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";
import { productService } from "@/lib/products";

type WishlistHeartButtonProps = {
  productUid: string;
  skuUid?: string; // Optional: if provided, will add this specific SKU, otherwise fetches first available SKU
};

export function WishlistHeartButton({ productUid, skuUid }: WishlistHeartButtonProps) {
  const { isAuthenticated } = useAuth();
  const { items, addToWishlist, removeFromWishlist } = useWishlist();
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if ANY SKU of this product is in the wishlist
  const wishlistItem = items.find((item) => item.product.uid === productUid);
  const active = !!wishlistItem;

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      alert('Please login to add items to your wishlist');
      return;
    }

    setIsProcessing(true);
    try {
      if (wishlistItem) {
        // Remove from wishlist
        await removeFromWishlist(wishlistItem.uid);
      } else {
        // Add to wishlist - need to determine which SKU to add
        let targetSkuUid = skuUid;

        if (!targetSkuUid) {
          // Fetch product SKUs to get the first available one
          const skus = await productService.getProductSkus(productUid);
          const firstInStockSku = skus.find(sku => sku.inStock);
          targetSkuUid = firstInStockSku?.uid || skus[0]?.uid;
        }

        if (!targetSkuUid) {
          alert('No SKU available for this product');
          return;
        }

        await addToWishlist(targetSkuUid);
      }
    } catch (err: any) {
      console.error('Wishlist operation failed:', err);
      alert(err.message || 'Failed to update wishlist');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      type="button"
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      onClick={handleClick}
      disabled={isProcessing}
      className={`absolute right-4 top-4 inline-flex h-12 w-12 items-center justify-center rounded-full border bg-white/90 shadow transition ${
        active
          ? "border-[var(--color-primary)] text-[var(--color-accent-red-heart)]"
          : "border-white text-zinc-400 hover:text-[var(--color-text-dark)]"
      } ${isProcessing ? "opacity-70 cursor-wait" : ""}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 20s-5.5-3.5-8-7a4.5 4.5 0 0 1 7-5 4.5 4.5 0 0 1 7 5c-2.5 3.5-8 7-8 7Z" />
      </svg>
    </button>
  );
}
