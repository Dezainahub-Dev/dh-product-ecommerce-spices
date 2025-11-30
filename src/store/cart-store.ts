'use client';

import { create } from "zustand";
import { guestCartService, GuestCartItem } from "@/lib/guest-cart";

/**
 * Simple cart store for guest users (unauthenticated)
 * For authenticated users, use the useCart hook which integrates with the API
 *
 * This store manages localStorage for guest cart and provides a simple interface
 * Guest cart items will be merged into authenticated cart upon login
 */
type GuestCartStore = {
  items: GuestCartItem[];
  addItem: (item: GuestCartItem) => void;
  updateQuantity: (productUid: string, skuUid: string, quantity: number) => void;
  removeItem: (productUid: string, skuUid: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
  syncWithLocalStorage: () => void;
};

export const useCartStore = create<GuestCartStore>((set, get) => ({
  items: [],

  addItem: (item: GuestCartItem) => {
    const updatedItems = guestCartService.addItem(item);
    set({ items: updatedItems });
  },

  updateQuantity: (productUid: string, skuUid: string, quantity: number) => {
    const updatedItems = guestCartService.updateQuantity(productUid, skuUid, quantity);
    set({ items: updatedItems });
  },

  removeItem: (productUid: string, skuUid: string) => {
    const updatedItems = guestCartService.removeItem(productUid, skuUid);
    set({ items: updatedItems });
  },

  clearCart: () => {
    guestCartService.clear();
    set({ items: [] });
  },

  getItemCount: () => {
    return guestCartService.getItemCount();
  },

  syncWithLocalStorage: () => {
    const items = guestCartService.getItems();
    set({ items });
  },
}));
