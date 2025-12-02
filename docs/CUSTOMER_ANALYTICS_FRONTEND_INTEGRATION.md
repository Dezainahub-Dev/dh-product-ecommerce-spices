# Customer Analytics - Frontend Integration Guide

This guide provides complete API documentation for integrating customer analytics functionality in your frontend application. It covers customer-facing data and insights that customers can view about their own activity, orders, and preferences.

## Table of Contents

1. [Overview](#overview)
2. [Base URL](#base-url)
3. [Authentication](#authentication)
4. [Order Analytics APIs](#order-analytics-apis)
5. [Profile Analytics APIs](#profile-analytics-apis)
6. [Activity Analytics APIs](#activity-analytics-apis)
7. [Best Practices](#best-practices)
8. [Error Handling](#error-handling)

---

## Overview

The customer analytics system allows customers to view insights about their own:

- **Order History**: View all orders with status, dates, and totals
- **Profile Information**: View account details and statistics
- **Activity Data**: View recently viewed products, wishlist items, and reviews
- **Spending Insights**: View order totals and purchase history

### Customer Analytics Flow

```
1. Order Analytics
   ├── View all orders (with pagination and filters)
   ├── View order details
   └── View order statistics

2. Profile Analytics
   ├── View profile information
   └── View account statistics

3. Activity Analytics
   ├── Recently viewed products
   ├── Wishlist items
   └── Reviews and ratings
```

### Base URL

All customer endpoints are prefixed with `/customer`:

```
Base URL: https://your-api-domain.com/customer
```

---

## Authentication

All customer analytics endpoints require authentication using Bearer token:

```
Authorization: Bearer <accessToken>
```

The access token is obtained from the customer authentication flow. See customer authentication documentation for details.

**Note:** All endpoints return data only for the authenticated customer.

---

## Order Analytics APIs

### 1. Get My Orders

Retrieve a paginated list of orders for the authenticated customer with optional status filtering.

**Endpoint:** `GET /customer/orders`

**Query Parameters:**

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `page` | number | No | Page number (default: 1) | `1` |
| `limit` | number | No | Items per page (default: 10) | `10` |
| `status` | string | No | Filter by order status: `pending`, `paid`, `processing`, `shipped`, `delivered`, `cancelled`, `refunded` | `delivered` |

**Request Example:**

```http
GET /customer/orders?page=1&limit=10&status=delivered
Authorization: Bearer <accessToken>
```

**Response:** `200 OK`

```json
{
  "page": 1,
  "limit": 10,
  "total": 25,
  "totalPages": 3,
  "orders": [
    {
      "uid": "order-uid-123",
      "status": "delivered",
      "totalCents": 15000,
      "currency": "USD",
      "placedAt": "2024-12-15T10:30:00Z",
      "itemsCount": 3,
      "createdAt": "2024-12-15T10:30:00Z"
    }
  ]
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `page` | number | Current page number |
| `limit` | number | Items per page |
| `total` | number | Total number of orders |
| `totalPages` | number | Total number of pages |
| `orders` | array | Array of order objects |
| `orders[].uid` | string | Order UID |
| `orders[].status` | string | Order status |
| `orders[].totalCents` | number | Total amount in cents |
| `orders[].currency` | string | Currency code |
| `orders[].placedAt` | string (ISO 8601) | Order placement date |
| `orders[].itemsCount` | number | Number of items in order |
| `orders[].createdAt` | string (ISO 8601) | Order creation date |

---

### 2. Get Order Detail

Retrieve detailed information about a specific order.

**Endpoint:** `GET /customer/orders/:orderUid`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `orderUid` | string | Yes | Order UID |

**Request Example:**

```http
GET /customer/orders/order-uid-123
Authorization: Bearer <accessToken>
```

**Response:** `200 OK`

```json
{
  "uid": "order-uid-123",
  "status": "delivered",
  "totalCents": 15000,
  "currency": "USD",
  "placedAt": "2024-12-15T10:30:00Z",
  "items": [
    {
      "productUid": "product-uid-456",
      "productTitle": "Premium Wireless Headphones",
      "quantity": 1,
      "unitPriceCents": 10000,
      "totalPriceCents": 10000
    }
  ],
  "shippingAddress": {
    "line1": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "postalCode": "10001"
  },
  "createdAt": "2024-12-15T10:30:00Z"
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `uid` | string | Order UID |
| `status` | string | Order status |
| `totalCents` | number | Total amount in cents |
| `currency` | string | Currency code |
| `placedAt` | string (ISO 8601) | Order placement date |
| `items` | array | Array of order items |
| `items[].productUid` | string | Product UID |
| `items[].productTitle` | string | Product title |
| `items[].quantity` | number | Item quantity |
| `items[].unitPriceCents` | number | Unit price in cents |
| `items[].totalPriceCents` | number | Total price in cents |
| `shippingAddress` | object | Shipping address |
| `createdAt` | string (ISO 8601) | Order creation date |

**Error Responses:**

- `404 Not Found`: Order not found
- `403 Forbidden`: Access denied to this order

---

### 3. Cancel Order

Cancel an order before shipment.

**Endpoint:** `POST /customer/orders/:orderUid/cancel`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `orderUid` | string | Yes | Order UID |

**Request Body:**

```json
{
  "reason": "Changed my mind"
}
```

**Request Body Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `reason` | string | No | Cancellation reason |

**Request Example:**

```http
POST /customer/orders/order-uid-123/cancel
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "reason": "Changed my mind"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Order cancelled successfully"
}
```

**Error Responses:**

- `400 Bad Request`: Order cannot be cancelled
- `404 Not Found`: Order not found

---

## Profile Analytics APIs

### 1. Get My Profile

Retrieve the authenticated customer's profile information and statistics.

**Endpoint:** `GET /customer/me`

**Request Example:**

```http
GET /customer/me
Authorization: Bearer <accessToken>
```

**Response:** `200 OK`

```json
{
  "uid": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "gender": "MALE",
  "dateOfBirth": "1990-05-15T00:00:00Z",
  "marketingOptIn": true,
  "newsletterOptIn": false,
  "avatarUrl": "https://example.com/avatars/john.jpg",
  "isVerified": true,
  "lastLoginAt": "2024-12-20T14:22:00Z",
  "ordersCount": 5,
  "addressesCount": 2,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-12-18T09:15:00Z"
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `uid` | string | Unique customer identifier |
| `email` | string | Customer email address |
| `firstName` | string \| null | Customer first name |
| `lastName` | string \| null | Customer last name |
| `phone` | string \| null | Customer phone number |
| `gender` | string \| null | Gender (MALE, FEMALE, OTHER) |
| `dateOfBirth` | string \| null (ISO 8601) | Date of birth |
| `marketingOptIn` | boolean | Marketing communication opt-in |
| `newsletterOptIn` | boolean | Newsletter subscription status |
| `avatarUrl` | string \| null | Profile picture URL |
| `isVerified` | boolean | Account verification status |
| `lastLoginAt` | string \| null (ISO 8601) | Last login timestamp |
| `ordersCount` | number | Total number of orders |
| `addressesCount` | number | Total number of addresses |
| `createdAt` | string (ISO 8601) | Account creation date |
| `updatedAt` | string (ISO 8601) | Last update timestamp |

---

### 2. Update Profile

Update the authenticated customer's profile information.

**Endpoint:** `PATCH /customer/me`

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "gender": "MALE",
  "dateOfBirth": "1990-05-15T00:00:00Z",
  "marketingOptIn": true,
  "newsletterOptIn": false,
  "avatarUrl": "https://example.com/avatars/john.jpg"
}
```

**Request Body Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `firstName` | string | No | Customer first name |
| `lastName` | string | No | Customer last name |
| `phone` | string | No | Customer phone number |
| `gender` | string | No | Gender (MALE, FEMALE, OTHER) |
| `dateOfBirth` | string (ISO 8601) | No | Date of birth |
| `marketingOptIn` | boolean | No | Marketing communication opt-in |
| `newsletterOptIn` | boolean | No | Newsletter subscription status |
| `avatarUrl` | string | No | Profile picture URL |

**Request Example:**

```http
PATCH /customer/me
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1987654321"
}
```

**Response:** `200 OK`

Returns the updated customer profile (same structure as Get My Profile).

---

### 3. Change Password

Change the authenticated customer's password.

**Endpoint:** `PATCH /customer/me/change-password`

**Request Body:**

```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

**Request Body Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `currentPassword` | string | Yes | Current password |
| `newPassword` | string | Yes | New password |

**Request Example:**

```http
PATCH /customer/me/change-password
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

**Response:** `200 OK`

```json
{
  "message": "Password changed successfully"
}
```

**Error Responses:**

- `400 Bad Request`: Invalid current password

---

## Activity Analytics APIs

### 1. Get My Reviews

Retrieve all reviews created by the authenticated customer.

**Endpoint:** `GET /customer/reviews/me`

**Request Example:**

```http
GET /customer/reviews/me
Authorization: Bearer <accessToken>
```

**Response:** `200 OK`

```json
[
  {
    "uid": "review-uid-123",
    "productUid": "product-uid-456",
    "productTitle": "Premium Wireless Headphones",
    "rating": 5,
    "comment": "Excellent product!",
    "createdAt": "2024-12-10T10:30:00Z",
    "updatedAt": "2024-12-10T10:30:00Z"
  }
]
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `uid` | string | Review UID |
| `productUid` | string | Product UID |
| `productTitle` | string | Product title |
| `rating` | number | Rating (1-5) |
| `comment` | string \| null | Review comment |
| `createdAt` | string (ISO 8601) | Review creation date |
| `updatedAt` | string (ISO 8601) | Review last update date |

---

### 2. Get My Return Requests

Retrieve all return requests for the authenticated customer.

**Endpoint:** `GET /customer/return-requests`

**Request Example:**

```http
GET /customer/return-requests
Authorization: Bearer <accessToken>
```

**Response:** `200 OK`

```json
{
  "total": 3,
  "returnRequests": [
    {
      "uid": "return-uid-123",
      "orderUid": "order-uid-456",
      "status": "approved",
      "reason": "Defective product",
      "requestedAt": "2024-12-15T10:30:00Z",
      "createdAt": "2024-12-15T10:30:00Z"
    }
  ]
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `total` | number | Total number of return requests |
| `returnRequests` | array | Array of return request objects |
| `returnRequests[].uid` | string | Return request UID |
| `returnRequests[].orderUid` | string | Order UID |
| `returnRequests[].status` | string | Return request status |
| `returnRequests[].reason` | string | Return reason |
| `returnRequests[].requestedAt` | string (ISO 8601) | Request date |
| `returnRequests[].createdAt` | string (ISO 8601) | Creation date |

---

### 3. Get Recently Viewed Products

Retrieve recently viewed products for the authenticated customer.

**Endpoint:** `GET /customer/recently-viewed`

**Query Parameters:**

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `limit` | number | No | Number of products to return (default: 20) | `20` |

**Request Example:**

```http
GET /customer/recently-viewed?limit=20
Authorization: Bearer <accessToken>
```

**Response:** `200 OK`

```json
[
  {
    "productUid": "product-uid-123",
    "productTitle": "Premium Wireless Headphones",
    "viewedAt": "2024-12-20T14:22:00Z"
  },
  {
    "productUid": "product-uid-456",
    "productTitle": "Smart Watch Pro",
    "viewedAt": "2024-12-19T10:15:00Z"
  }
]
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `productUid` | string | Product UID |
| `productTitle` | string | Product title |
| `viewedAt` | string (ISO 8601) | View timestamp |

---

### 4. Get My Wishlist

Retrieve wishlist items for the authenticated customer.

**Endpoint:** `GET /customer/wishlist`

**Request Example:**

```http
GET /customer/wishlist
Authorization: Bearer <accessToken>
```

**Response:** `200 OK`

```json
[
  {
    "uid": "wishlist-item-uid-123",
    "productUid": "product-uid-456",
    "productTitle": "Premium Wireless Headphones",
    "variantUid": "variant-uid-789",
    "addedAt": "2024-12-15T10:30:00Z"
  }
]
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `uid` | string | Wishlist item UID |
| `productUid` | string | Product UID |
| `productTitle` | string | Product title |
| `variantUid` | string | Product variant UID |
| `addedAt` | string (ISO 8601) | Date added to wishlist |

---

## Best Practices

### 1. Data Privacy

- Only display data for the authenticated customer
- Never expose other customers' data
- Implement proper access controls
- Show clear privacy notices

### 2. Pagination

- Always use pagination for order lists
- Default to 10 items per page
- Implement infinite scroll or "Load More" for better UX
- Display total count and page information

### 3. Filtering and Sorting

- Allow filtering orders by status
- Provide date range filters for orders
- Sort orders by most recent first
- Show active filters clearly

### 4. Data Visualization

- Show order statistics (total orders, total spent)
- Display order status with visual indicators
- Use charts for spending trends (if available)
- Show order timeline/history

### 5. Performance

- Cache profile data when appropriate
- Lazy load order details
- Implement virtual scrolling for large lists
- Use pagination for all lists

### 6. User Experience

- Show loading states during API calls
- Display empty states when no data is available
- Provide clear error messages
- Allow easy navigation between related data

### 7. Security

- Validate all user inputs
- Never expose sensitive data unnecessarily
- Implement proper authentication checks
- Log security-relevant actions

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

**Common Causes:**
- Invalid request body format
- Missing required fields
- Invalid data types
- Invalid password format

**Handling:**
- Validate input before sending request
- Display field-specific error messages
- Show password requirements clearly

---

#### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

**Common Causes:**
- Missing or invalid access token
- Expired access token

**Handling:**
- Redirect to login page
- Refresh access token if available
- Clear stored tokens and re-authenticate

---

#### 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "Access denied to this order",
  "error": "Forbidden"
}
```

**Common Causes:**
- Trying to access another customer's order
- Insufficient permissions

**Handling:**
- Show user-friendly error message
- Redirect to customer's own orders
- Log security violations

---

#### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Order not found",
  "error": "Not Found"
}
```

**Common Causes:**
- Invalid order UID
- Order has been deleted
- Order doesn't belong to customer

**Handling:**
- Verify the UID exists before making request
- Show user-friendly error message
- Redirect to order list if order not found
- Refresh data if item may have been deleted

---

#### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

**Common Causes:**
- Server-side error
- Database connection issues

**Handling:**
- Show generic error message to user
- Log error for debugging
- Retry request if appropriate
- Contact support if issue persists

---

### Error Handling Best Practices

1. **User-Friendly Messages**: Translate technical error messages into user-friendly text
2. **Error Logging**: Log errors for debugging while showing simple messages to users
3. **Retry Logic**: Implement retry for transient errors (network issues)
4. **Validation**: Validate inputs client-side before sending requests
5. **Loading States**: Show loading indicators during API calls
6. **Error Boundaries**: Implement error boundaries to catch and handle errors gracefully
7. **Offline Handling**: Handle offline scenarios gracefully

---

## API Response Examples

### Complete Order List Response

```json
{
  "page": 1,
  "limit": 10,
  "total": 25,
  "totalPages": 3,
  "orders": [
    {
      "uid": "order-uid-123",
      "status": "delivered",
      "totalCents": 15000,
      "currency": "USD",
      "placedAt": "2024-12-15T10:30:00Z",
      "itemsCount": 3,
      "createdAt": "2024-12-15T10:30:00Z"
    }
  ]
}
```

### Complete Profile Response

```json
{
  "uid": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "gender": "MALE",
  "dateOfBirth": "1990-05-15T00:00:00Z",
  "marketingOptIn": true,
  "newsletterOptIn": false,
  "avatarUrl": "https://example.com/avatars/john.jpg",
  "isVerified": true,
  "lastLoginAt": "2024-12-20T14:22:00Z",
  "ordersCount": 5,
  "addressesCount": 2,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-12-18T09:15:00Z"
}
```

---

## Summary

This guide covers all customer analytics APIs available for authenticated customers:

- **Order Analytics**: View and manage orders with filtering and pagination
- **Profile Analytics**: View and update profile information and statistics
- **Activity Analytics**: View reviews, return requests, recently viewed products, and wishlist

All endpoints require customer authentication and return data only for the authenticated customer. Implement proper error handling, pagination, and data visualization for the best user experience.

For additional API documentation, refer to:
- [Admin Analytics](./ADMIN_ANALYTICS_FRONTEND_INTEGRATION.md)
- [Customer Authentication](./CUSTOMER_AUTH_FRONTEND_INTEGRATION.md)
- [Order Management](./COMPLETE_ORDER_PAYMENT_SUMMARY.md)

