import { useState, useEffect, useCallback } from 'react';
import { wishlistService, WishlistItem } from '@/lib/wishlist';
import { useAuth } from './useAuth';

interface UseWishlistResult {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
  addToWishlist: (skuUid: string) => Promise<void>;
  removeFromWishlist: (wishlistItemUid: string) => Promise<void>;
  moveToCart: (wishlistItemUid: string, quantity?: number) => Promise<void>;
  refetch: () => Promise<void>;
  isInWishlist: (skuUid: string) => boolean;
}

export function useWishlist(): UseWishlistResult {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const wishlistItems = await wishlistService.getWishlist();
      setItems(wishlistItems);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch wishlist');
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = useCallback(
    async (skuUid: string) => {
      if (!isAuthenticated) {
        throw new Error('Please login to add items to wishlist');
      }

      try {
        setError(null);
        const newItem = await wishlistService.addToWishlist(skuUid);

        // Check if item already exists (idempotent operation)
        const existingIndex = items.findIndex((item) => item.sku.uid === skuUid);

        if (existingIndex >= 0) {
          // Item already exists, update it
          setItems((prev) => {
            const updated = [...prev];
            updated[existingIndex] = newItem;
            return updated;
          });
        } else {
          // Add new item to the beginning (most recent first)
          setItems((prev) => [newItem, ...prev]);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to add to wishlist');
        throw err;
      }
    },
    [isAuthenticated, items]
  );

  const removeFromWishlist = useCallback(
    async (wishlistItemUid: string) => {
      if (!isAuthenticated) {
        throw new Error('Please login to remove items from wishlist');
      }

      try {
        setError(null);
        await wishlistService.removeFromWishlist(wishlistItemUid);

        // Remove item from local state
        setItems((prev) => prev.filter((item) => item.uid !== wishlistItemUid));
      } catch (err: any) {
        setError(err.message || 'Failed to remove from wishlist');
        throw err;
      }
    },
    [isAuthenticated]
  );

  const moveToCart = useCallback(
    async (wishlistItemUid: string, quantity: number = 1) => {
      if (!isAuthenticated) {
        throw new Error('Please login to move items to cart');
      }

      try {
        setError(null);
        await wishlistService.moveToCart(wishlistItemUid, quantity);

        // Remove item from local state (it's moved to cart)
        setItems((prev) => prev.filter((item) => item.uid !== wishlistItemUid));
      } catch (err: any) {
        setError(err.message || 'Failed to move to cart');
        throw err;
      }
    },
    [isAuthenticated]
  );

  const isInWishlist = useCallback(
    (skuUid: string): boolean => {
      return items.some((item) => item.sku.uid === skuUid);
    },
    [items]
  );

  return {
    items,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    refetch: fetchWishlist,
    isInWishlist,
  };
}
