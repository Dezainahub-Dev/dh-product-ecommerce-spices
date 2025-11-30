# Customer Cart - Frontend Integration Guide

This guide provides complete documentation for integrating cart functionality APIs in your frontend application.

## Table of Contents

1. [Overview](#overview)
2. [Base URL](#base-url)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
5. [Request/Response Structures](#requestresponse-structures)
6. [Guest Cart Functionality](#guest-cart-functionality)
7. [Code Examples](#code-examples)
8. [Best Practices](#best-practices)
9. [Error Handling](#error-handling)
10. [Related APIs](#related-apis)

---

## Overview

The cart API allows customers to:

- Add, update, and remove items from cart
- View cart with real-time pricing and stock information
- Apply and remove coupon codes
- Get shipping estimates
- Validate cart before checkout
- Merge guest cart after login
- Preview prices for guest users

### Key Features

- **Real-time Stock Validation** - Automatic stock checking and quantity adjustments
- **Coupon Management** - Apply and remove discount codes
- **Shipping Estimates** - Calculate shipping costs based on destination
- **Guest Cart Support** - Price preview for non-authenticated users
- **Cart Validation** - Pre-checkout validation with automatic adjustments
- **Cart Merging** - Seamless guest-to-authenticated cart migration

### Authentication

**Note:** Most cart endpoints require authentication. Guest users can use the public price preview endpoint.

---

## Base URL

All customer cart endpoints are prefixed with `/customer/cart`:

```
Base URL: https://your-api-domain.com/customer/cart
```

Public cart endpoints (for guests) are prefixed with `/public/cart`:

```
Public Base URL: https://your-api-domain.com/public/cart
```

---

## Authentication

All authenticated cart endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <accessToken>
```

The access token is obtained from the customer authentication flow. See [CUSTOMER_AUTH_FRONTEND_INTEGRATION.md](./CUSTOMER_AUTH_FRONTEND_INTEGRATION.md) for details.

---

## API Endpoints

### 1. Get Active Cart

**Endpoint:** `GET /customer/cart`

**Description:** Retrieves the current active cart for the authenticated user with all items, pricing, and applied discounts.

**Authentication:** Required

**Request Headers:**
```
Authorization: Bearer <accessToken>
```

**Example Request:**
```bash
curl -X GET https://your-api-domain.com/customer/cart \
  -H "Authorization: Bearer <accessToken>"
```

**Response (200 OK):**
```json
{
  "cartUid": "770e8400-e29b-41d4-a716-446655440000",
  "items": [
    {
      "itemUid": "880e8400-e29b-41d4-a716-446655440000",
      "product": {
        "uid": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Wireless Headphones",
        "thumbnail": "https://example.com/images/headphones.jpg",
        "slug": "wireless-headphones"
      },
      "sku": {
        "uid": "660e8400-e29b-41d4-a716-446655440000",
        "code": "WH-BLK-M",
        "attributes": {
          "color": "Black",
          "size": "M"
        }
      },
      "quantity": 2,
      "unitPriceCents": 9999,
      "totalPriceCents": 19998,
      "isInStock": true,
      "availableQty": 10
    }
  ],
  "discounts": [
    {
      "code": "WELCOME10",
      "discountType": "percentage",
      "valueCents": 2000
    }
  ],
  "summary": {
    "subtotalCents": 19998,
    "discountCents": 2000,
    "taxCents": 3239,
    "shippingCents": 0,
    "totalCents": 21237
  }
}
```

---

### 2. Add Item to Cart

**Endpoint:** `POST /customer/cart/items`

**Description:** Adds a product SKU to the cart. If the item already exists, the quantity is increased.

**Authentication:** Required

**Request Body:**
```json
{
  "productUid": "550e8400-e29b-41d4-a716-446655440000",
  "skuUid": "660e8400-e29b-41d4-a716-446655440000",
  "quantity": 1,
  "attributes": {
    "size": "M",
    "color": "Black"
  }
}
```

**Request Parameters:**

| Parameter   | Type   | Required | Description                                    |
| ----------- | ------ | -------- | ---------------------------------------------- |
| `productUid` | string | Yes      | Product UID                                    |
| `skuUid`     | string | Yes      | SKU UID (variant)                              |
| `quantity`   | number | Yes      | Quantity to add (minimum: 1)                   |
| `attributes` | object | No       | Optional attributes snapshot for display       |

**Example Request:**
```bash
curl -X POST https://your-api-domain.com/customer/cart/items \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "productUid": "550e8400-e29b-41d4-a716-446655440000",
    "skuUid": "660e8400-e29b-41d4-a716-446655440000",
    "quantity": 1,
    "attributes": {
      "size": "M",
      "color": "Black"
    }
  }'
```

**Response (200 OK):**
```json
{
  "cartUid": "770e8400-e29b-41d4-a716-446655440000",
  "items": [
    {
      "itemUid": "880e8400-e29b-41d4-a716-446655440000",
      "product": {
        "uid": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Wireless Headphones",
        "thumbnail": "https://example.com/images/headphones.jpg",
        "slug": "wireless-headphones"
      },
      "sku": {
        "uid": "660e8400-e29b-41d4-a716-446655440000",
        "code": "WH-BLK-M",
        "attributes": {
          "color": "Black",
          "size": "M"
        }
      },
      "quantity": 1,
      "unitPriceCents": 9999,
      "totalPriceCents": 9999,
      "isInStock": true,
      "availableQty": 10
    }
  ],
  "discounts": [],
  "summary": {
    "subtotalCents": 9999,
    "discountCents": 0,
    "taxCents": 1799,
    "shippingCents": 0,
    "totalCents": 11798
  }
}
```

**Error Responses:**

- `400 Bad Request` - Invalid request body or validation error
- `401 Unauthorized` - Missing or invalid authentication token
- `404 Not Found` - Product or SKU not found
- `409 Conflict` - Insufficient stock available

---

### 3. Update Cart Item Quantity

**Endpoint:** `PATCH /customer/cart/items/:itemUid`

**Description:** Updates the quantity of a cart item. Setting quantity to 0 removes the item.

**Authentication:** Required

**URL Parameters:**

| Parameter | Type   | Required | Description     |
| --------- | ------ | -------- | --------------- |
| `itemUid` | string | Yes      | Cart item UID   |

**Request Body:**
```json
{
  "quantity": 3
}
```

**Request Parameters:**

| Parameter | Type   | Required | Description                      |
| --------- | ------ | -------- | -------------------------------- |
| `quantity` | number | Yes      | New quantity (minimum: 0)        |

**Example Request:**
```bash
curl -X PATCH https://your-api-domain.com/customer/cart/items/880e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 3
  }'
```

**Response (200 OK):**
Returns the updated cart (same structure as Get Cart).

**Error Responses:**

- `400 Bad Request` - Invalid quantity
- `401 Unauthorized` - Missing or invalid authentication token
- `404 Not Found` - Cart item not found

---

### 4. Remove Item from Cart

**Endpoint:** `DELETE /customer/cart/items/:itemUid`

**Description:** Removes an item from the cart.

**Authentication:** Required

**URL Parameters:**

| Parameter | Type   | Required | Description     |
| --------- | ------ | -------- | --------------- |
| `itemUid` | string | Yes      | Cart item UID   |

**Example Request:**
```bash
curl -X DELETE https://your-api-domain.com/customer/cart/items/880e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer <accessToken>"
```

**Response (200 OK):**
Returns the updated cart (same structure as Get Cart).

**Error Responses:**

- `401 Unauthorized` - Missing or invalid authentication token
- `404 Not Found` - Cart item not found

---

### 5. Merge Guest Cart

**Endpoint:** `POST /customer/cart/merge`

**Description:** Merges guest cart items (from localStorage) into the authenticated user's cart after login. This is typically called immediately after user authentication.

**Authentication:** Required

**Request Body:**
```json
{
  "items": [
    {
      "productUid": "550e8400-e29b-41d4-a716-446655440000",
      "skuUid": "660e8400-e29b-41d4-a716-446655440000",
      "quantity": 2,
      "attributes": {
        "size": "M",
        "color": "Black"
      }
    },
    {
      "productUid": "550e8400-e29b-41d4-a716-446655440001",
      "skuUid": "660e8400-e29b-41d4-a716-446655440001",
      "quantity": 1,
      "attributes": {
        "size": "L",
        "color": "Blue"
      }
    }
  ]
}
```

**Request Parameters:**

| Parameter | Type   | Required | Description                    |
| --------- | ------ | -------- | ------------------------------ |
| `items`   | array  | Yes      | Array of guest cart items      |

Each item in the array should have:
- `productUid` (string, required)
- `skuUid` (string, required)
- `quantity` (number, required, minimum: 1)
- `attributes` (object, optional)

**Example Request:**
```bash
curl -X POST https://your-api-domain.com/customer/cart/merge \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productUid": "550e8400-e29b-41d4-a716-446655440000",
        "skuUid": "660e8400-e29b-41d4-a716-446655440000",
        "quantity": 2,
        "attributes": {
          "size": "M",
          "color": "Black"
        }
      }
    ]
  }'
```

**Response (200 OK):**
Returns the merged cart (same structure as Get Cart).

**Error Responses:**

- `400 Bad Request` - Invalid request body
- `401 Unauthorized` - Missing or invalid authentication token

---

### 6. Validate Cart

**Endpoint:** `POST /customer/cart/validate`

**Description:** Performs strict validation of cart items (stock, SKU validity) and auto-adjusts quantities if needed. This should be called before checkout to ensure cart is valid.

**Authentication:** Required

**Example Request:**
```bash
curl -X POST https://your-api-domain.com/customer/cart/validate \
  -H "Authorization: Bearer <accessToken>"
```

**Response (200 OK):**
```json
{
  "cart": {
    "cartUid": "770e8400-e29b-41d4-a716-446655440000",
    "items": [
      {
        "itemUid": "880e8400-e29b-41d4-a716-446655440000",
        "product": {
          "uid": "550e8400-e29b-41d4-a716-446655440000",
          "name": "Wireless Headphones",
          "thumbnail": "https://example.com/images/headphones.jpg",
          "slug": "wireless-headphones"
        },
        "sku": {
          "uid": "660e8400-e29b-41d4-a716-446655440000",
          "code": "WH-BLK-M",
          "attributes": {
            "color": "Black",
            "size": "M"
          }
        },
        "quantity": 2,
        "unitPriceCents": 9999,
        "totalPriceCents": 19998,
        "isInStock": true,
        "availableQty": 10
      }
    ],
    "discounts": [],
    "summary": {
      "subtotalCents": 19998,
      "discountCents": 0,
      "taxCents": 3599,
      "shippingCents": 0,
      "totalCents": 23597
    }
  },
  "adjustments": [
    {
      "itemUid": "880e8400-e29b-41d4-a716-446655440000",
      "type": "quantity_reduced",
      "reason": "Insufficient stock available",
      "previousQty": 5,
      "newQty": 2
    }
  ],
  "canProceed": true
}
```

**Response Fields:**

| Field        | Type    | Description                                    |
| ------------ | ------- | ---------------------------------------------- |
| `cart`       | object  | Updated cart after validation                  |
| `adjustments` | array   | List of adjustments made during validation     |
| `canProceed` | boolean | Whether checkout can proceed                   |

**Adjustment Types:**

- `quantity_reduced` - Item quantity was reduced due to stock limitations
- `removed` - Item was removed (out of stock or invalid)

**Error Responses:**

- `401 Unauthorized` - Missing or invalid authentication token

---

### 7. Apply Coupon Code

**Endpoint:** `POST /customer/cart/apply-coupon`

**Description:** Applies a coupon/promo code to the cart.

**Authentication:** Required

**Request Body:**
```json
{
  "code": "WELCOME10"
}
```

**Request Parameters:**

| Parameter | Type   | Required | Description        |
| --------- | ------ | -------- | ------------------ |
| `code`    | string | Yes      | Coupon code        |

**Example Request:**
```bash
curl -X POST https://your-api-domain.com/customer/cart/apply-coupon \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "WELCOME10"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "code": "WELCOME10",
  "message": "Coupon applied successfully",
  "cart": {
    "cartUid": "770e8400-e29b-41d4-a716-446655440000",
    "items": [...],
    "discounts": [
      {
        "code": "WELCOME10",
        "discountType": "percentage",
        "valueCents": 2000
      }
    ],
    "summary": {
      "subtotalCents": 19998,
      "discountCents": 2000,
      "taxCents": 3239,
      "shippingCents": 0,
      "totalCents": 21237
    }
  }
}
```

**Error Responses:**

- `400 Bad Request` - Invalid coupon code or coupon not applicable
- `401 Unauthorized` - Missing or invalid authentication token
- `404 Not Found` - Coupon code not found

**Example Error Response:**
```json
{
  "success": false,
  "code": "INVALID10",
  "message": "Coupon code is invalid or expired",
  "cart": {
    // Current cart without coupon
  }
}
```

---

### 8. Remove Coupon

**Endpoint:** `DELETE /customer/cart/coupon`

**Description:** Removes any applied coupon from the cart.

**Authentication:** Required

**Example Request:**
```bash
curl -X DELETE https://your-api-domain.com/customer/cart/coupon \
  -H "Authorization: Bearer <accessToken>"
```

**Response (200 OK):**
Returns the updated cart without the coupon (same structure as Get Cart).

**Error Responses:**

- `401 Unauthorized` - Missing or invalid authentication token

---

### 9. Get Shipping Estimate

**Endpoint:** `POST /customer/cart/shipping-estimate`

**Description:** Calculates shipping cost and delivery estimate for the cart to a destination.

**Authentication:** Required

**Request Body:**
```json
{
  "destination": {
    "postalCode": "560001",
    "city": "Bengaluru",
    "state": "KA",
    "country": "IN"
  }
}
```

**Request Parameters:**

| Parameter     | Type   | Required | Description                                    |
| ------------- | ------ | -------- | ---------------------------------------------- |
| `destination` | object | Yes      | Shipping destination details                   |
| `destination.postalCode` | string | No       | Postal/ZIP code                                |
| `destination.city` | string | Yes      | City name                                      |
| `destination.state` | string | Yes      | State/Province code                            |
| `destination.country` | string | Yes      | Country code (ISO 3166-1 alpha-2)             |

**Example Request:**
```bash
curl -X POST https://your-api-domain.com/customer/cart/shipping-estimate \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "destination": {
      "postalCode": "560001",
      "city": "Bengaluru",
      "state": "KA",
      "country": "IN"
    }
  }'
