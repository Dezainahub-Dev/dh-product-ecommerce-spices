const GUEST_CART_KEY = 'guest_cart';

export interface GuestCartItem {
  productUid: string;
  skuUid: string;
  quantity: number;
  attributes?: Record<string, any>;
  // Local metadata for display
  productName?: string;
  productSlug?: string;
  skuCode?: string;
  thumbnail?: string;
}

export interface PricePreviewItem {
  productUid: string;
  skuUid: string;
  quantity: number;
  unitPriceCents: number;
  totalPriceCents: number;
  isInStock: boolean;
  availableQty: number;
}

export interface PricePreviewResponse {
  items: PricePreviewItem[];
  summary: {
    subtotalCents: number;
    discountCents: number;
    taxCents: number;
    shippingCents: number;
    totalCents: number;
  };
}

class GuestCartService {
  /**
   * Get all guest cart items from localStorage
   */
  getItems(): GuestCartItem[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(GUEST_CART_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Add an item to guest cart
   */
  addItem(item: GuestCartItem): GuestCartItem[] {
    const items = this.getItems();
    const existingIndex = items.findIndex(
      (i) => i.productUid === item.productUid && i.skuUid === item.skuUid
    );

    if (existingIndex >= 0) {
      // Update quantity if item exists
      items[existingIndex].quantity += item.quantity;
    } else {
      // Add new item
      items.push(item);
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
    }
    return items;
  }

  /**
   * Update quantity of a guest cart item
   */
  updateQuantity(productUid: string, skuUid: string, quantity: number): GuestCartItem[] {
    const items = this.getItems();
    const item = items.find((i) => i.productUid === productUid && i.skuUid === skuUid);

    if (item) {
      if (quantity <= 0) {
        return this.removeItem(productUid, skuUid);
      } else {
        item.quantity = quantity;
        if (typeof window !== 'undefined') {
          localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
        }
      }
    }

    return this.getItems();
  }

  /**
   * Remove an item from guest cart
   */
  removeItem(productUid: string, skuUid: string): GuestCartItem[] {
    const items = this.getItems();
    const filtered = items.filter(
      (i) => !(i.productUid === productUid && i.skuUid === skuUid)
    );

    if (typeof window !== 'undefined') {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(filtered));
    }
    return filtered;
  }

  /**
   * Clear all guest cart items
   */
  clear(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(GUEST_CART_KEY);
    }
  }

  /**
   * Get price preview for guest cart (public endpoint, no auth required)
   */
  async getPricePreview(): Promise<PricePreviewResponse | null> {
    const items = this.getItems();
    if (items.length === 0) return null;

    try {
      const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'https://dh-ecom-backend.vercel.app'}/api`;
      const response = await fetch(`${API_URL}/public/cart/price-preview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            productUid: item.productUid,
            skuUid: item.skuUid,
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get price preview');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting price preview:', error);
      return null;
    }
  }

  /**
   * Get total item count in guest cart
   */
  getItemCount(): number {
    const items = this.getItems();
    return items.reduce((total, item) => total + item.quantity, 0);
  }
}

export const guestCartService = new GuestCartService();
