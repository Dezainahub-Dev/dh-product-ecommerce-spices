import { apiClient } from './api-client';

// Order Types from API
export interface OrderItem {
  productUid: string;
  productTitle: string;
  skuCode?: string;
  quantity: number;
  unitPriceCents: number;
  totalPriceCents: number;
  thumbnail?: string;
}

export interface ShippingAddress {
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone?: string | null;
}

export interface OrderListItem {
  uid: string;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  totalCents: number;
  currency: string;
  placedAt: string;
  itemsCount: number;
  createdAt: string;
}

export interface OrderDetail extends OrderListItem {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotalCents?: number;
  taxCents?: number;
  shippingCents?: number;
  discountCents?: number;
}

export interface OrderListResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  orders: OrderListItem[];
}

export interface CancelOrderRequest {
  reason?: string;
}

export interface CancelOrderResponse {
  success: boolean;
  message: string;
}

export interface CreateOrderRequest {
  shippingAddressUid: string;
  paymentMethod?: string;
}

export interface CreateOrderResponse {
  orderUid: string;
  status: string;
  message: string;
}

// Review Types
export interface Review {
  uid: string;
  productUid: string;
  productTitle: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

// Return Request Types
export interface ReturnRequest {
  uid: string;
  orderUid: string;
  status: string;
  reason: string;
  requestedAt: string;
  createdAt: string;
}

export interface ReturnRequestsResponse {
  total: number;
  returnRequests: ReturnRequest[];
}

// Recently Viewed Types
export interface RecentlyViewedProduct {
  productUid: string;
  productTitle: string;
  viewedAt: string;
}

class OrderService {
  /**
   * Get paginated list of customer orders
   */
  async getOrders(params: {
    page?: number;
    limit?: number;
    status?: OrderListItem['status'];
  } = {}): Promise<OrderListResponse> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', String(params.page));
    if (params.limit) queryParams.append('limit', String(params.limit));
    if (params.status) queryParams.append('status', params.status);

    const query = queryParams.toString();
    return apiClient.get<OrderListResponse>(
      `/customer/orders${query ? `?${query}` : ''}`
    );
  }

  /**
   * Get detailed information about a specific order
   */
  async getOrderDetail(orderUid: string): Promise<OrderDetail> {
    return apiClient.get<OrderDetail>(`/customer/orders/${orderUid}`);
  }

  /**
   * Create a new order from the current cart
   */
  async createOrder(data: CreateOrderRequest): Promise<CreateOrderResponse> {
    return apiClient.post<CreateOrderResponse>(
      `/customer/orders`,
      data
    );
  }

  /**
   * Cancel an order
   */
  async cancelOrder(orderUid: string, data?: CancelOrderRequest): Promise<CancelOrderResponse> {
    return apiClient.post<CancelOrderResponse>(
      `/customer/orders/${orderUid}/cancel`,
      data
    );
  }

  /**
   * Get customer's reviews
   */
  async getMyReviews(): Promise<Review[]> {
    return apiClient.get<Review[]>('/customer/reviews/me');
  }

  /**
   * Get customer's return requests
   */
  async getReturnRequests(): Promise<ReturnRequestsResponse> {
    return apiClient.get<ReturnRequestsResponse>('/customer/return-requests');
  }

  /**
   * Get recently viewed products
   */
  async getRecentlyViewed(limit: number = 20): Promise<RecentlyViewedProduct[]> {
    return apiClient.get<RecentlyViewedProduct[]>(
      `/customer/recently-viewed?limit=${limit}`
    );
  }
}

export const orderService = new OrderService();

/**
 * Format order status for display
 */
export function formatOrderStatus(status: OrderListItem['status']): string {
  const statusMap: Record<OrderListItem['status'], string> = {
    pending: 'Pending',
    paid: 'Paid',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
  };
  return statusMap[status] || status;
}

/**
 * Get status color for UI
 */
export function getOrderStatusColor(status: OrderListItem['status']): string {
  const colorMap: Record<OrderListItem['status'], string> = {
    pending: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    paid: 'text-blue-600 bg-blue-50 border-blue-200',
    processing: 'text-purple-600 bg-purple-50 border-purple-200',
    shipped: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    delivered: 'text-green-600 bg-green-50 border-green-200',
    cancelled: 'text-red-600 bg-red-50 border-red-200',
    refunded: 'text-orange-600 bg-orange-50 border-orange-200',
  };
  return colorMap[status] || 'text-zinc-600 bg-zinc-50 border-zinc-200';
}

/**
 * Check if order can be cancelled
 */
export function canCancelOrder(status: OrderListItem['status']): boolean {
  return ['pending', 'paid', 'processing'].includes(status);
}

/**
 * Format price from cents
 */
export function formatOrderPrice(cents: number, currency: string = 'INR'): string {
  const symbol = currency === 'INR' ? '₹' : '$';
  return `${symbol}${(cents / 100).toFixed(2)}`;
}
