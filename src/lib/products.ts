import { apiClient } from './api-client';

// Product Types from API
export interface ProductListItem {
  uid: string;
  title: string;
  slug: string;
  description?: string | null;
  basePrice: string;
  imageUrl?: string | null;
  category?: {
    uid: string;
    name: string;
    slug: string;
  } | null;
  brand?: {
    uid: string;
    name: string;
    slug: string;
  } | null;
  skuCount: number;
  inStock: boolean;
  minPriceCents: number;
  maxPriceCents?: number | null;
  createdAt: string;
  updatedAt: string;
  ingredients?: string[] | null;
  manufacturerInfo?: any | null;
}

export interface ProductImage {
  uid: string;
  url: string;
  altText?: string | null;
  position: number;
  isPrimary: boolean;
}

export interface Sku {
  uid: string;
  skuCode: string;
  priceCents: number;
  currency: string;
  compareAtPriceCents?: number | null;
  inStock: boolean;
  availableQuantity: number;
  attributes?: {
    [key: string]: {
      label: string;
      value: string;
      code: string;
    };
  } | null;
  images?: string[];
}

export interface ProductDetail {
  uid: string;
  title: string;
  slug: string;
  description?: string | null;
  basePrice: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  category: {
    uid: string;
    name: string;
    slug: string;
    description?: string | null;
  };
  brand?: {
    uid: string;
    name: string;
    slug: string;
    logoUrl?: string | null;
  } | null;
  images: ProductImage[];
  skus: Sku[];
  inStock: boolean;
  minPriceCents: number;
  maxPriceCents?: number | null;
  totalSkus: number;
  averageRating?: number | null;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  ingredients?: string[] | null;
  manufacturerInfo?: any | null;
}

export interface ProductListResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  products: ProductListItem[];
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface ProductSearchFilters {
  page?: number;
  limit?: number;
  q?: string;
  categories?: string[];
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  attributes?: Record<string, string[]>;
  sortBy?: 'createdAt' | 'price' | 'title' | 'relevance';
  sortOrder?: 'asc' | 'desc';
}

export const productService = {
  /**
   * Browse products with filters
   */
  async browseProducts(filters: ProductFilters = {}): Promise<ProductListResponse> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    return apiClient.get<ProductListResponse>(
      `/api/customer/products?${params.toString()}`
    );
  },

  /**
   * Search products with advanced filters
   */
  async searchProducts(filters: ProductSearchFilters = {}): Promise<ProductListResponse> {
    const params = new URLSearchParams();

    // Handle simple filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && !['categories', 'brands', 'attributes'].includes(key)) {
        params.append(key, String(value));
      }
    });

    // Handle array filters
    if (filters.categories) {
      filters.categories.forEach(cat => params.append('categories[]', cat));
    }
    if (filters.brands) {
      filters.brands.forEach(brand => params.append('brands[]', brand));
    }

    // Handle attribute filters
    if (filters.attributes) {
      Object.entries(filters.attributes).forEach(([key, values]) => {
        values.forEach(value => params.append(`attributes[${key}][]`, value));
      });
    }

    return apiClient.get<ProductListResponse>(
      `/api/customer/products/search?${params.toString()}`
    );
  },

  /**
   * Get product detail by UID
   */
  async getProductDetail(productUid: string): Promise<ProductDetail> {
    return apiClient.get<ProductDetail>(`/api/customer/products/${productUid}`);
  },

  /**
   * Get product SKUs/variants
   */
  async getProductSkus(productUid: string): Promise<Sku[]> {
    return apiClient.get<Sku[]>(`/api/customer/products/${productUid}/skus`);
  },

  /**
   * Get related products
   */
  async getRelatedProducts(productUid: string): Promise<ProductListItem[]> {
    return apiClient.get<ProductListItem[]>(
      `/api/customer/products/${productUid}/related`
    );
  },

  /**
   * Find product by slug (searches through products to find matching slug)
   */
  async findProductBySlug(slug: string): Promise<ProductListItem | null> {
    // Try searching with the slug as a query
    const response = await this.searchProducts({ q: slug, limit: 50 });
    const product = response.products.find(p => p.slug === slug);
    return product || null;
  },
};

/**
 * Utility function to format price from cents
 */
export function formatPrice(cents: number, currency: string = 'INR'): string {
  const symbol = currency === 'INR' ? '₹' : '$';
  return `${symbol}${(cents / 100).toFixed(2)}`;
}

/**
 * Utility function to convert price to cents
 */
export function priceToClass(price: number): number {
  return Math.round(price * 100);
}
