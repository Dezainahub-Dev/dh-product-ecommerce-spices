'use client';

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";
import { LoginRequiredModal } from "@/components/modals/login-required-modal";
import type { ProductDetail } from "@/lib/products";
import { formatPrice } from "@/lib/products";

type AddToCartPanelProps = {
  slug: string;
  product: ProductDetail;
};

// Helper function to get SKU display name from attributes or skuCode
function getSkuDisplayName(sku: ProductDetail['skus'][0]): string {
  if (sku.attributes) {
    // Try to find a "size" or "weight" attribute
    const sizeAttr = sku.attributes['size'] || sku.attributes['weight'] || sku.attributes['variant'];
    if (sizeAttr) {
      return sizeAttr.value;
    }
  }
  return sku.skuCode;
}

export function AddToCartPanel({ slug, product }: AddToCartPanelProps) {
  const { isAuthenticated } = useAuth();
  const { addItem: addToCart } = useCart();
  const { items, addToWishlist, removeFromWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [selectedSKUId, setSelectedSKUId] = useState(product.skus[0]?.uid || "");
  const [wishlistProcessing, setWishlistProcessing] = useState(false);
  const [cartProcessing, setCartProcessing] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const currentSKU = product.skus.find(sku => sku.uid === selectedSKUId) || product.skus[0];

  // Check if the current product (any SKU) is in the wishlist
  const wishlistItem = items.find((item) => item.product.uid === product.uid);
  const wishlisted = !!wishlistItem;

  const increment = () => setQuantity((prev) => Math.min(prev + 1, currentSKU.availableQuantity));
  const decrement = () => setQuantity((prev) => Math.max(1, prev - 1));

  const handleAdd = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    setCartProcessing(true);
    try {
      await addToCart({
        productUid: product.uid,
        skuUid: currentSKU.uid,
        quantity,
        attributes: currentSKU.attributes || {},
      });
      alert(`Added ${quantity} item(s) to cart!`);
      setQuantity(1);
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
      alert(error.message || 'Failed to add item to cart');
    } finally {
      setCartProcessing(false);
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    setWishlistProcessing(true);
    try {
      if (wishlistItem) {
        // Remove from wishlist
        await removeFromWishlist(wishlistItem.uid);
      } else {
        // Add currently selected SKU to wishlist
        await addToWishlist(currentSKU.uid);
      }
    } catch (err: any) {
      console.error('Wishlist operation failed:', err);
      alert(err.message || 'Failed to update wishlist');
    } finally {
      setWishlistProcessing(false);
    }
  };

  return (
    <>
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        message="Please login to add items to your cart"
      />

      <div className="flex flex-col gap-4">
      {/* SKU Selector */}
      {product.skus.length > 1 && (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[--color-primary-lighter]">
            Select Variant
          </p>
          <div className="flex flex-wrap gap-3">
            {product.skus.map((sku) => (
              <button
                key={sku.uid}
                type="button"
                onClick={() => setSelectedSKUId(sku.uid)}
                disabled={!sku.inStock}
                className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                  selectedSKUId === sku.uid
                    ? "border-[--color-primary] bg-[--color-bg-secondary] text-[--color-primary-dark]"
                    : sku.inStock
                    ? "border-[--color-border-primary] text-zinc-500 hover:border-[--color-border-light]"
                    : "border-[--color-border-primary] text-zinc-300 cursor-not-allowed"
                }`}
              >
                {getSkuDisplayName(sku)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Display */}
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-[--color-primary]">
          {formatPrice(currentSKU.priceCents)}
        </span>
        {currentSKU.compareAtPriceCents && (
          <span className="text-lg text-zinc-400 line-through">
            {formatPrice(currentSKU.compareAtPriceCents)}
          </span>
        )}
        {currentSKU.compareAtPriceCents && (
          <span className="rounded-full bg-[--color-accent-red-bg] px-2 py-0.5 text-xs font-semibold text-[--color-accent-red]">
            {Math.round(((currentSKU.compareAtPriceCents - currentSKU.priceCents) / currentSKU.compareAtPriceCents) * 100)}% OFF
          </span>
        )}
      </div>

      {/* Stock Status */}
      <p className="text-sm text-zinc-500">
        {currentSKU.inStock && currentSKU.availableQuantity > 0 ? (
          <span className="text-[--color-primary]">In Stock ({currentSKU.availableQuantity} available)</span>
        ) : (
          <span className="text-red-500">Out of Stock</span>
        )}
      </p>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4 rounded-full border border-[--color-border-lighter] px-4 py-3 text-base font-semibold text-[--color-primary-dark]">
          <button
            type="button"
            onClick={decrement}
            className="text-2xl leading-none text-[--color-primary]"
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            type="button"
            onClick={increment}
            disabled={quantity >= currentSKU.availableQuantity}
            className="text-2xl leading-none text-[--color-primary] disabled:opacity-50"
          >
            +
          </button>
          {currentSKU.compareAtPriceCents && (
            <span className="ml-3 rounded-full border border-[--color-primary]/20 px-3 py-1 text-xs font-semibold text-[--color-primary]">
              Limited Offer
            </span>
          )}
        </div>
        <button
          onClick={handleAdd}
          disabled={!currentSKU.inStock || currentSKU.availableQuantity === 0 || cartProcessing}
          className="flex-1 rounded-full bg-[--color-primary] px-6 py-3 text-base font-semibold uppercase tracking-wide text-white shadow-[0_18px_35px_rgba(77,156,44,0.25)] transition hover:bg-[--color-primary-darker] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cartProcessing ? "Adding..." : "Add to Cart"}
        </button>
        <button
          onClick={handleWishlist}
          disabled={wishlistProcessing}
          className={`flex-1 rounded-full border border-[--color-border-lighter] px-6 py-3 text-base font-semibold uppercase tracking-wide transition ${
            wishlisted
              ? "border-[--color-primary] text-[--color-primary] bg-[--color-bg-primary]"
              : "text-[--color-primary] hover:bg-[--color-bg-primary]"
          } ${wishlistProcessing ? "opacity-50 cursor-wait" : ""}`}
        >
          {wishlistProcessing ? "Processing..." : wishlisted ? "Wishlisted" : "Add to Wishlist"}
        </button>
      </div>
    </div>
    </>
  );
}
