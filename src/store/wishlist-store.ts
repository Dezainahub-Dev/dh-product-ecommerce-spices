'use client';

import { create } from "zustand";
import { getProductBySlug, Product } from "@/data/products";

type WishlistStore = {
  items: string[];
  products: Product[];
  addItem: (slug: string) => void;
  removeItem: (slug: string) => void;
  toggleItem: (slug: string) => void;
  clear: () => void;
};

const mapItemsToProducts = (items: string[]): Product[] =>
  items
    .map((slug) => getProductBySlug(slug))
    .filter(
      (product): product is Product => Boolean(product)
    );

export const useWishlistStore = create<WishlistStore>(
  (set) => ({
    items: [],
    products: [],
    addItem: (slug) =>
      set((state) => {
        if (state.items.includes(slug)) {
          return state;
        }
        const items = [...state.items, slug];
        return {
          items,
          products: mapItemsToProducts(items),
        };
      }),
    removeItem: (slug) =>
      set((state) => {
        const items = state.items.filter(
          (item) => item !== slug
        );
        return {
          items,
          products: mapItemsToProducts(items),
        };
      }),
    toggleItem: (slug) =>
      set((state) => {
        const items = state.items.includes(slug)
          ? state.items.filter((item) => item !== slug)
          : [...state.items, slug];
        return {
          items,
          products: mapItemsToProducts(items),
        };
      }),
    clear: () =>
      set(() => ({
        items: [],
        products: [],
      })),
  })
);
