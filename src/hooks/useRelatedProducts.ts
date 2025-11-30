import { useState, useEffect } from 'react';
import { productService, ProductListItem } from '@/lib/products';

interface UseRelatedProductsResult {
  relatedProducts: ProductListItem[];
  loading: boolean;
  error: string | null;
}

export function useRelatedProducts(productUid: string | null): UseRelatedProductsResult {
  const [relatedProducts, setRelatedProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productUid) {
      setLoading(false);
      return;
    }

    const fetchRelated = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await productService.getRelatedProducts(productUid);
        setRelatedProducts(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch related products');
        setRelatedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [productUid]);

  return {
    relatedProducts,
    loading,
    error,
  };
}
