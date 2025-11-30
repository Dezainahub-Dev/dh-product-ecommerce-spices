'use client';

import { create } from "zustand";

/**
 * Simple wishlist store for tracking SKU UIDs in wishlist
 * For full wishlist functionality with API integration, use the useWishlist hook
 */
type WishlistStore = {
  items: string[]; // Array of SKU UIDs
  addItem: (skuUid: string) => void;
  removeItem: (skuUid: string) => void;
  toggleItem: (skuUid: string) => void;
  clear: () => void;
};

export const useWishlistStore = create<WishlistStore>(
  (set) => ({
    items: [],
    addItem: (skuUid) =>
      set((state) => {
        if (state.items.includes(skuUid)) {
          return state;
        }
        return {
          items: [...state.items, skuUid],
        };
      }),
    removeItem: (skuUid) =>
      set((state) => ({
        items: state.items.filter((item) => item !== skuUid),
      })),
    toggleItem: (skuUid) =>
      set((state) => {
        const items = state.items.includes(skuUid)
          ? state.items.filter((item) => item !== skuUid)
          : [...state.items, skuUid];
        return { items };
      }),
    clear: () =>
      set(() => ({
        items: [],
      })),
  })
);
