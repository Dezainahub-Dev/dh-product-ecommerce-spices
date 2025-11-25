'use client';

import { create } from "zustand";
import { getProductBySlug, Product } from "@/data/products";

export type CartItem = {
  slug: string;
  quantity: number;
  sku: string;
};

type CartProductEntry = {
  product: Product;
  quantity: number;
  sku: string;
};

type CartStore = {
  items: CartItem[];
  products: CartProductEntry[];
  subtotal: number;
  addItem: (slug: string, quantity?: number, sku?: string) => void;
  updateQuantity: (slug: string, sku: string, quantity: number) => void;
  removeItem: (slug: string, sku: string) => void;
  clearCart: () => void;
};

const mapItemsToProducts = (
  items: CartItem[]
): CartProductEntry[] =>
  items
    .map(({ slug, quantity, sku }) => {
      const product = getProductBySlug(slug);
      if (!product) return null;
      return { product, quantity, sku };
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
    (total, entry) => {
      const skuData = entry.product.skus.find(s => s.size === entry.sku);
      const price = skuData?.price || entry.product.price;
      return total + price * entry.quantity;
    },
    0
  );

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  products: [],
  subtotal: 0,
  addItem: (slug, quantity = 1, sku = "50gm") =>
    set((state) => {
      const existing = state.items.find(
        (item) => item.slug === slug && item.sku === sku
      );
      const items: CartItem[] = existing
        ? state.items.map((item) =>
            item.slug === slug && item.sku === sku
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                }
              : item
          )
        : [...state.items, { slug, quantity, sku }];
      const products = mapItemsToProducts(items);
      return {
        items,
        products,
        subtotal: calculateSubtotal(products),
      };
    }),
  updateQuantity: (slug, sku, quantity) =>
    set((state) => {
      const items: CartItem[] = state.items
        .map((item) =>
          item.slug === slug && item.sku === sku ? { ...item, quantity } : item
        )
        .filter((item) => item.quantity > 0);
      const products = mapItemsToProducts(items);
      return {
        items,
        products,
        subtotal: calculateSubtotal(products),
      };
    }),
  removeItem: (slug, sku) =>
    set((state) => {
      const items = state.items.filter(
        (item) => !(item.slug === slug && item.sku === sku)
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