```

**Response (200 OK):**
```json
{
  "shippingCents": 5000,
  "serviceName": "Standard Shipping",
  "estimatedDeliveryFrom": "2025-12-02",
  "estimatedDeliveryTo": "2025-12-04"
}
```

**Response Fields:**

| Field                  | Type   | Description                          |
| ---------------------- | ------ | ------------------------------------ |
| `shippingCents`        | number | Shipping cost in cents               |
| `serviceName`          | string | Shipping service name                |
| `estimatedDeliveryFrom` | string | Estimated delivery date (from)      |
| `estimatedDeliveryTo`  | string | Estimated delivery date (to)         |

**Error Responses:**

- `400 Bad Request` - Invalid destination
- `401 Unauthorized` - Missing or invalid authentication token
- `404 Not Found` - No shipping method available for destination

---

## Guest Cart Functionality

### 10. Price Preview (Guest)

**Endpoint:** `POST /public/cart/price-preview`

**Description:** Calculates prices and stock info for guest cart items without creating a cart. This endpoint does not require authentication and is useful for showing cart totals to non-authenticated users.

**Authentication:** Not required

**Request Body:**
```json
{
  "items": [
    {
      "productUid": "550e8400-e29b-41d4-a716-446655440000",
      "skuUid": "660e8400-e29b-41d4-a716-446655440000",
      "quantity": 2
    },
    {
      "productUid": "550e8400-e29b-41d4-a716-446655440001",
      "skuUid": "660e8400-e29b-41d4-a716-446655440001",
      "quantity": 1
    }
  ]
}
```

**Request Parameters:**

| Parameter | Type   | Required | Description                    |
| --------- | ------ | -------- | ------------------------------ |
| `items`   | array  | Yes      | Array of items to preview      |

Each item should have:
- `productUid` (string, required)
- `skuUid` (string, required)
- `quantity` (number, required, minimum: 1)

**Example Request:**
```bash
curl -X POST https://your-api-domain.com/public/cart/price-preview \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productUid": "550e8400-e29b-41d4-a716-446655440000",
        "skuUid": "660e8400-e29b-41d4-a716-446655440000",
        "quantity": 2
      }
    ]
  }'
