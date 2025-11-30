import { useState, useEffect } from 'react';
import { productService, ProductDetail } from '@/lib/products';

interface UseProductDetailResult {
  product: ProductDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProductDetail(productUid: string | null): UseProductDetailResult {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    if (!productUid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await productService.getProductDetail(productUid);
      setProduct(data);
    } catch (err: any) {
      if (err.message?.includes('404') || err.message?.includes('not found')) {
        setError('Product not found');
      } else {
        setError(err.message || 'Failed to fetch product');
      }
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productUid]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
}
