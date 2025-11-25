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
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#A1B293]">
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
                  ? "border-[#4D9C2C] bg-[#F6FCEA] text-[#355B20]"
                  : "border-[#E6EEDF] text-zinc-500 hover:border-[#D6E9C6]"
              }`}
            >
              {sku.size}
            </button>
          ))}
        </div>
      </div>

      {/* Price Display */}
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-[#4D9C2C]">
          ₹{currentSKU.price.toFixed(2)}
        </span>
        {currentSKU.oldPrice && (
          <span className="text-lg text-zinc-400 line-through">
            ₹{currentSKU.oldPrice.toFixed(2)}
          </span>
        )}
        {currentSKU.oldPrice && (
          <span className="rounded-full bg-[#FEEFEF] px-2 py-0.5 text-xs font-semibold text-[#E53935]">
            {Math.round(((currentSKU.oldPrice - currentSKU.price) / currentSKU.oldPrice) * 100)}% OFF
          </span>
        )}
      </div>

      {/* Stock Status */}
      <p className="text-sm text-zinc-500">
        {currentSKU.stock > 0 ? (
          <span className="text-[#4D9C2C]">In Stock ({currentSKU.stock} available)</span>
        ) : (
          <span className="text-red-500">Out of Stock</span>
        )}
      </p>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4 rounded-full border border-[#DDE8CC] px-4 py-3 text-base font-semibold text-[#355B20]">
          <button
            type="button"
            onClick={decrement}
            className="text-2xl leading-none text-[#4D9C2C]"
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            type="button"
            onClick={increment}
            className="text-2xl leading-none text-[#4D9C2C]"
          >
            +
          </button>
          <span className="ml-3 rounded-full border border-[#4D9C2C]/20 px-3 py-1 text-xs font-semibold text-[#4D9C2C]">
            Limited Offer
          </span>
        </div>
        <button
          onClick={handleAdd}
          disabled={currentSKU.stock === 0}
          className="flex-1 rounded-full bg-[#4D9C2C] px-6 py-3 text-base font-semibold uppercase tracking-wide text-white shadow-[0_18px_35px_rgba(77,156,44,0.25)] transition hover:bg-[#36701F] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add to Cart
        </button>
        <button
          onClick={handleWishlist}
          className={`flex-1 rounded-full border border-[#DDE8CC] px-6 py-3 text-base font-semibold uppercase tracking-wide transition ${
            wishlisted
              ? "border-[#4D9C2C] text-[#4D9C2C] bg-[#F8FCF2]"
              : "text-[#4D9C2C] hover:bg-[#F8FCF2]"
          }`}
        >
          {wishlisted ? "Wishlisted" : "Add to Wishlist"}
        </button>
      </div>
    </div>
  );
}
