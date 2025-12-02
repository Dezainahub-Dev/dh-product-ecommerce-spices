# Backend Implementation Requirements

This document tracks backend API endpoints that are referenced in the frontend but not yet implemented on the backend.

## Missing Endpoints

### 1. Create Order (Checkout)

**Status**: ❌ Not Implemented (Returns 404)

**Endpoint**: `POST /customer/orders`

**Description**: Creates a new order from the customer's current cart. This endpoint should:
1. Validate the customer's cart
2. Create an order record with all cart items
3. Associate the order with the provided shipping address
4. Clear the customer's cart
5. Return the order details

**Request Body**:
```json
{
  "shippingAddressUid": "address-uid-123",
  "paymentMethod": "COD"  // Optional: COD, CARD, UPI, etc.
}
```

**Expected Response** (200 OK):
```json
{
  "orderUid": "order-uid-123",
  "status": "pending",
  "message": "Order created successfully"
}
```

**Error Responses**:
- `400 Bad Request` - Invalid address UID or cart is empty
- `401 Unauthorized` - Missing or invalid authentication token
- `409 Conflict` - Cart validation failed (out of stock items, etc.)

**Frontend Integration**:
- File: `src/app/checkout/page.tsx`
- Function: `handlePay()` at line 165
- Currently shows a user-friendly message when 404 is returned

**Priority**: 🔴 HIGH - Core checkout functionality

**Related Endpoints** (Already implemented):
- ✅ `POST /customer/cart/validate` - Cart validation before checkout
- ✅ `GET /customer/addresses` - Get customer addresses
- ✅ `GET /customer/cart` - Get active cart

---

## Workaround Currently in Place

The frontend currently:
1. ✅ Validates the cart before attempting checkout
2. ⚠️ Attempts to create order via `POST /customer/orders`
3. ⚠️ Catches 404 error and shows user-friendly message
4. ℹ️ Tells user: "Order placement feature is currently under development"

## When Backend is Ready

Once the backend implements `POST /customer/orders`, the frontend will:
1. ✅ Automatically start creating real orders
2. ✅ Redirect users to their orders page after successful order creation
3. ✅ Display orders in the Profile → Orders tab
4. ✅ Allow users to view order details and cancel orders

## Testing the Integration

Once implemented, test with:
```bash
curl -X POST https://dh-ecom-backend.vercel.app/api/customer/orders \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "shippingAddressUid": "address-uid-123",
    "paymentMethod": "COD"
  }'
```

Expected: 200 OK with order details
Currently: 404 Not Found

---

## Additional Notes

- The frontend already has complete order management UI:
  - ✅ Orders list with pagination and filtering
  - ✅ Order details modal
  - ✅ Cancel order functionality
  - ✅ Order status tracking

- All order-related GET endpoints work fine:
  - ✅ `GET /customer/orders` - List orders
  - ✅ `GET /customer/orders/:orderUid` - Order details
  - ✅ `POST /customer/orders/:orderUid/cancel` - Cancel order

- Only the order **creation** endpoint is missing

---

**Last Updated**: December 2, 2025
**Frontend Developer**: Claude Code
**Backend Team**: Please implement `POST /customer/orders` endpoint
