import { apiClient } from './api-client';

// Types based on API documentation
export interface WishlistItem {
  uid: string;
  addedAt: string;
  sku: {
    uid: string;
    skuCode: string;
    priceCents: number;
    currency: string;
    compareAtPriceCents: number | null;
    stockTracking: boolean;
    backorderable: boolean;
  };
  product: {
    uid: string;
    title: string;
    slug: string;
    status: string;
    images: Array<{
      uid: string;
      url: string;
      altText: string | null;
      isPrimary: boolean;
    }>;
  };
  stockInfo?: {
    available: number;
    reserved: number;
    isInStock: boolean;
  };
}

export interface AddToWishlistRequest {
  skuUid: string;
}

export interface MoveToCartRequest {
  quantity?: number;
}

export interface MoveToCartResponse {
  message: string;
  cartItemUid?: string;
}

class WishlistService {
  /**
   * Get all items in the customer's wishlist
   * @returns Promise<WishlistItem[]>
   */
  async getWishlist(): Promise<WishlistItem[]> {
    return apiClient.get<WishlistItem[]>('/api/customer/wishlist');
  }

  /**
   * Add a SKU to the wishlist
   * @param skuUid - SKU unique identifier
   * @returns Promise<WishlistItem>
   */
  async addToWishlist(skuUid: string): Promise<WishlistItem> {
    return apiClient.post<WishlistItem>('/api/customer/wishlist', { skuUid });
  }

  /**
   * Remove an item from the wishlist
   * @param wishlistItemUid - Wishlist item unique identifier
   * @returns Promise<{message: string}>
   */
  async removeFromWishlist(wishlistItemUid: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/api/customer/wishlist/${wishlistItemUid}`);
  }

  /**
   * Move a wishlist item to cart
   * @param wishlistItemUid - Wishlist item unique identifier
   * @param quantity - Quantity to add to cart (default: 1)
   * @returns Promise<MoveToCartResponse>
   */
  async moveToCart(
    wishlistItemUid: string,
    quantity: number = 1
  ): Promise<MoveToCartResponse> {
    return apiClient.post<MoveToCartResponse>(
      `/api/customer/wishlist/${wishlistItemUid}/move-to-cart`,
      { quantity }
    );
  }
}

export const wishlistService = new WishlistService();

/**
 * Format price from cents to display format
 * @param priceCents - Price in cents
 * @param currency - Currency code (default: INR)
 * @returns Formatted price string
 */
export function formatPrice(priceCents: number, currency: string = 'INR'): string {
  const price = priceCents / 100;

  if (currency === 'INR') {
    return `₹${price.toFixed(2)}`;
  } else if (currency === 'USD') {
    return `$${price.toFixed(2)}`;
  }

  return `${currency} ${price.toFixed(2)}`;
}
