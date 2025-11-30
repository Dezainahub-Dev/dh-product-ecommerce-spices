# Customer Products - Frontend Integration Guide

This guide provides complete documentation for integrating customer product viewing APIs in your frontend application.

## Table of Contents

1. [Overview](#overview)
2. [Base URL](#base-url)
3. [API Endpoints](#api-endpoints)
4. [Query Parameters & Filters](#query-parameters--filters)
5. [Response Structures](#response-structures)
6. [Code Examples](#code-examples)
7. [Best Practices](#best-practices)
8. [Error Handling](#error-handling)

---

## Overview

The customer products API allows customers to:

- Browse and search products
- View product details with variants (SKUs)
- Filter products by category, brand, price range
- Get related products
- View product images, pricing, and stock information

### Key Features

- **Pagination** - Efficient product listing with page-based pagination
- **Filtering** - Filter by category, brand, price range
- **Search** - Full-text search across product titles and descriptions
- **Product Variants** - Support for multiple SKUs/variants per product
- **Stock Management** - Real-time stock availability information
- **Related Products** - Smart product recommendations

### Authentication

**Note:** Product viewing endpoints do **NOT** require authentication. All customers (including guests) can browse and view products.

---

## Base URL

All customer product endpoints are prefixed with `/customer/products`:

```
Base URL: https://your-api-domain.com/customer/products
```

---

## API Endpoints

### 1. Browse Products

**Endpoint:** `GET /customer/products`

**Description:** Get a paginated list of published products with optional filters.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number (min: 1) |
| `limit` | number | No | 20 | Items per page (min: 1, max: 100) |
| `category` | string | No | - | Category UID or slug |
| `brand` | string | No | - | Brand UID or slug |
| `minPrice` | number | No | - | Minimum price in cents |
| `maxPrice` | number | No | - | Maximum price in cents |
| `search` | string | No | - | Search query (searches title, description) |
| `sortBy` | string | No | `createdAt` | Sort field: `createdAt` or `title` |
| `sortOrder` | string | No | `desc` | Sort order: `asc` or `desc` |

**Example Request:**

```bash
GET /customer/products?page=1&limit=20&category=electronics&minPrice=1000&maxPrice=50000&sortBy=createdAt&sortOrder=desc
```

**Response (200 OK):**

```json
{
  "page": 1,
  "limit": 20,
  "total": 150,
  "totalPages": 8,
  "products": [
    {
      "uid": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Wireless Headphones",
      "slug": "wireless-headphones",
      "description": "Premium wireless headphones with noise cancellation",
      "basePrice": "99.99",
      "imageUrl": "https://example.com/images/headphones.jpg",
      "category": {
        "uid": "cat-123",
        "name": "Electronics",
        "slug": "electronics"
      },
      "brand": {
        "uid": "brand-456",
        "name": "TechBrand",
        "slug": "techbrand"
      },
      "skuCount": 3,
      "inStock": true,
      "minPriceCents": 9999,
      "maxPriceCents": 12999,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-20T14:22:00.000Z",
      "ingredients": null,
      "manufacturerInfo": null
    }
  ]
}
```

**Error Responses:**

- `400 Bad Request`: Invalid query parameters
- `500 Internal Server Error`: Server error

---

### 2. Search Products

**Endpoint:** `GET /customer/products/search`

**Description:** Advanced product search with multiple filters and attribute-based filtering.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number (min: 1) |
| `limit` | number | No | 20 | Items per page (min: 1, max: 100) |
| `q` | string | No | - | Search query (searches title, description, SKU code) |
| `categories` | string[] | No | - | Array of category UIDs or slugs |
| `brands` | string[] | No | - | Array of brand UIDs or slugs |
| `minPrice` | number | No | - | Minimum price in cents |
| `maxPrice` | number | No | - | Maximum price in cents |
| `attributes` | object | No | - | Attribute filters (e.g., `{color: ["red", "blue"], size: ["M", "L"]}`) |
| `sortBy` | string | No | `relevance` | Sort field: `createdAt`, `price`, `title`, or `relevance` |
| `sortOrder` | string | No | `desc` | Sort order: `asc` or `desc` |

**Example Request:**

```bash
GET /customer/products/search?q=laptop&categories[]=electronics&categories[]=computers&minPrice=50000&maxPrice=200000&sortBy=price&sortOrder=asc
```

**With Attribute Filters:**

```bash
GET /customer/products/search?q=shirt&attributes[color][]=red&attributes[color][]=blue&attributes[size][]=M&attributes[size][]=L
```

**Response (200 OK):**

Same structure as Browse Products endpoint.

**Error Responses:**

- `400 Bad Request`: Invalid query parameters
- `500 Internal Server Error`: Server error

---

### 3. Get Product Detail

**Endpoint:** `GET /customer/products/:productUid`

**Description:** Get complete product details including all variants (SKUs), images, reviews, and related information.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `productUid` | string | Yes | Product UID (UUID format) |

**Example Request:**

```bash
GET /customer/products/550e8400-e29b-41d4-a716-446655440000
```

**Response (200 OK):**

```json
{
  "uid": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Wireless Headphones",
  "slug": "wireless-headphones",
  "description": "Premium wireless headphones with noise cancellation and 30-hour battery life.",
  "basePrice": "99.99",
  "seoTitle": "Wireless Headphones - Premium Audio",
  "seoDescription": "Buy premium wireless headphones with noise cancellation",
  "category": {
    "uid": "cat-123",
    "name": "Electronics",
    "slug": "electronics",
    "description": "Electronic devices and accessories"
  },
  "brand": {
    "uid": "brand-456",
    "name": "TechBrand",
    "slug": "techbrand",
    "logoUrl": "https://example.com/logos/techbrand.png"
  },
  "images": [
    {
      "uid": "img-001",
      "url": "https://example.com/images/headphones-1.jpg",
      "altText": "Wireless Headphones Front View",
      "position": 0,
      "isPrimary": true
    },
    {
      "uid": "img-002",
      "url": "https://example.com/images/headphones-2.jpg",
      "altText": "Wireless Headphones Side View",
      "position": 1,
      "isPrimary": false
    }
  ],
  "skus": [
    {
      "uid": "sku-001",
      "skuCode": "WH-BLK-001",
      "priceCents": 9999,
      "currency": "INR",
      "compareAtPriceCents": 12999,
      "inStock": true,
      "availableQuantity": 50,
      "attributes": {
        "color": {
          "label": "Black",
          "value": "black",
          "code": "blk"
        }
      },
      "images": [
        "https://example.com/images/headphones-black.jpg"
      ]
    },
    {
      "uid": "sku-002",
      "skuCode": "WH-WHT-001",
      "priceCents": 9999,
      "currency": "INR",
      "compareAtPriceCents": null,
      "inStock": true,
      "availableQuantity": 30,
      "attributes": {
        "color": {
          "label": "White",
          "value": "white",
          "code": "wht"
        }
      },
      "images": [
        "https://example.com/images/headphones-white.jpg"
      ]
    }
  ],
  "inStock": true,
  "minPriceCents": 9999,
  "maxPriceCents": 9999,
  "totalSkus": 2,
  "averageRating": 4.5,
  "reviewCount": 127,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-20T14:22:00.000Z",
  "ingredients": null,
  "manufacturerInfo": {
    "name": "TechBrand Inc.",
    "address": "123 Tech Street, San Francisco, CA",
    "country": "USA"
  }
}
```

**Error Responses:**

- `404 Not Found`: Product not found or not published
- `500 Internal Server Error`: Server error

---

### 4. Get Product SKUs

**Endpoint:** `GET /customer/products/:productUid/skus`

**Description:** Get all available SKUs/variants for a specific product.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `productUid` | string | Yes | Product UID (UUID format) |

**Example Request:**

```bash
GET /customer/products/550e8400-e29b-41d4-a716-446655440000/skus
```

**Response (200 OK):**

```json
[
  {
    "uid": "sku-001",
    "skuCode": "WH-BLK-001",
    "priceCents": 9999,
    "currency": "INR",
    "compareAtPriceCents": 12999,
    "inStock": true,
    "availableQuantity": 50,
    "attributes": {
      "color": {
        "label": "Black",
        "value": "black",
        "code": "blk"
      },
      "size": {
        "label": "Large",
        "value": "large",
        "code": "lg"
      }
    },
    "images": [
      "https://example.com/images/headphones-black.jpg"
    ]
  },
  {
    "uid": "sku-002",
    "skuCode": "WH-WHT-001",
    "priceCents": 9999,
    "currency": "INR",
    "compareAtPriceCents": null,
    "inStock": true,
    "availableQuantity": 30,
    "attributes": {
      "color": {
        "label": "White",
        "value": "white",
        "code": "wht"
      },
      "size": {
        "label": "Large",
        "value": "large",
        "code": "lg"
      }
    },
    "images": [
      "https://example.com/images/headphones-white.jpg"
    ]
  }
]
```

**Error Responses:**

- `404 Not Found`: Product not found or not published
- `500 Internal Server Error`: Server error

---

### 5. Get Related Products

**Endpoint:** `GET /customer/products/:productUid/related`

**Description:** Get related products based on category similarity. Returns up to 8 related products.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `productUid` | string | Yes | Product UID or slug |

**Algorithm:**

1. **Same Category** - Products from the same category (in stock)
2. **Same Parent Category** - If not enough, products from the same parent category
3. **Popular Fallback** - If still not enough, popular/latest products

**Example Request:**

```bash
GET /customer/products/550e8400-e29b-41d4-a716-446655440000/related
```

**Response (200 OK):**

```json
[
  {
    "uid": "550e8400-e29b-41d4-a716-446655440001",
    "title": "Bluetooth Speaker",
    "slug": "bluetooth-speaker",
    "description": "Portable Bluetooth speaker",
    "basePrice": "79.99",
    "imageUrl": "https://example.com/images/speaker.jpg",
    "category": {
      "uid": "cat-123",
      "name": "Electronics",
      "slug": "electronics"
    },
    "brand": {
      "uid": "brand-456",
      "name": "TechBrand",
      "slug": "techbrand"
    },
    "skuCount": 2,
    "inStock": true,
    "minPriceCents": 7999,
    "maxPriceCents": 8999,
    "createdAt": "2024-01-10T08:15:00.000Z",
    "updatedAt": "2024-01-18T12:30:00.000Z",
    "ingredients": null,
    "manufacturerInfo": null
  }
]
```

**Error Responses:**

- `404 Not Found`: Product not found
- `500 Internal Server Error`: Server error

---

## Query Parameters & Filters

### Pagination

```typescript
// Basic pagination
GET /customer/products?page=1&limit=20

// Navigate to next page
GET /customer/products?page=2&limit=20
```

### Category Filtering

```typescript
// Filter by category slug
GET /customer/products?category=electronics

// Filter by category UID
GET /customer/products?category=550e8400-e29b-41d4-a716-446655440000

// Multiple categories (search endpoint)
GET /customer/products/search?categories[]=electronics&categories[]=computers
```

### Brand Filtering

```typescript
// Filter by brand slug
GET /customer/products?brand=nike

// Filter by brand UID
GET /customer/products?brand=550e8400-e29b-41d4-a716-446655440000

// Multiple brands (search endpoint)
GET /customer/products/search?brands[]=nike&brands[]=adidas
```

### Price Range Filtering

```typescript
// Filter by price range (in cents)
GET /customer/products?minPrice=1000&maxPrice=50000

// Minimum price only
GET /customer/products?minPrice=1000

// Maximum price only
GET /customer/products?maxPrice=50000
```

**Note:** Prices are in cents. For example:
- ₹100.00 = 10000 cents
- $50.00 = 5000 cents

### Search

```typescript
// Simple search (browse endpoint)
GET /customer/products?search=laptop

// Advanced search (search endpoint)
GET /customer/products/search?q=laptop%20wireless
```

### Sorting

```typescript
// Sort by creation date (newest first)
GET /customer/products?sortBy=createdAt&sortOrder=desc

// Sort by title (A-Z)
GET /customer/products?sortBy=title&sortOrder=asc

// Sort by price (search endpoint)
GET /customer/products/search?sortBy=price&sortOrder=asc
```

### Attribute Filtering (Search Endpoint Only)

```typescript
// Filter by color
GET /customer/products/search?attributes[color][]=red&attributes[color][]=blue

// Filter by multiple attributes
GET /customer/products/search?attributes[color][]=red&attributes[size][]=M&attributes[size][]=L
```

---

## Response Structures

### Product List Item

```typescript
interface ProductListItem {
  uid: string;                    // Product unique identifier
  title: string;                  // Product title
  slug: string;                   // URL-friendly slug
  description?: string | null;    // Product description
  basePrice: string;              // Base price as string (e.g., "99.99")
  imageUrl?: string | null;       // Primary product image URL
  category?: {                    // Category information
    uid: string;
    name: string;
    slug: string;
  } | null;
  brand?: {                       // Brand information
    uid: string;
    name: string;
    slug: string;
  } | null;
  skuCount: number;               // Number of variants/SKUs
  inStock: boolean;               // Overall stock availability
  minPriceCents: number;           // Minimum price across all SKUs (in cents)
  maxPriceCents?: number | null;  // Maximum price across all SKUs (in cents)
  createdAt: Date;                // Creation timestamp
  updatedAt: Date;                // Last update timestamp
  ingredients?: string[] | null;  // Product ingredients (if applicable)
  manufacturerInfo?: object | null; // Manufacturer details (if applicable)
}
```

### Product Detail

```typescript
interface ProductDetail {
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
  images: ProductImage[];         // Array of product images
  skus: Sku[];                    // Array of product variants
  inStock: boolean;
  minPriceCents: number;
  maxPriceCents?: number | null;
  totalSkus: number;
  averageRating?: number | null;  // Average review rating (1-5)
  reviewCount: number;            // Total number of reviews
  createdAt: Date;
  updatedAt: Date;
  ingredients?: string[] | null;
  manufacturerInfo?: object | null;
}

interface ProductImage {
  uid: string;
  url: string;
  altText?: string | null;
  position: number;               // Display order
  isPrimary: boolean;             // Primary/thumbnail image
}

interface Sku {
  uid: string;
  skuCode: string;                // SKU identifier
  priceCents: number;             // Price in cents
  currency: string;                // Currency code (e.g., "INR", "USD")
  compareAtPriceCents?: number | null; // Original price (for discounts)
  inStock: boolean;
  availableQuantity: number;      // Available stock quantity
  attributes?: {                  // Variant attributes (color, size, etc.)
    [key: string]: {
      label: string;
      value: string;
      code: string;
    };
  } | null;
  images?: string[];              // SKU-specific images
}
```

### Pagination Response

```typescript
interface PaginatedResponse<T> {
  page: number;                   // Current page number
  limit: number;                  // Items per page
  total: number;                  // Total number of items
  totalPages: number;             // Total number of pages
  products: T[];                  // Array of products
}
```

---

## Code Examples

### React/Next.js Examples

#### 1. Product List Hook

```typescript
// hooks/useProducts.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ProductFilters {
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

interface ProductListResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  products: any[];
}

export function useProducts(filters: ProductFilters = {}) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value));
          }
        });

        const response = await axios.get<ProductListResponse>(
          `${API_URL}/customer/products?${params.toString()}`,
        );

        setProducts(response.data.products);
        setPagination({
          page: response.data.page,
          limit: response.data.limit,
          total: response.data.total,
          totalPages: response.data.totalPages,
        });
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  return {
    products,
    loading,
    error,
    pagination,
    refetch: () => {
      // Trigger refetch by updating filters
      setProducts([]);
    },
  };
}
```

#### 2. Product Detail Hook

```typescript
// hooks/useProductDetail.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useProductDetail(productUid: string | null) {
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productUid) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${API_URL}/customer/products/${productUid}`,
        );

        setProduct(response.data);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('Product not found');
        } else {
          setError(err.response?.data?.message || 'Failed to fetch product');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productUid]);

  return { product, loading, error };
}
```

#### 3. Product List Component

```typescript
// components/ProductList.tsx
'use client';

import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import Link from 'next/link';

export default function ProductList() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    category: '',
    brand: '',
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    search: '',
    sortBy: 'createdAt' as 'createdAt' | 'title',
    sortOrder: 'desc' as 'asc' | 'desc',
  });

  const { products, loading, error, pagination } = useProducts(filters);

  const formatPrice = (cents: number) => {
    return `₹${(cents / 100).toFixed(2)}`;
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value, page: 1 })
          }
        />
        <select
          value={filters.sortBy}
          onChange={(e) =>
            setFilters({
              ...filters,
              sortBy: e.target.value as 'createdAt' | 'title',
            })
          }
        >
          <option value="createdAt">Newest First</option>
          <option value="title">Title A-Z</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="product-grid">
        {products.map((product) => (
          <Link
            key={product.uid}
            href={`/products/${product.uid}`}
            className="product-card"
          >
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="product-image"
              />
            )}
            <h3>{product.title}</h3>
            <p className="price">
              {formatPrice(product.minPriceCents)}
              {product.maxPriceCents &&
                product.maxPriceCents !== product.minPriceCents &&
                ` - ${formatPrice(product.maxPriceCents)}`}
            </p>
            {!product.inStock && (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={pagination.page === 1}
          onClick={() => handlePageChange(pagination.page - 1)}
        >
          Previous
        </button>
        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          disabled={pagination.page === pagination.totalPages}
          onClick={() => handlePageChange(pagination.page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

#### 4. Product Detail Component

```typescript
// components/ProductDetail.tsx
'use client';

import { useState, useEffect } from 'react';
import { useProductDetail } from '@/hooks/useProductDetail';
import { useRouter } from 'next/navigation';

export default function ProductDetail({ productUid }: { productUid: string }) {
  const { product, loading, error } = useProductDetail(productUid);
  const [selectedSku, setSelectedSku] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (product && product.skus.length > 0) {
      setSelectedSku(product.skus[0]);
    }
  }, [product]);

  const formatPrice = (cents: number) => {
    return `₹${(cents / 100).toFixed(2)}`;
  };

  const handleAddToCart = () => {
    if (!selectedSku) return;
    // Add to cart logic here
    console.log('Adding to cart:', selectedSku);
  };

  if (loading) {
    return <div>Loading product...</div>;
  }

  if (error || !product) {
    return <div>Error: {error || 'Product not found'}</div>;
  }

  const primaryImage =
    product.images.find((img: any) => img.isPrimary) || product.images[0];

  return (
    <div className="product-detail">
      {/* Product Images */}
      <div className="product-images">
        {primaryImage && (
          <img
            src={primaryImage.url}
            alt={primaryImage.altText || product.title}
            className="main-image"
          />
        )}
        <div className="image-thumbnails">
          {product.images.map((image: any) => (
            <img
              key={image.uid}
              src={image.url}
              alt={image.altText || product.title}
              className="thumbnail"
            />
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="product-info">
        <h1>{product.title}</h1>

        {/* Rating */}
        {product.averageRating && (
          <div className="rating">
            ⭐ {product.averageRating.toFixed(1)} ({product.reviewCount} reviews)
          </div>
        )}

        {/* Price */}
        <div className="price">
          <span className="current-price">
            {formatPrice(selectedSku?.priceCents || product.minPriceCents)}
          </span>
          {selectedSku?.compareAtPriceCents &&
            selectedSku.compareAtPriceCents > selectedSku.priceCents && (
              <span className="compare-price">
                {formatPrice(selectedSku.compareAtPriceCents)}
              </span>
            )}
        </div>

        {/* Description */}
        {product.description && (
          <div className="description">
            <p>{product.description}</p>
          </div>
        )}

        {/* Variant Selection */}
        {product.skus.length > 1 && (
          <div className="variants">
            <h3>Select Variant</h3>
            {product.skus.map((sku: any) => (
              <button
                key={sku.uid}
                onClick={() => setSelectedSku(sku)}
                className={selectedSku?.uid === sku.uid ? 'active' : ''}
                disabled={!sku.inStock}
              >
                {sku.attributes &&
                  Object.values(sku.attributes).map(
                    (attr: any) => attr.label,
                  ).join(' / ')}
                {!sku.inStock && ' (Out of Stock)'}
              </button>
            ))}
          </div>
        )}

        {/* Stock Status */}
        <div className="stock-status">
          {selectedSku?.inStock ? (
            <span className="in-stock">
              ✓ In Stock ({selectedSku.availableQuantity} available)
            </span>
          ) : (
            <span className="out-of-stock">✗ Out of Stock</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!selectedSku?.inStock}
          className="add-to-cart"
        >
          Add to Cart
        </button>

        {/* Category & Brand */}
        <div className="meta">
          {product.category && (
            <div>
              <strong>Category:</strong> {product.category.name}
            </div>
          )}
          {product.brand && (
            <div>
              <strong>Brand:</strong> {product.brand.name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

#### 5. Related Products Component

```typescript
// components/RelatedProducts.tsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function RelatedProducts({ productUid }: { productUid: string }) {
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/customer/products/${productUid}/related`,
        );
        setRelatedProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch related products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productUid) {
      fetchRelated();
    }
  }, [productUid]);

  if (loading) {
    return <div>Loading related products...</div>;
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  const formatPrice = (cents: number) => {
    return `₹${(cents / 100).toFixed(2)}`;
  };

  return (
    <div className="related-products">
      <h2>You May Also Like</h2>
      <div className="product-grid">
        {relatedProducts.map((product) => (
          <Link
            key={product.uid}
            href={`/products/${product.uid}`}
            className="product-card"
          >
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="product-image"
              />
            )}
            <h3>{product.title}</h3>
            <p className="price">{formatPrice(product.minPriceCents)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

#### 6. Advanced Search Component

```typescript
// components/ProductSearch.tsx
'use client';

import { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProductSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/customer/products/search`,
        {
          params: { q: query, limit: 20 },
        },
      );
      setResults(response.data.products);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>

      {results.length > 0 && (
        <div className="search-results">
          {results.map((product) => (
            <div key={product.uid} className="search-result-item">
              <h3>{product.title}</h3>
              <p>{product.description}</p>
            </div>
          ))}
        </div>
      )}
    </form>
  );
}
```

---

## Best Practices

### 1. Image Optimization

- Always use the `imageUrl` from the API response
- Implement lazy loading for product images
- Use responsive images with `srcset` for different screen sizes
- Provide fallback images for missing product images

```typescript
<img
  src={product.imageUrl || '/placeholder-product.jpg'}
  alt={product.title}
  loading="lazy"
/>
```

### 2. Price Display

- Always convert cents to currency format
- Show price range when `maxPriceCents` differs from `minPriceCents`
- Display `compareAtPriceCents` as strikethrough for discounts

```typescript
const formatPrice = (cents: number, currency: string = 'INR') => {
  const symbol = currency === 'INR' ? '₹' : '$';
  return `${symbol}${(cents / 100).toFixed(2)}`;
};
```

### 3. Stock Management

- Always check `inStock` before allowing add to cart
- Display stock quantity when available
- Show "Out of Stock" badges clearly
- Disable add to cart buttons for out-of-stock items

### 4. Pagination

- Implement infinite scroll or page-based pagination
- Show loading states during pagination
- Scroll to top when changing pages
- Cache previous pages for better UX

### 5. Error Handling

- Handle 404 errors gracefully (product not found)
- Show user-friendly error messages
- Implement retry mechanisms for failed requests
- Log errors for debugging

### 6. Performance

- Implement debouncing for search inputs
- Cache product data when appropriate
- Use React Query or SWR for data fetching
- Optimize image loading and rendering

### 7. SEO

- Use product `slug` for URLs
- Implement proper meta tags using `seoTitle` and `seoDescription`
- Use structured data (JSON-LD) for products
- Implement proper heading hierarchy

---

## Error Handling

### Common Error Responses

| Status Code | Error | Description |
|------------|-------|-------------|
| 400 | Bad Request | Invalid query parameters or filters |
| 404 | Not Found | Product not found or not published |
| 500 | Internal Server Error | Server error |

### Error Response Format

```json
{
  "statusCode": 404,
  "message": "Product not found",
  "error": "Not Found"
}
```

### Error Handling Example

```typescript
try {
  const response = await axios.get(
    `${API_URL}/customer/products/${productUid}`,
  );
  // Handle success
} catch (error: any) {
  if (error.response?.status === 404) {
    // Product not found
    router.push('/products');
  } else {
    // Other errors
    console.error('Error fetching product:', error);
    // Show error message to user
  }
}
```

---

## Testing

### Test Product List

```bash
curl -X GET "http://localhost:3000/customer/products?page=1&limit=20"
```

### Test Product Search

```bash
curl -X GET "http://localhost:3000/customer/products/search?q=laptop&minPrice=50000"
```

### Test Product Detail

```bash
curl -X GET "http://localhost:3000/customer/products/550e8400-e29b-41d4-a716-446655440000"
```

### Test Related Products

```bash
curl -X GET "http://localhost:3000/customer/products/550e8400-e29b-41d4-a716-446655440000/related"
```

---

## Support

For issues or questions:

1. Check the API documentation at `/swagger`
2. Review error messages in the response
3. Verify product UIDs and query parameters
4. Check network requests in browser DevTools

---

## Changelog

- **v1.0.0** - Initial customer products API
  - Product browsing and listing
  - Product search with filters
  - Product detail view
  - SKU/variant management
  - Related products recommendations

