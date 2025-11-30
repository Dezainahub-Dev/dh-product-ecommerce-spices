"use client";

import { MouseEvent, useTransition } from "react";
import { useWishlistStore } from "@/store/wishlist-store";

type WishlistHeartButtonProps = {
  slug: string;
};

export function WishlistHeartButton({ slug }: WishlistHeartButtonProps) {
  const toggleItem = useWishlistStore(
    (state) => state.toggleItem
  );
  const active = useWishlistStore((state) =>
    state.items.includes(slug)
  );
  const [isPending, startTransition] = useTransition();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    startTransition(() => toggleItem(slug));
  };

  return (
    <button
      type="button"
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      onClick={handleClick}
      disabled={isPending}
      className={`absolute right-4 top-4 inline-flex h-12 w-12 items-center justify-center rounded-full border bg-white/90 shadow transition ${
        active
          ? "border-[var(--color-primary)] text-[var(--color-accent-red-heart)]"
          : "border-white text-zinc-400 hover:text-[var(--color-text-dark)]"
      } ${isPending ? "opacity-70" : ""}`}
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
