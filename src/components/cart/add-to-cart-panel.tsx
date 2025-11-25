'use client';

import { useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

type AddToCartPanelProps = {
  slug: string;
};

export function AddToCartPanel({ slug }: AddToCartPanelProps) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleItem = useWishlistStore((state) => state.toggleItem);
  const wishlisted = useWishlistStore((state) =>
    state.items.includes(slug)
  );
  const [quantity, setQuantity] = useState(1);

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => Math.max(1, prev - 1));

  const handleAdd = () => {
    addItem(slug, quantity);
    setQuantity(1);
  };

  const handleWishlist = () => {
    toggleItem(slug);
  };

  return (
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
        className="flex-1 rounded-full bg-[#4D9C2C] px-6 py-3 text-base font-semibold uppercase tracking-wide text-white shadow-[0_18px_35px_rgba(77,156,44,0.25)] transition hover:bg-[#36701F]"
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
  );
}
