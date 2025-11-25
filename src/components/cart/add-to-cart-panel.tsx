'use client';

import { useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import type { Product } from "@/data/products";

type AddToCartPanelProps = {
  slug: string;
  product: Product;
};

export function AddToCartPanel({ slug, product }: AddToCartPanelProps) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleItem = useWishlistStore((state) => state.toggleItem);
  const wishlisted = useWishlistStore((state) =>
    state.items.includes(slug)
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedSKU, setSelectedSKU] = useState(product.skus[0]?.size || "50gm");

  const currentSKU = product.skus.find(sku => sku.size === selectedSKU) || product.skus[0];

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => Math.max(1, prev - 1));

  const handleAdd = () => {
    addItem(slug, quantity, selectedSKU);
    setQuantity(1);
  };

  const handleWishlist = () => {
    toggleItem(slug);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* SKU Selector */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary-lighter">
          Select Size
        </p>
        <div className="flex flex-wrap gap-3">
          {product.skus.map((sku) => (
            <button
              key={sku.size}
              type="button"
              onClick={() => setSelectedSKU(sku.size)}
              className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                selectedSKU === sku.size
                  ? "border-primary bg-bg-secondary text-primary-dark"
                  : "border-border-primary text-zinc-500 hover:border-border-light"
              }`}
            >
              {sku.size}
            </button>
          ))}
        </div>
      </div>

      {/* Price Display */}
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-primary">
          ₹{currentSKU.price.toFixed(2)}
        </span>
        {currentSKU.oldPrice && (
          <span className="text-lg text-zinc-400 line-through">
            ₹{currentSKU.oldPrice.toFixed(2)}
          </span>
        )}
        {currentSKU.oldPrice && (
          <span className="rounded-full bg-accent-red-bg px-2 py-0.5 text-xs font-semibold text-accent-red">
            {Math.round(((currentSKU.oldPrice - currentSKU.price) / currentSKU.oldPrice) * 100)}% OFF
          </span>
        )}
      </div>

      {/* Stock Status */}
      <p className="text-sm text-zinc-500">
        {currentSKU.stock > 0 ? (
          <span className="text-primary">In Stock ({currentSKU.stock} available)</span>
        ) : (
          <span className="text-red-500">Out of Stock</span>
        )}
      </p>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4 rounded-full border border-border-lighter px-4 py-3 text-base font-semibold text-primary-dark">
          <button
            type="button"
            onClick={decrement}
            className="text-2xl leading-none text-primary"
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            type="button"
            onClick={increment}
            className="text-2xl leading-none text-primary"
          >
            +
          </button>
          <span className="ml-3 rounded-full border border-primary/20 px-3 py-1 text-xs font-semibold text-primary">
            Limited Offer
          </span>
        </div>
        <button
          onClick={handleAdd}
          disabled={currentSKU.stock === 0}
          className="flex-1 rounded-full bg-primary px-6 py-3 text-base font-semibold uppercase tracking-wide text-white shadow-[0_18px_35px_rgba(77,156,44,0.25)] transition hover:bg-primary-darker disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add to Cart
        </button>
        <button
          onClick={handleWishlist}
          className={`flex-1 rounded-full border border-border-lighter px-6 py-3 text-base font-semibold uppercase tracking-wide transition ${
            wishlisted
              ? "border-primary text-primary bg-bg-primary"
              : "text-primary hover:bg-bg-primary"
          }`}
        >
          {wishlisted ? "Wishlisted" : "Add to Wishlist"}
        </button>
      </div>
    </div>
  );
}
