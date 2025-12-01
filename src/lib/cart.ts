import { apiClient } from './api-client';

// Types based on API documentation
export interface CartItem {
  itemUid: string;
  product: {
    uid: string;
    name: string;
    thumbnail?: string;
    slug: string;
  };
  sku: {
    uid: string;
    code: string;
    attributes?: Record<string, any>;
  };
  quantity: number;
  unitPriceCents: number;
  totalPriceCents: number;
  isInStock: boolean;
  availableQty: number;
}

export interface Discount {
  code: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  valueCents: number;
}

export interface CartSummary {
  subtotalCents: number;
  discountCents: number;
  taxCents: number;
  shippingCents: number;
  totalCents: number;
}

export interface Cart {
  cartUid: string;
  items: CartItem[];
  discounts: Discount[];
  summary: CartSummary;
}

export interface AddItemRequest {
  productUid: string;
  skuUid: string;
  quantity: number;
  attributes?: Record<string, any>;
}

export interface UpdateQuantityRequest {
  quantity: number;
}

export interface ApplyCouponRequest {
  code: string;
}

export interface ApplyCouponResponse {
  success: boolean;
  code: string;
  message: string;
  cart: Cart;
}

export interface CartAdjustment {
  itemUid: string;
  type: 'quantity_reduced' | 'removed';
  reason: string;
  previousQty?: number;
  newQty?: number;
}

export interface ValidateCartResponse {
  cart: Cart;
  adjustments: CartAdjustment[];
  canProceed: boolean;
}

export interface ShippingEstimateRequest {
  destination: {
    postalCode?: string;
    city: string;
    state: string;
    country: string;
  };
}

export interface ShippingEstimateResponse {
  shippingCents: number;
  serviceName: string;
  estimatedDeliveryFrom: string;
  estimatedDeliveryTo: string;
}

export interface MergeCartRequest {
  items: Array<{
    productUid: string;
    skuUid: string;
    quantity: number;
    attributes?: Record<string, any>;
  }>;
}

class CartService {
  /**
   * Get the current active cart for authenticated user
   */
  async getCart(): Promise<Cart> {
    return apiClient.get<Cart>('/customer/cart');
  }

  /**
   * Add an item to the cart
   */
  async addItem(data: AddItemRequest): Promise<Cart> {
    return apiClient.post<Cart>('/customer/cart/items', data);
  }

  /**
   * Update cart item quantity
   */
  async updateItemQuantity(itemUid: string, quantity: number): Promise<Cart> {
    return apiClient.patch<Cart>(`/customer/cart/items/${itemUid}`, { quantity });
  }

  /**
   * Remove an item from the cart
   */
  async removeItem(itemUid: string): Promise<Cart> {
    return apiClient.delete<Cart>(`/customer/cart/items/${itemUid}`);
  }

  /**
   * Merge guest cart items into authenticated cart
   */
  async mergeGuestCart(items: MergeCartRequest['items']): Promise<Cart> {
    return apiClient.post<Cart>('/customer/cart/merge', { items });
  }

  /**
   * Validate cart before checkout
   */
  async validateCart(): Promise<ValidateCartResponse> {
    return apiClient.post<ValidateCartResponse>('/customer/cart/validate', {});
  }

  /**
   * Apply a coupon code to the cart
   */
  async applyCoupon(code: string): Promise<ApplyCouponResponse> {
    return apiClient.post<ApplyCouponResponse>('/customer/cart/apply-coupon', { code });
  }

  /**
   * Remove applied coupon from cart
   */
  async removeCoupon(): Promise<Cart> {
    return apiClient.delete<Cart>('/customer/cart/coupon');
  }

  /**
   * Get shipping estimate for a destination
   */
  async getShippingEstimate(destination: ShippingEstimateRequest['destination']): Promise<ShippingEstimateResponse> {
    return apiClient.post<ShippingEstimateResponse>('/customer/cart/shipping-estimate', { destination });
  }
}

export const cartService = new CartService();

/**
 * Format price from cents to display format
 */
export function formatCartPrice(priceCents: number, currency: string = 'INR'): string {
  const price = priceCents / 100;

  if (currency === 'INR') {
    return `₹${price.toFixed(2)}`;
  } else if (currency === 'USD') {
    return `$${price.toFixed(2)}`;
  }

  return `${currency} ${price.toFixed(2)}`;
}
