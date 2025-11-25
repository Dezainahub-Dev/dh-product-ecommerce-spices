'use client';

import { create } from "zustand";
import { getProductBySlug, Product } from "@/data/products";

export type CartItem = {
  slug: string;
  quantity: number;
};

type CartProductEntry = {
  product: Product;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  products: CartProductEntry[];
  subtotal: number;
  addItem: (slug: string, quantity?: number) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
};

const mapItemsToProducts = (
  items: CartItem[]
): CartProductEntry[] =>
  items
    .map(({ slug, quantity }) => {
      const product = getProductBySlug(slug);
      if (!product) return null;
      return { product, quantity };
    })
    .filter(
      (
        entry
      ): entry is CartProductEntry => Boolean(entry)
    );

const calculateSubtotal = (
  products: CartProductEntry[]
) =>
  products.reduce(
    (total, entry) =>
      total + entry.product.price * entry.quantity,
    0
  );

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  products: [],
  subtotal: 0,
  addItem: (slug, quantity = 1) =>
    set((state) => {
      const existing = state.items.find(
        (item) => item.slug === slug
      );
      const items = existing
        ? state.items.map((item) =>
            item.slug === slug
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                }
              : item
          )
        : [...state.items, { slug, quantity }];
      const products = mapItemsToProducts(items);
      return {
        items,
        products,
        subtotal: calculateSubtotal(products),
      };
    }),
  updateQuantity: (slug, quantity) =>
    set((state) => {
      const items = state.items
        .map((item) =>
          item.slug === slug ? { ...item, quantity } : item
        )
        .filter((item) => item.quantity > 0);
      const products = mapItemsToProducts(items);
      return {
        items,
        products,
        subtotal: calculateSubtotal(products),
      };
    }),
  removeItem: (slug) =>
    set((state) => {
      const items = state.items.filter(
        (item) => item.slug !== slug
      );
      const products = mapItemsToProducts(items);
      return {
        items,
        products,
        subtotal: calculateSubtotal(products),
      };
    }),
  clearCart: () =>
    set(() => ({
      items: [],
      products: [],
      subtotal: 0,
    })),
}));
