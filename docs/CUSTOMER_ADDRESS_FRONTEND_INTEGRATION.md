# Customer Address - Frontend Integration Guide

This guide provides complete documentation for integrating address management APIs in your frontend application.

## Table of Contents

1. [Overview](#overview)
2. [Base URL](#base-url)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
5. [Request/Response Structures](#requestresponse-structures)
6. [Error Handling](#error-handling)
7. [Best Practices](#best-practices)
8. [Related APIs](#related-apis)

---

## Overview

The address API allows customers to:

- Create, read, update, and delete addresses
- Set default addresses
- Manage multiple addresses
- Use addresses for shipping and billing in orders

### Key Features

- **Multiple Addresses** - Customers can store multiple addresses
- **Default Address** - Set one address as default for quick checkout
- **Address Types** - Categorize addresses (HOME, WORK, OTHER)
- **Soft Delete** - Addresses are soft-deleted (can't delete if used in active orders)
- **Address Labels** - Add custom labels like "Mom's house" for easy identification
- **Geolocation** - Optional latitude/longitude coordinates

### Authentication

**Note:** All customer address endpoints require authentication. The customer-scoped endpoints automatically use the authenticated user's ID.

---

## Base URL

All customer address endpoints are prefixed with `/customer/addresses`:

```
Base URL: https://your-api-domain.com/customer/addresses
```

---

## Authentication

All customer address endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <accessToken>
```

The access token is obtained from the customer authentication flow. See [CUSTOMER_AUTH_FRONTEND_INTEGRATION.md](./CUSTOMER_AUTH_FRONTEND_INTEGRATION.md) for details.

---

## API Endpoints

### 1. Get My Addresses

**Endpoint:** `GET /customer/addresses`

**Description:** Retrieves all addresses for the authenticated customer, sorted with default address first.

**Authentication:** Required

**Request Headers:**

```
Authorization: Bearer <accessToken>
```

**Example Request:**

```bash
curl -X GET https://your-api-domain.com/customer/addresses \
  -H "Authorization: Bearer <accessToken>"
```

**Response (200 OK):**

```json
[
  {
    "uid": "550e8400-e29b-41d4-a716-446655440000",
    "line1": "123 Main Street",
    "line2": "Apartment 4B",
    "city": "Bengaluru",
    "state": "Karnataka",
    "country": "India",
    "postalCode": "560001",
    "phone": "+91-9876543210",
    "isDefault": true,
    "label": "Home",
    "type": "HOME",
    "lat": 12.9716,
    "lng": 77.5946,
    "isDeleted": false,
    "createdAt": "2025-01-15T10:30:00.000Z"
  },
  {
    "uid": "660e8400-e29b-41d4-a716-446655440001",
    "line1": "456 Office Park",
    "line2": null,
    "city": "Bengaluru",
    "state": "Karnataka",
    "country": "India",
    "postalCode": "560002",
    "phone": "+91-9876543211",
    "isDefault": false,
    "label": "Work",
    "type": "WORK",
    "lat": 12.9352,
    "lng": 77.6245,
    "isDeleted": false,
    "createdAt": "2025-01-20T14:20:00.000Z"
  }
]
```

**Response Fields:**

| Field        | Type    | Description                                   |
| ------------ | ------- | --------------------------------------------- |
| `uid`        | string  | Unique identifier for the address             |
| `line1`      | string  | Primary address line (required)               |
| `line2`      | string  | Secondary address line (optional)             |
| `city`       | string  | City name (required)                          |
| `state`      | string  | State/Province name (required)                |
| `country`    | string  | Country name (required)                       |
| `postalCode` | string  | Postal/ZIP code (required)                    |
| `phone`      | string  | Phone number (optional)                       |
| `isDefault`  | boolean | Whether this is the default address           |
| `label`      | string  | Custom label for the address (optional)       |
| `type`       | string  | Address type: HOME, WORK, or OTHER (optional) |
| `lat`        | number  | Latitude coordinate (optional)                |
| `lng`        | number  | Longitude coordinate (optional)               |
| `isDeleted`  | boolean | Whether the address is soft-deleted           |
| `createdAt`  | string  | ISO 8601 timestamp of creation                |

**Note:** Addresses are sorted with default address first, then by creation date (newest first).

---

### 2. Create Address

**Endpoint:** `POST /customer/addresses`

**Description:** Creates a new address for the authenticated customer. If `isDefault` is set to `true`, all other addresses will be unset as default.

**Authentication:** Required

**Request Body:**

```json
{
  "line1": "123 Main Street",
  "line2": "Apartment 4B",
  "city": "Bengaluru",
  "state": "Karnataka",
  "country": "India",
  "postalCode": "560001",
  "phone": "+91-9876543210",
  "isDefault": true,
  "label": "Home",
  "type": "HOME",
  "lat": 12.9716,
  "lng": 77.5946
}
```

**Request Parameters:**

| Parameter    | Type    | Required | Description                             |
| ------------ | ------- | -------- | --------------------------------------- |
| `line1`      | string  | Yes      | Primary address line                    |
| `line2`      | string  | No       | Secondary address line                  |
| `city`       | string  | Yes      | City name                               |
| `state`      | string  | Yes      | State/Province name                     |
| `country`    | string  | Yes      | Country name                            |
| `postalCode` | string  | Yes      | Postal/ZIP code                         |
| `phone`      | string  | No       | Phone number                            |
| `isDefault`  | boolean | No       | Set as default address (default: false) |
| `label`      | string  | No       | Custom label (e.g., "Mom's house")      |
| `type`       | string  | No       | Address type: HOME, WORK, or OTHER      |
| `lat`        | number  | No       | Latitude coordinate                     |
| `lng`        | number  | No       | Longitude coordinate                    |

**Address Type Values:**

- `HOME` - Home address
- `WORK` - Work/Office address
- `OTHER` - Other type of address

**Example Request:**

```bash
curl -X POST https://your-api-domain.com/customer/addresses \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "line1": "123 Main Street",
    "line2": "Apartment 4B",
    "city": "Bengaluru",
    "state": "Karnataka",
    "country": "India",
    "postalCode": "560001",
    "phone": "+91-9876543210",
    "isDefault": true,
    "label": "Home",
    "type": "HOME"
  }'
```

**Response (201 Created):**

```json
{
  "uid": "550e8400-e29b-41d4-a716-446655440000",
  "line1": "123 Main Street",
  "line2": "Apartment 4B",
  "city": "Bengaluru",
  "state": "Karnataka",
  "country": "India",
  "postalCode": "560001",
  "phone": "+91-9876543210",
  "isDefault": true,
  "label": "Home",
  "type": "HOME",
  "lat": 12.9716,
  "lng": 77.5946,
  "isDeleted": false,
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

**Error Responses:**

- `400 Bad Request` - Invalid request body or validation error
- `401 Unauthorized` - Missing or invalid authentication token

---

### 3. Update Address

**Endpoint:** `PATCH /customer/addresses/:uid`

**Description:** Updates an address belonging to the authenticated customer. If `isDefault` is set to `true`, all other addresses will be unset as default.

**Authentication:** Required

**URL Parameters:**

| Parameter | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| `uid`     | string | Yes      | Address UID |

**Request Body:**

```json
{
  "line1": "456 Updated Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "postalCode": "400001",
  "isDefault": false
}
```

**Request Parameters:**

All fields are optional. Only include fields you want to update.

| Parameter    | Type    | Required | Description                        |
| ------------ | ------- | -------- | ---------------------------------- |
| `line1`      | string  | No       | Primary address line               |
| `line2`      | string  | No       | Secondary address line             |
| `city`       | string  | No       | City name                          |
| `state`      | string  | No       | State/Province name                |
| `country`    | string  | No       | Country name                       |
| `postalCode` | string  | No       | Postal/ZIP code                    |
| `phone`      | string  | No       | Phone number                       |
| `isDefault`  | boolean | No       | Set as default address             |
| `label`      | string  | No       | Custom label                       |
| `type`       | string  | No       | Address type: HOME, WORK, or OTHER |
| `lat`        | number  | No       | Latitude coordinate                |
| `lng`        | number  | No       | Longitude coordinate               |

**Example Request:**

```bash
curl -X PATCH https://your-api-domain.com/customer/addresses/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "line1": "456 Updated Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400001"
  }'
```

**Response (200 OK):**

```json
{
  "uid": "550e8400-e29b-41d4-a716-446655440000",
  "line1": "456 Updated Street",
  "line2": "Apartment 4B",
  "city": "Mumbai",
  "state": "Maharashtra",
  "country": "India",
  "postalCode": "400001",
  "phone": "+91-9876543210",
  "isDefault": true,
  "label": "Home",
  "type": "HOME",
  "lat": 19.076,
  "lng": 72.8777,
  "isDeleted": false,
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

**Error Responses:**

- `400 Bad Request` - Invalid request body
- `401 Unauthorized` - Missing or invalid authentication token
- `404 Not Found` - Address not found or doesn't belong to user

---

### 4. Delete Address

**Endpoint:** `DELETE /customer/addresses/:uid`

**Description:** Soft deletes an address belonging to the authenticated customer. Addresses used in active orders cannot be deleted.

**Authentication:** Required

**URL Parameters:**

| Parameter | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| `uid`     | string | Yes      | Address UID |

**Example Request:**

```bash
curl -X DELETE https://your-api-domain.com/customer/addresses/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer <accessToken>"
```

**Response (200 OK):**

```json
{
  "message": "Address deleted successfully"
}
```

**Error Responses:**

- `400 Bad Request` - Address is used in active orders and cannot be deleted
- `401 Unauthorized` - Missing or invalid authentication token
- `404 Not Found` - Address not found or doesn't belong to user

**Note:** An address is considered "active" if it's used in orders with status other than `delivered`, `cancelled`, or `refunded`.

---

### 5. Set Default Address

**Endpoint:** `PATCH /customer/addresses/:uid/set-default`

**Description:** Sets an address as the default for the authenticated customer. This will automatically unset all other addresses as default.

**Authentication:** Required

**URL Parameters:**

| Parameter | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| `uid`     | string | Yes      | Address UID |

**Example Request:**

```bash
curl -X PATCH https://your-api-domain.com/customer/addresses/550e8400-e29b-41d4-a716-446655440000/set-default \
  -H "Authorization: Bearer <accessToken>"
```

**Response (200 OK):**

```json
{
  "uid": "550e8400-e29b-41d4-a716-446655440000",
  "line1": "123 Main Street",
  "line2": "Apartment 4B",
  "city": "Bengaluru",
  "state": "Karnataka",
  "country": "India",
  "postalCode": "560001",
  "phone": "+91-9876543210",
  "isDefault": true,
  "label": "Home",
  "type": "HOME",
  "lat": 12.9716,
  "lng": 77.5946,
  "isDeleted": false,
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

**Error Responses:**

- `401 Unauthorized` - Missing or invalid authentication token
- `404 Not Found` - Address not found or doesn't belong to user

---

## Request/Response Structures

### Address Object Structure

```typescript
interface Address {
  uid: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string | null;
  isDefault: boolean;
  label: string | null;
  type: 'HOME' | 'WORK' | 'OTHER' | null;
  lat: number | null;
  lng: number | null;
  isDeleted: boolean;
  createdAt: string; // ISO 8601 timestamp
}
```

### Create Address Request

```typescript
interface CreateAddressRequest {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone?: string;
  isDefault?: boolean;
  label?: string;
  type?: 'HOME' | 'WORK' | 'OTHER';
  lat?: number;
  lng?: number;
}
```

### Update Address Request

```typescript
interface UpdateAddressRequest {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
  isDefault?: boolean;
  label?: string;
  type?: 'HOME' | 'WORK' | 'OTHER';
  lat?: number;
  lng?: number;
}
```

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

- Missing required fields (line1, city, state, country, postalCode)
- Invalid address type (must be HOME, WORK, or OTHER)
- Invalid data types
- Address is used in active orders (for delete operation)

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
  "message": "Address not found",
  "error": "Not Found"
}
```

**Common causes:**

- Address UID doesn't exist
- Address doesn't belong to the authenticated user
- Address has been soft-deleted

### Error Handling Example

```typescript
async function handleAddressOperation(operation: () => Promise<any>) {
  try {
    return await operation();
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          if (data.message.includes('active orders')) {
            alert('Cannot delete address that is used in active orders');
          } else {
            alert(`Invalid request: ${data.message}`);
          }
          break;
        case 401:
          // Refresh token or redirect to login
          handleUnauthorized();
          break;
        case 404:
          alert('Address not found. Please refresh the page.');
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
```

---

## Best Practices

### 1. Address Management

- **Fetch on load** - Fetch user addresses when the address management page loads
- **Default address** - Always show the default address prominently
- **Address validation** - Validate address fields on the frontend before submission
- **Geolocation** - Use browser geolocation API to pre-fill lat/lng if user permits

### 2. Default Address Handling

- **Auto-select default** - When setting a new default, update UI immediately
- **One default only** - Ensure only one address can be default at a time
- **Checkout flow** - Pre-select default address in checkout

### 3. Address Deletion

- **Check before delete** - Warn users if address is used in active orders
- **Soft delete** - Addresses are soft-deleted, so they can be restored if needed
- **Clear default** - If deleting default address, prompt user to set a new default

### 4. Address Form

- **Required fields** - Clearly mark required fields (line1, city, state, country, postalCode)
- **Address type** - Provide dropdown for address type (HOME, WORK, OTHER)
- **Labels** - Allow users to add custom labels for easy identification
- **Phone validation** - Validate phone number format on frontend

### 5. Performance

- **Cache addresses** - Cache addresses in state to reduce API calls
- **Optimistic updates** - Update UI immediately, then sync with server
- **Error recovery** - Re-fetch addresses on error to ensure consistency

### 6. User Experience

- **Loading states** - Show loading indicators during address operations
- **Success feedback** - Show success messages for create/update/delete operations
- **Error messages** - Display clear, actionable error messages
- **Address list** - Sort addresses with default first, then by creation date

---

## Related APIs

### Cart APIs

For shipping estimates using addresses:

- **Get Shipping Estimate:** `POST /customer/cart/shipping-estimate`

See [CUSTOMER_CART_FRONTEND_INTEGRATION.md](./CUSTOMER_CART_FRONTEND_INTEGRATION.md) for details.

### Order APIs

For using addresses in orders:

- **Create Order:** `POST /customer/orders`
- **Get Order:** `GET /customer/orders/:orderUid`

### Authentication APIs

For user authentication:

- **Login:** `POST /customer/auth/login`
- **Register:** `POST /customer/auth/register`

See [CUSTOMER_AUTH_FRONTEND_INTEGRATION.md](./CUSTOMER_AUTH_FRONTEND_INTEGRATION.md) for details.

---

## Complete Integration Flow

### 1. Address Management Flow

```typescript
// 1. Fetch user addresses
GET /customer/addresses

// 2. Create new address
POST /customer/addresses
{
  "line1": "...",
  "city": "...",
  "state": "...",
  "country": "...",
  "postalCode": "...",
  "isDefault": true
}

// 3. Update address
PATCH /customer/addresses/:uid
{
  "line1": "Updated address"
}

// 4. Set default address
PATCH /customer/addresses/:uid/set-default

// 5. Delete address
DELETE /customer/addresses/:uid
```

### 2. Checkout Flow with Address

```typescript
// 1. Get user addresses
GET /customer/addresses

// 2. Get shipping estimate for selected address
POST /customer/cart/shipping-estimate
{
  "destination": {
    "city": "Bengaluru",
    "state": "Karnataka",
    "country": "India",
    "postalCode": "560001"
  }
}

// 3. Create order with address
POST /customer/orders
{
  "shippingAddressUid": "550e8400-e29b-41d4-a716-446655440000",
  "billingAddressUid": "550e8400-e29b-41d4-a716-446655440000",
  // ... other order details
}
```

### 3. Address Form Validation

```typescript
// Required fields validation
const requiredFields = ['line1', 'city', 'state', 'country', 'postalCode'];

// Address type validation
const validTypes = ['HOME', 'WORK', 'OTHER'];

// Postal code format validation (example for India)
const postalCodeRegex = /^[1-9][0-9]{5}$/;

// Phone number validation (example)
const phoneRegex = /^\+?[1-9]\d{1,14}$/;
```

---

## Summary

This guide covers all address-related APIs and integration patterns. Key takeaways:

1. **Authentication Required** - All customer address endpoints require Bearer token authentication
2. **User-Scoped** - Customer endpoints automatically scope to authenticated user
3. **Default Address** - Only one address can be default at a time
4. **Soft Delete** - Addresses are soft-deleted, cannot delete if used in active orders
5. **Address Types** - Support for HOME, WORK, and OTHER address types
6. **Geolocation** - Optional latitude/longitude coordinates for mapping

For questions or issues, refer to the API documentation or contact the backend team.
