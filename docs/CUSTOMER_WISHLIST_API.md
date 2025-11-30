# Customer Wishlist - API Documentation

This guide provides complete API documentation for customer wishlist operations.

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Base URL](#base-url)
4. [API Endpoints](#api-endpoints)
5. [Request/Response Structures](#requestresponse-structures)
6. [Error Handling](#error-handling)
7. [Business Logic](#business-logic)

---

## Overview

The wishlist API allows authenticated customers to:

- View their wishlist items
- Add products (SKUs) to their wishlist
- Remove items from wishlist
- Move wishlist items to cart

### Key Features

- **SKU-based** - Wishlist items are based on SKUs (product variants), not products
- **Idempotent Add** - Adding the same SKU multiple times won't create duplicates
- **Stock Information** - Real-time stock availability for wishlist items
- **Move to Cart** - Direct functionality to move wishlist items to shopping cart

---

## Authentication

**All wishlist endpoints require authentication.**

Include the access token in the Authorization header:

```
Authorization: Bearer <accessToken>
```

For details on obtaining access tokens, refer to the [Customer Authentication Integration Guide](./CUSTOMER_AUTH_FRONTEND_INTEGRATION.md).

---

## Base URL

All wishlist endpoints are prefixed with `/customer/wishlist`:

```
Base URL: https://your-api-domain.com/customer/wishlist
```

---

## API Endpoints

### 1. Get Wishlist

**Endpoint:** `GET /customer/wishlist`

**Description:** Retrieves all items in the authenticated customer's wishlist, ordered by most recently added first.

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Response (200 OK):**

```json
[
  {
    "uid": "550e8400-e29b-41d4-a716-446655440000",
    "addedAt": "2024-01-15T10:30:00.000Z",
    "sku": {
      "uid": "sku-001",
      "skuCode": "WH-BLK-001",
      "priceCents": 9999,
      "currency": "INR",
      "compareAtPriceCents": 12999,
      "stockTracking": true,
      "backorderable": false
    },
    "product": {
      "uid": "product-001",
      "title": "Wireless Headphones",
      "slug": "wireless-headphones",
      "status": "PUBLISHED",
      "images": [
        {
          "uid": "img-001",
          "url": "https://example.com/images/headphones.jpg",
          "altText": "Wireless Headphones",
          "isPrimary": true
        }
      ]
    },
    "stockInfo": {
      "available": 50,
      "reserved": 5,
      "isInStock": true
    }
  },
  {
    "uid": "550e8400-e29b-41d4-a716-446655440001",
    "addedAt": "2024-01-14T08:15:00.000Z",
    "sku": {
      "uid": "sku-002",
      "skuCode": "SPK-WHT-001",
      "priceCents": 7999,
      "currency": "INR",
      "compareAtPriceCents": null,
      "stockTracking": false,
      "backorderable": false
    },
    "product": {
      "uid": "product-002",
      "title": "Bluetooth Speaker",
      "slug": "bluetooth-speaker",
      "status": "PUBLISHED",
      "images": [
        {
          "uid": "img-002",
          "url": "https://example.com/images/speaker.jpg",
          "altText": "Bluetooth Speaker",
          "isPrimary": true
        }
      ]
    }
  }
]
```

**Response Fields:**

- `uid` - Wishlist item unique identifier
- `addedAt` - Timestamp when item was added to wishlist
- `sku` - SKU/variant information
  - `uid` - SKU unique identifier
  - `skuCode` - SKU code
  - `priceCents` - Price in cents
  - `currency` - Currency code (e.g., "INR", "USD")
  - `compareAtPriceCents` - Original price (for discounts), null if not applicable
  - `stockTracking` - Whether stock is tracked for this SKU
  - `backorderable` - Whether the SKU can be backordered
- `product` - Product information
  - `uid` - Product unique identifier
  - `title` - Product title
  - `slug` - URL-friendly product slug
  - `status` - Product status (PUBLISHED, ARCHIVED, DRAFT)
  - `images` - Array of product images (primary image included)
- `stockInfo` - Stock information (only present if `stockTracking` is true)
  - `available` - Available quantity (onHand - reserved)
  - `reserved` - Reserved quantity
  - `isInStock` - Whether item is currently in stock

**Note:** Items are returned in descending order by `addedAt` (most recent first).

**Error Responses:**

- `401 Unauthorized`: Invalid or expired access token
- `500 Internal Server Error`: Server error

---

### 2. Add to Wishlist

**Endpoint:** `POST /customer/wishlist`

**Description:** Adds a SKU (product variant) to the authenticated customer's wishlist. If the SKU is already in the wishlist, the operation is idempotent and returns the existing item.

**Headers:**

```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**

```json
{
  "skuUid": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Request Fields:**

| Field   | Type   | Required | Description                    |
| ------- | ------ | -------- | ------------------------------ |
| `skuUid` | string | Yes      | SKU unique identifier (UUID) |

**Validation Rules:**

- `skuUid`: Must be a valid UUID format
- SKU must exist in the system
- SKU must belong to a published product

**Response (200 OK):**

```json
{
  "uid": "550e8400-e29b-41d4-a716-446655440000",
  "addedAt": "2024-01-15T10:30:00.000Z",
  "sku": {
    "uid": "sku-001",
    "skuCode": "WH-BLK-001",
    "priceCents": 9999,
    "currency": "INR",
    "compareAtPriceCents": 12999,
    "stockTracking": true,
    "backorderable": false
  },
  "product": {
    "uid": "product-001",
    "title": "Wireless Headphones",
    "slug": "wireless-headphones",
    "status": "PUBLISHED",
    "images": [
      {
        "uid": "img-001",
        "url": "https://example.com/images/headphones.jpg",
        "altText": "Wireless Headphones",
        "isPrimary": true
      }
    ]
  },
  "stockInfo": {
    "available": 50,
    "reserved": 5,
    "isInStock": true
  }
}
```

**Idempotent Behavior:**

If the SKU is already in the wishlist, the API returns the existing wishlist item without creating a duplicate. The response will have the original `addedAt` timestamp.

**Error Responses:**

- `400 Bad Request`: Invalid request body or validation errors
- `401 Unauthorized`: Invalid or expired access token
- `404 Not Found`: SKU not found
- `500 Internal Server Error`: Server error

---

### 3. Remove from Wishlist

**Endpoint:** `DELETE /customer/wishlist/:uid`

**Description:** Removes an item from the authenticated customer's wishlist.

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Path Parameters:**

| Parameter | Type   | Required | Description                    |
| --------- | ------ | -------- | ------------------------------ |
| `uid`     | string | Yes      | Wishlist item unique identifier |

**Example Request:**

```
DELETE /customer/wishlist/550e8400-e29b-41d4-a716-446655440000
```

**Response (200 OK):**

```json
{
  "message": "Item removed from wishlist"
}
```

**Error Responses:**

- `401 Unauthorized`: Invalid or expired access token
- `404 Not Found`: Wishlist item not found or doesn't belong to the user
- `500 Internal Server Error`: Server error

**Security Note:** The API verifies that the wishlist item belongs to the authenticated user before deletion.

---

### 4. Move to Cart

**Endpoint:** `POST /customer/wishlist/:uid/move-to-cart`

**Description:** Moves a wishlist item to the customer's shopping cart. The item is automatically removed from the wishlist after being added to the cart. If the item already exists in the cart, the quantity is increased.

**Headers:**

```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Path Parameters:**

| Parameter | Type   | Required | Description                    |
| --------- | ------ | -------- | ------------------------------ |
| `uid`     | string | Yes      | Wishlist item unique identifier |

**Request Body (Optional):**

```json
{
  "quantity": 1
}
```

**Request Fields:**

| Field     | Type   | Required | Default | Description              |
| --------- | ------ | -------- | ------- | ------------------------ |
| `quantity` | number | No       | 1       | Quantity to add to cart |

**Example Request:**

```
POST /customer/wishlist/550e8400-e29b-41d4-a716-446655440000/move-to-cart
Content-Type: application/json

{
  "quantity": 2
}
```

**Response (200 OK):**

```json
{
  "message": "Item moved to cart",
  "cartItemUid": "550e8400-e29b-41d4-a716-446655440001"
}
```

**Response Fields:**

- `message` - Success message
- `cartItemUid` - Unique identifier of the cart item created/updated

**Business Logic:**

1. Verifies the wishlist item belongs to the authenticated user
2. Checks stock availability (if stock tracking is enabled)
3. Creates an active cart if the user doesn't have one
4. Adds the item to cart:
   - If item already exists in cart, increases quantity
   - If item is new, creates a new cart item
5. Removes the item from wishlist after successful cart addition

**Stock Validation:**

- If `stockTracking` is `true`:
  - Checks if available quantity is sufficient
  - If `backorderable` is `false` and stock is insufficient, returns error
  - If `backorderable` is `true`, allows addition even if stock is insufficient
- If `stockTracking` is `false`, no stock validation is performed

**Error Responses:**

- `400 Bad Request`:
  - Invalid request body
  - Insufficient stock (when stock tracking is enabled and item is not backorderable)
- `401 Unauthorized`: Invalid or expired access token
- `404 Not Found`: Wishlist item not found or doesn't belong to the user
- `500 Internal Server Error`: Server error

---

## Request/Response Structures

### Add to Wishlist Request

```typescript
interface AddToWishlistRequest {
  skuUid: string; // UUID format
}
```

### Wishlist Item Response

```typescript
interface WishlistItemResponse {
  uid: string; // Wishlist item unique identifier
  addedAt: Date; // Timestamp when added
  sku: {
    uid: string; // SKU unique identifier
    skuCode: string; // SKU code
    priceCents: number; // Price in cents
    currency: string; // Currency code (e.g., "INR", "USD")
    compareAtPriceCents: number | null; // Original price for discounts
    stockTracking: boolean; // Whether stock is tracked
    backorderable: boolean; // Whether item can be backordered
  };
  product: {
    uid: string; // Product unique identifier
    title: string; // Product title
    slug: string; // URL-friendly slug
    status: string; // Product status (PUBLISHED, ARCHIVED, DRAFT)
    images: Array<{
      uid: string;
      url: string;
      altText: string | null;
      isPrimary: boolean;
    }>;
  };
  stockInfo?: {
    available: number; // Available quantity (onHand - reserved)
    reserved: number; // Reserved quantity
    isInStock: boolean; // Stock availability status
  };
}
```

**Note:** `stockInfo` is only present when `sku.stockTracking` is `true`.

### Move to Cart Request

```typescript
interface MoveToCartRequest {
  quantity?: number; // Optional, defaults to 1
}
```

### Move to Cart Response

```typescript
interface MoveToCartResponse {
  message: string; // Success message
  cartItemUid?: string; // Cart item unique identifier
}
```

---

## Error Handling

### Common Error Responses

| Status Code | Error                 | Description                                    |
| ----------- | --------------------- | ---------------------------------------------- |
| 400         | Bad Request           | Invalid request body, validation errors, or insufficient stock |
| 401         | Unauthorized          | Invalid or expired access token                |
| 404         | Not Found             | SKU or wishlist item not found                 |
| 500         | Internal Server Error | Server error                                   |

### Error Response Format

```json
{
  "statusCode": 404,
  "message": "SKU not found",
  "error": "Not Found"
}
```

### Error Handling Guidelines

1. **401 Unauthorized**: Redirect user to login page or refresh access token
2. **404 Not Found**: Show user-friendly message that item is no longer available
3. **400 Bad Request**: Display validation error message to user
4. **500 Internal Server Error**: Show generic error message and log error for debugging

---

## Business Logic

### Adding Items

- **Idempotent Operation**: Adding the same SKU multiple times won't create duplicates
- **SKU Validation**: Only published products' SKUs can be added to wishlist
- **User Ownership**: Each wishlist item is tied to the authenticated user

### Stock Information

- **Stock Tracking**: If `stockTracking` is `true`, `stockInfo` is included in response
- **Stock Calculation**: `available = onHand - reserved`
- **In Stock Status**: `isInStock = true` if:
  - `stockTracking` is `false`, OR
  - `available > 0`, OR
  - `backorderable` is `true`

### Moving to Cart

- **Cart Creation**: If user doesn't have an active cart, one is created automatically
- **Quantity Handling**: If item already exists in cart, quantity is increased
- **Stock Validation**: Validates stock before adding to cart (if stock tracking enabled)
- **Automatic Removal**: Item is removed from wishlist after successful cart addition

### Ordering

- Wishlist items are returned in descending order by `addedAt` (most recent first)

---

## Price Formatting

Prices are returned in **cents**. To display to users:

- **INR**: `₹${(priceCents / 100).toFixed(2)}`
- **USD**: `$${(priceCents / 100).toFixed(2)}`

**Example:**
- `priceCents: 9999` = ₹99.99 or $99.99
- `priceCents: 12999` = ₹129.99 or $129.99

---

## Testing

### Test Get Wishlist

```bash
curl -X GET "http://localhost:3000/customer/wishlist" \
  -H "Authorization: Bearer <accessToken>"
```

### Test Add to Wishlist

```bash
curl -X POST "http://localhost:3000/customer/wishlist" \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "skuUid": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

### Test Remove from Wishlist

```bash
curl -X DELETE "http://localhost:3000/customer/wishlist/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer <accessToken>"
```

### Test Move to Cart

```bash
curl -X POST "http://localhost:3000/customer/wishlist/550e8400-e29b-41d4-a716-446655440000/move-to-cart" \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 1
  }'
```

---

## Support

For issues or questions:

1. Check the API documentation at `/swagger`
2. Review error messages in the response
3. Verify access token is valid and not expired
4. Check network requests in browser DevTools
5. Refer to [Customer Authentication Integration Guide](./CUSTOMER_AUTH_FRONTEND_INTEGRATION.md) for authentication details

---

## Changelog

- **v1.0.0** - Initial wishlist API
  - Get wishlist items
  - Add SKU to wishlist
  - Remove item from wishlist
  - Move item to cart


