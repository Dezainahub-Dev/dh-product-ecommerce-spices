import { useState, useEffect, useCallback } from 'react';
import { cartService, Cart, AddItemRequest, ApplyCouponResponse, ValidateCartResponse, ShippingEstimateResponse } from '@/lib/cart';
import { useAuth } from './useAuth';

interface UseCartResult {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addItem: (data: AddItemRequest) => Promise<Cart>;
  updateQuantity: (itemUid: string, quantity: number) => Promise<Cart>;
  removeItem: (itemUid: string) => Promise<Cart>;
  applyCoupon: (code: string) => Promise<ApplyCouponResponse>;
  removeCoupon: () => Promise<Cart>;
  validateCart: () => Promise<ValidateCartResponse>;
  getShippingEstimate: (destination: {
    postalCode?: string;
    city: string;
    state: string;
    country: string;
  }) => Promise<ShippingEstimateResponse>;
  itemCount: number;
}

export function useCart(): UseCartResult {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await cartService.getCart();
      setCart(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch cart');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = useCallback(
    async (data: AddItemRequest): Promise<Cart> => {
      if (!isAuthenticated) {
        throw new Error('Please login to add items to cart');
      }

      try {
        setError(null);
        const updatedCart = await cartService.addItem(data);
        setCart(updatedCart);
        return updatedCart;
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to add item to cart';
        setError(errorMessage);
        throw err;
      }
    },
    [isAuthenticated]
  );

  const updateQuantity = useCallback(
    async (itemUid: string, quantity: number): Promise<Cart> => {
      if (!isAuthenticated) {
        throw new Error('Please login to update cart');
      }

      try {
        setError(null);
        const updatedCart = await cartService.updateItemQuantity(itemUid, quantity);
        setCart(updatedCart);
        return updatedCart;
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to update cart item';
        setError(errorMessage);
        throw err;
      }
    },
    [isAuthenticated]
  );

  const removeItem = useCallback(
    async (itemUid: string): Promise<Cart> => {
      if (!isAuthenticated) {
        throw new Error('Please login to remove items from cart');
      }

      try {
        setError(null);
        const updatedCart = await cartService.removeItem(itemUid);
        setCart(updatedCart);
        return updatedCart;
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to remove item from cart';
        setError(errorMessage);
        throw err;
      }
    },
    [isAuthenticated]
  );

  const applyCoupon = useCallback(
    async (code: string): Promise<ApplyCouponResponse> => {
      if (!isAuthenticated) {
        throw new Error('Please login to apply coupons');
      }

      try {
        setError(null);
        const result = await cartService.applyCoupon(code);
        setCart(result.cart);
        return result;
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to apply coupon';
        setError(errorMessage);
        throw err;
      }
    },
    [isAuthenticated]
  );

  const removeCoupon = useCallback(
    async (): Promise<Cart> => {
      if (!isAuthenticated) {
        throw new Error('Please login to remove coupons');
      }

      try {
        setError(null);
        const updatedCart = await cartService.removeCoupon();
        setCart(updatedCart);
        return updatedCart;
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to remove coupon';
        setError(errorMessage);
        throw err;
      }
    },
    [isAuthenticated]
  );

  const validateCart = useCallback(
    async (): Promise<ValidateCartResponse> => {
      if (!isAuthenticated) {
        throw new Error('Please login to validate cart');
      }

      try {
        setError(null);
        const result = await cartService.validateCart();
        setCart(result.cart);
        return result;
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to validate cart';
        setError(errorMessage);
        throw err;
      }
    },
    [isAuthenticated]
  );

  const getShippingEstimate = useCallback(
    async (destination: {
      postalCode?: string;
      city: string;
      state: string;
      country: string;
    }): Promise<ShippingEstimateResponse> => {
      if (!isAuthenticated) {
        throw new Error('Please login to get shipping estimate');
      }

      try {
        setError(null);
        const estimate = await cartService.getShippingEstimate(destination);
        return estimate;
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to get shipping estimate';
        setError(errorMessage);
        throw err;
      }
    },
    [isAuthenticated]
  );

  // Calculate total item count
  const itemCount = cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;

  return {
    cart,
    loading,
    error,
    fetchCart,
    addItem,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    validateCart,
    getShippingEstimate,
    itemCount,
  };
}