```

**Response (200 OK):**
```json
{
  "items": [
    {
      "productUid": "550e8400-e29b-41d4-a716-446655440000",
      "skuUid": "660e8400-e29b-41d4-a716-446655440000",
      "quantity": 2,
      "unitPriceCents": 9999,
      "totalPriceCents": 19998,
      "isInStock": true,
      "availableQty": 10
    }
  ],
  "summary": {
    "subtotalCents": 19998,
    "discountCents": 0,
    "taxCents": 3599,
    "shippingCents": 0,
    "totalCents": 23597
  }
}
```

**Note:** This endpoint provides a basic price preview. It does not include:
- Applied coupons
- Actual shipping costs (shipping is set to 0)
- Complex tax calculations (uses a fixed 18% tax rate)

---

## Request/Response Structures

### Cart Response Structure

```typescript
interface CartResponse {
  cartUid: string;
  items: CartItem[];
  discounts: Discount[];
  summary: CartSummary;
}

interface CartItem {
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

interface Discount {
  code: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  valueCents: number;
}

interface CartSummary {
  subtotalCents: number;
  discountCents: number;
  taxCents: number;
  shippingCents: number;
  totalCents: number;
}
```

### Validation Response Structure

```typescript
interface ValidateCartResponse {
  cart: CartResponse;
  adjustments: CartAdjustment[];
  canProceed: boolean;
}

interface CartAdjustment {
  itemUid: string;
  type: 'quantity_reduced' | 'removed';
  reason: string;
  previousQty?: number;
  newQty?: number;
}
```

---

## Code Examples

### React/TypeScript Example

```typescript
// cart.service.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class CartService {
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getCart() {
    const response = await axios.get(`${API_URL}/customer/cart`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async addItem(productUid: string, skuUid: string, quantity: number, attributes?: Record<string, any>) {
    const response = await axios.post(
      `${API_URL}/customer/cart/items`,
      {
        productUid,
        skuUid,
        quantity,
        attributes,
      },
      {
        headers: this.getAuthHeaders(),
      },
    );
    return response.data;
  }

  async updateItemQuantity(itemUid: string, quantity: number) {
    const response = await axios.patch(
      `${API_URL}/customer/cart/items/${itemUid}`,
      { quantity },
      {
        headers: this.getAuthHeaders(),
      },
    );
    return response.data;
  }

  async removeItem(itemUid: string) {
    const response = await axios.delete(
      `${API_URL}/customer/cart/items/${itemUid}`,
      {
        headers: this.getAuthHeaders(),
      },
    );
    return response.data;
  }

  async mergeGuestCart(items: Array<{ productUid: string; skuUid: string; quantity: number; attributes?: Record<string, any> }>) {
    const response = await axios.post(
      `${API_URL}/customer/cart/merge`,
      { items },
      {
        headers: this.getAuthHeaders(),
      },
    );
    return response.data;
  }

  async validateCart() {
    const response = await axios.post(
      `${API_URL}/customer/cart/validate`,
      {},
      {
        headers: this.getAuthHeaders(),
      },
    );
    return response.data;
  }

  async applyCoupon(code: string) {
    const response = await axios.post(
      `${API_URL}/customer/cart/apply-coupon`,
      { code },
      {
        headers: this.getAuthHeaders(),
      },
    );
    return response.data;
  }

  async removeCoupon() {
    const response = await axios.delete(
      `${API_URL}/customer/cart/coupon`,
      {
        headers: this.getAuthHeaders(),
      },
    );
    return response.data;
  }

  async getShippingEstimate(destination: {
    postalCode?: string;
    city: string;
    state: string;
    country: string;
  }) {
    const response = await axios.post(
      `${API_URL}/customer/cart/shipping-estimate`,
      { destination },
      {
        headers: this.getAuthHeaders(),
      },
    );
    return response.data;
  }

  // Guest cart preview (no auth required)
  async pricePreview(items: Array<{ productUid: string; skuUid: string; quantity: number }>) {
    const response = await axios.post(`${API_URL}/public/cart/price-preview`, {
      items,
    });
    return response.data;
  }
}

export const cartService = new CartService();
```

### React Hook Example

```typescript
// useCart.ts
import { useState, useEffect, useCallback } from 'react';
import { cartService } from './cart.service';

interface CartItem {
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

interface Cart {
  cartUid: string;
  items: CartItem[];
  discounts: Array<{
    code: string;
    discountType: string;
    valueCents: number;
  }>;
  summary: {
    subtotalCents: number;
    discountCents: number;
    taxCents: number;
    shippingCents: number;
    totalCents: number;
  };
}

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartService.getCart();
      setCart(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = useCallback(
    async (productUid: string, skuUid: string, quantity: number, attributes?: Record<string, any>) => {
      try {
        setError(null);
        const updatedCart = await cartService.addItem(productUid, skuUid, quantity, attributes);
        setCart(updatedCart);
        return updatedCart;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to add item to cart';
        setError(errorMessage);
        throw err;
      }
    },
    [],
  );

  const updateQuantity = useCallback(async (itemUid: string, quantity: number) => {
    try {
      setError(null);
      const updatedCart = await cartService.updateItemQuantity(itemUid, quantity);
      setCart(updatedCart);
      return updatedCart;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update cart item';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const removeItem = useCallback(async (itemUid: string) => {
    try {
      setError(null);
      const updatedCart = await cartService.removeItem(itemUid);
      setCart(updatedCart);
      return updatedCart;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to remove item from cart';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const applyCoupon = useCallback(async (code: string) => {
    try {
      setError(null);
      const result = await cartService.applyCoupon(code);
      setCart(result.cart);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to apply coupon';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const removeCoupon = useCallback(async () => {
    try {
      setError(null);
      const updatedCart = await cartService.removeCoupon();
      setCart(updatedCart);
      return updatedCart;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to remove coupon';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const validateCart = useCallback(async () => {
    try {
      setError(null);
      const result = await cartService.validateCart();
      setCart(result.cart);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to validate cart';
      setError(errorMessage);
      throw err;
    }
  }, []);

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
  };
}
```

### Guest Cart Management Example

```typescript
// guestCart.ts
const GUEST_CART_KEY = 'guest_cart';

interface GuestCartItem {
  productUid: string;
  skuUid: string;
  quantity: number;
  attributes?: Record<string, any>;
}

export const guestCartService = {
  getItems(): GuestCartItem[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(GUEST_CART_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  addItem(item: GuestCartItem) {
    const items = this.getItems();
    const existingIndex = items.findIndex(
      (i) => i.productUid === item.productUid && i.skuUid === item.skuUid,
    );

    if (existingIndex >= 0) {
      items[existingIndex].quantity += item.quantity;
    } else {
      items.push(item);
    }

    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
    return items;
  },

  updateQuantity(productUid: string, skuUid: string, quantity: number) {
    const items = this.getItems();
    const item = items.find((i) => i.productUid === productUid && i.skuUid === skuUid);

    if (item) {
      if (quantity <= 0) {
        this.removeItem(productUid, skuUid);
      } else {
        item.quantity = quantity;
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
      }
    }

    return this.getItems();
  },

  removeItem(productUid: string, skuUid: string) {
    const items = this.getItems();
    const filtered = items.filter(
      (i) => !(i.productUid === productUid && i.skuUid === skuUid),
    );
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(filtered));
    return filtered;
  },

  clear() {
    localStorage.removeItem(GUEST_CART_KEY);
  },

  async getPricePreview() {
    const items = this.getItems();
    if (items.length === 0) return null;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/cart/price-preview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) throw new Error('Failed to get price preview');
      return await response.json();
    } catch (error) {
      console.error('Error getting price preview:', error);
      return null;
    }
  },
};
```

### Cart Merge on Login Example

```typescript
// After successful login
async function handleLoginSuccess(accessToken: string) {
  // Store access token
  localStorage.setItem('accessToken', accessToken);

  // Get guest cart items
  const guestItems = guestCartService.getItems();

  if (guestItems.length > 0) {
    try {
      // Merge guest cart into authenticated cart
      await cartService.mergeGuestCart(guestItems);
      
      // Clear guest cart
      guestCartService.clear();
      
      // Refresh cart
      await cartService.getCart();
    } catch (error) {
      console.error('Failed to merge guest cart:', error);
    }
  }
}
```

### Cart Component Example

```typescript
// Cart.tsx
import React from 'react';
import { useCart } from './useCart';

export function Cart() {
  const { cart, loading, error, updateQuantity, removeItem, applyCoupon, removeCoupon } = useCart();
  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const result = await applyCoupon(couponCode);
      if (result.success) {
        alert('Coupon applied successfully!');
        setCouponCode('');
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Failed to apply coupon');
    }
  };

  const formatPrice = (cents: number) => {
    return `₹${(cents / 100).toFixed(2)}`;
  };

  if (loading) return <div>Loading cart...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!cart || cart.items.length === 0) {
    return <div>Your cart is empty</div>;
  }

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>

      {/* Cart Items */}
      <div className="cart-items">
        {cart.items.map((item) => (
          <div key={item.itemUid} className="cart-item">
            <img src={item.product.thumbnail} alt={item.product.name} />
            <div>
              <h3>{item.product.name}</h3>
              <p>SKU: {item.sku.code}</p>
              {item.sku.attributes && (
                <p>
                  {Object.entries(item.sku.attributes).map(([key, value]) => (
                    <span key={key}>
                      {key}: {value}{' '}
                    </span>
                  ))}
                </p>
              )}
              <p>Price: {formatPrice(item.unitPriceCents)}</p>
              <div>
                <label>
                  Quantity:
                  <input
                    type="number"
                    min="1"
                    max={item.availableQty}
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.itemUid, parseInt(e.target.value))}
                  />
                </label>
                {!item.isInStock && <span className="out-of-stock">Out of Stock</span>}
              </div>
              <p>Total: {formatPrice(item.totalPriceCents)}</p>
              <button onClick={() => removeItem(item.itemUid)}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Section */}
      <div className="coupon-section">
        <h3>Apply Coupon</h3>
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Enter coupon code"
        />
        <button onClick={handleApplyCoupon}>Apply</button>
        {cart.discounts.length > 0 && (
          <div>
            <p>Applied Coupons:</p>
            {cart.discounts.map((discount) => (
              <div key={discount.code}>
                <span>{discount.code}</span>
                <button onClick={() => removeCoupon()}>Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Summary */}
      <div className="cart-summary">
        <h3>Order Summary</h3>
        <div>
          <p>Subtotal: {formatPrice(cart.summary.subtotalCents)}</p>
          <p>Discount: -{formatPrice(cart.summary.discountCents)}</p>
          <p>Tax: {formatPrice(cart.summary.taxCents)}</p>
          <p>Shipping: {formatPrice(cart.summary.shippingCents)}</p>
          <p>
            <strong>Total: {formatPrice(cart.summary.totalCents)}</strong>
          </p>
        </div>
        <button>Proceed to Checkout</button>
      </div>
    </div>
  );
}
```

---

## Best Practices

### 1. Cart State Management

- **Fetch cart on app load** - Always fetch the cart when the user is authenticated
- **Optimistic updates** - Update UI immediately, then sync with server
- **Error recovery** - Re-fetch cart on error to ensure consistency
- **Debounce updates** - Debounce quantity updates to avoid excessive API calls

### 2. Guest Cart Handling

- **Store in localStorage** - Use localStorage for guest cart items
- **Merge on login** - Always merge guest cart when user logs in
- **Clear after merge** - Clear localStorage after successful merge
- **Price preview** - Use price preview API to show totals to guests

### 3. Stock Validation

- **Validate before checkout** - Always call validate endpoint before checkout
- **Handle adjustments** - Show adjustments to users (quantity reduced, items removed)
- **Check availability** - Display stock status for each item
- **Prevent over-ordering** - Limit quantity input to available quantity

### 4. Error Handling

- **Network errors** - Retry failed requests with exponential backoff
- **401 errors** - Refresh token and retry request
- **Validation errors** - Show clear error messages to users
- **Stock errors** - Handle insufficient stock gracefully

### 5. Performance

- **Cache cart data** - Cache cart in state to reduce API calls
- **Batch operations** - Batch multiple cart updates when possible
- **Lazy loading** - Load cart only when needed
- **Optimistic UI** - Update UI before server response

### 6. User Experience

- **Loading states** - Show loading indicators during cart operations
- **Success feedback** - Show success messages for cart updates
- **Error messages** - Display clear, actionable error messages
- **Cart persistence** - Ensure cart persists across sessions

---

## Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

**Common causes:**
- Invalid request body
- Invalid quantity (negative or zero for add)
- Missing required fields

#### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Invalid or expired token",
  "error": "Unauthorized"
}
```

**Solution:** Refresh the access token or redirect to login

#### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Cart item not found",
  "error": "Not Found"
}
```

**Common causes:**
- Cart item UID doesn't exist
- Product or SKU not found

#### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Insufficient stock available",
  "error": "Conflict"
}
```

**Solution:** Reduce quantity or remove item

### Error Handling Example

```typescript
async function handleCartOperation(operation: () => Promise<any>) {
  try {
    return await operation();
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          alert(`Invalid request: ${data.message}`);
          break;
        case 401:
          // Refresh token or redirect to login
          handleUnauthorized();
          break;
        case 404:
          alert('Item not found. Please refresh your cart.');
          break;
        case 409:
          alert(`Stock issue: ${data.message}`);
          break;
        default:
          alert('An error occurred. Please try again.');
      }
    } else {
      alert('Network error. Please check your connection.');
    }
    throw error;
  }
}

function handleUnauthorized() {
  // Try to refresh token
  // If refresh fails, redirect to login
  window.location.href = '/login';
}
```

---

## Related APIs

### Product APIs

To get product and SKU information before adding to cart:

- **Get Product Details:** `GET /customer/products/:productUid`
- **Browse Products:** `GET /customer/products`

See [CUSTOMER_PRODUCTS_FRONTEND_INTEGRATION.md](./CUSTOMER_PRODUCTS_FRONTEND_INTEGRATION.md) for details.

### Authentication APIs

For user authentication and token management:

- **Login:** `POST /customer/auth/login`
- **Register:** `POST /customer/auth/register`
- **Refresh Token:** `POST /customer/auth/refresh`

See [CUSTOMER_AUTH_FRONTEND_INTEGRATION.md](./CUSTOMER_AUTH_FRONTEND_INTEGRATION.md) for details.

### Order APIs

After cart validation, proceed to checkout:

- **Create Order:** `POST /customer/orders`
- **Get Order:** `GET /customer/orders/:orderUid`

### Address APIs

For shipping estimates and order delivery:

- **Get Addresses:** `GET /customer/addresses`
- **Create Address:** `POST /customer/addresses`

---

## Complete Integration Flow

### 1. Guest User Flow

```typescript
// 1. User browses products (no auth required)
const products = await productService.getProducts();

// 2. User adds item to guest cart (localStorage)
guestCartService.addItem({
  productUid: '...',
  skuUid: '...',
  quantity: 1,
  attributes: { size: 'M', color: 'Black' },
});

// 3. Show price preview
const preview = await guestCartService.getPricePreview();

// 4. User logs in
const { accessToken } = await authService.login(email, password);

// 5. Merge guest cart
const guestItems = guestCartService.getItems();
await cartService.mergeGuestCart(guestItems);
guestCartService.clear();

// 6. Fetch authenticated cart
const cart = await cartService.getCart();
```

### 2. Authenticated User Flow

```typescript
// 1. User is authenticated, fetch cart
const cart = await cartService.getCart();

// 2. User adds item
await cartService.addItem(productUid, skuUid, quantity, attributes);

// 3. User applies coupon
await cartService.applyCoupon('WELCOME10');

// 4. User gets shipping estimate
const estimate = await cartService.getShippingEstimate({
  city: 'Bengaluru',
  state: 'KA',
  country: 'IN',
  postalCode: '560001',
});

// 5. Before checkout, validate cart
const validation = await cartService.validateCart();
if (!validation.canProceed) {
  // Show adjustments to user
  validation.adjustments.forEach((adj) => {
    alert(`${adj.reason}: ${adj.type}`);
  });
}

// 6. Proceed to checkout
if (validation.canProceed) {
  // Create order
  const order = await orderService.createOrder({
    shippingAddress: address,
    paymentMethod: paymentMethod,
  });
}
```

---

## Summary

This guide covers all cart-related APIs and integration patterns. Key takeaways:

1. **Authentication Required** - Most cart endpoints require Bearer token authentication
2. **Guest Cart Support** - Use localStorage and price preview API for guests
3. **Cart Merging** - Merge guest cart on login for seamless experience
4. **Validation** - Always validate cart before checkout
5. **Error Handling** - Handle stock issues, validation errors, and network errors gracefully
6. **Real-time Updates** - Cart reflects real-time pricing, stock, and discounts

For questions or issues, refer to the API documentation or contact the backend team.

