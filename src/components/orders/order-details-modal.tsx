'use client';

import { useState, useEffect } from 'react';
import { orderService, type OrderDetail, formatOrderPrice, formatOrderStatus, getOrderStatusColor, canCancelOrder } from '@/lib/orders';
import { useToastStore } from '@/components/toast-notification';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderUid: string | null;
  onOrderCancelled?: () => void;
}

export function OrderDetailsModal({ isOpen, onClose, orderUid, onOrderCancelled }: OrderDetailsModalProps) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { addToast } = useToastStore();

  useEffect(() => {
    if (isOpen && orderUid) {
      fetchOrderDetails();
    }
  }, [isOpen, orderUid]);

  const fetchOrderDetails = async () => {
    if (!orderUid) return;

    try {
      setLoading(true);
      const data = await orderService.getOrderDetail(orderUid);
      setOrder(data);
    } catch (error: any) {
      console.error('Error fetching order details:', error);
      addToast(error.message || 'Failed to load order details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = () => {
    setShowCancelModal(true);
  };

  const confirmCancelOrder = async (reason?: string) => {
    if (!orderUid) return;

    try {
      setLoading(true);
      await orderService.cancelOrder(orderUid, { reason });
      addToast('Order cancelled successfully', 'success');
      setShowCancelModal(false);
      onOrderCancelled?.();
      fetchOrderDetails(); // Refresh order details
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      addToast(error.message || 'Failed to cancel order', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-[var(--color-primary-dark)]">
                Order Details
              </h2>
              {order && (
                <p className="mt-1 text-sm text-zinc-500">Order ID: {order.uid}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[var(--color-bg-secondary)]"
            >
              <svg
                className="h-5 w-5 text-zinc-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {loading && !order && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="mt-4 text-sm text-zinc-500">Loading order details...</p>
              </div>
            </div>
          )}

          {!loading && !order && (
            <div className="py-12 text-center">
              <p className="text-zinc-600">Order not found</p>
            </div>
          )}

          {order && (
            <div className="mt-6 space-y-6">
              {/* Order Status and Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] p-4">
                <div>
                  <p className="text-sm font-medium text-zinc-600">Status</p>
                  <span className={`mt-1 inline-block rounded-full border px-3 py-1 text-sm font-semibold ${getOrderStatusColor(order.status)}`}>
                    {formatOrderStatus(order.status)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-600">Placed On</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--color-primary-dark)]">
                    {new Date(order.placedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-600">Total Amount</p>
                  <p className="mt-1 text-lg font-bold text-[var(--color-primary)]">
                    {formatOrderPrice(order.totalCents, order.currency)}
                  </p>
                </div>
                {canCancelOrder(order.status) && (
                  <button
                    onClick={handleCancelOrder}
                    disabled={loading}
                    className="rounded-full border border-red-200 bg-red-50 px-6 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel Order
                  </button>
                )}
              </div>

              {/* Shipping Address */}
              <div className="rounded-2xl border border-[var(--color-border-primary)] bg-white p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary-lighter)]">
                  Shipping Address
                </h3>
                <div className="mt-3 text-sm text-zinc-600">
                  <p className="font-medium text-[var(--color-primary-dark)]">{order.shippingAddress.line1}</p>
                  {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && <p className="mt-2">Phone: {order.shippingAddress.phone}</p>}
                </div>
              </div>

              {/* Order Items */}
              <div className="rounded-2xl border border-[var(--color-border-primary)] bg-white p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary-lighter)]">
                  Order Items ({order.items.length})
                </h3>
                <div className="mt-4 space-y-3">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-card)] p-3"
                    >
                      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-[var(--color-bg-image)]">
                        {item.thumbnail ? (
                          <img src={item.thumbnail} alt={item.productTitle} className="h-full w-full object-cover" />
                        ) : (
                          <svg className="h-8 w-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <path d="m21 15-5-5L5 21" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[var(--color-primary-dark)]">
                          {item.productTitle}
                        </p>
                        {item.skuCode && (
                          <p className="mt-1 text-xs text-zinc-500">SKU: {item.skuCode}</p>
                        )}
                        <p className="mt-2 text-xs text-zinc-500">
                          Qty: {item.quantity} × {formatOrderPrice(item.unitPriceCents, order.currency)}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-[var(--color-primary)]">
                        {formatOrderPrice(item.totalPriceCents, order.currency)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="rounded-2xl border border-[var(--color-border-primary)] bg-white p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary-lighter)]">
                  Order Summary
                </h3>
                <div className="mt-4 space-y-2 text-sm">
                  {order.subtotalCents !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-600">Subtotal</span>
                      <span className="font-semibold text-[var(--color-primary-dark)]">
                        {formatOrderPrice(order.subtotalCents, order.currency)}
                      </span>
                    </div>
                  )}
                  {order.shippingCents !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-600">Shipping</span>
                      <span className="font-semibold text-[var(--color-primary-dark)]">
                        {order.shippingCents === 0 ? 'Free' : formatOrderPrice(order.shippingCents, order.currency)}
                      </span>
                    </div>
                  )}
                  {order.taxCents !== undefined && order.taxCents > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-600">Tax</span>
                      <span className="font-semibold text-[var(--color-primary-dark)]">
                        {formatOrderPrice(order.taxCents, order.currency)}
                      </span>
                    </div>
                  )}
                  {order.discountCents !== undefined && order.discountCents > 0 && (
                    <div className="flex items-center justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-semibold">
                        - {formatOrderPrice(order.discountCents, order.currency)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between border-t border-[var(--color-border-light)] pt-2 text-base">
                    <span className="font-semibold text-[var(--color-primary-dark)]">Total</span>
                    <span className="text-lg font-bold text-[var(--color-primary)]">
                      {formatOrderPrice(order.totalCents, order.currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Order Confirmation Modal */}
      {showCancelModal && (
        <CancelOrderModal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          onConfirm={confirmCancelOrder}
          loading={loading}
        />
      )}
    </>
  );
}

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  loading: boolean;
}

function CancelOrderModal({ isOpen, onClose, onConfirm, loading }: CancelOrderModalProps) {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <h3 className="text-xl font-semibold text-[var(--color-primary-dark)]">
          Cancel Order
        </h3>
        <p className="mt-2 text-sm text-zinc-600">
          Are you sure you want to cancel this order? This action cannot be undone.
        </p>

        <div className="mt-4">
          <label className="block text-sm font-medium text-zinc-700">
            Reason for cancellation (optional)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-[var(--color-border-primary)] px-4 py-3 text-sm text-[var(--color-primary-dark)] outline-none focus:border-[var(--color-primary)]"
            rows={3}
            placeholder="Enter reason..."
          />
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-full border border-[var(--color-border-light)] px-6 py-2.5 text-sm font-semibold text-[var(--color-primary-dark)] transition hover:bg-[var(--color-bg-secondary)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Keep Order
          </button>
          <button
            onClick={() => onConfirm(reason || undefined)}
            disabled={loading}
            className="flex-1 rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Cancelling...' : 'Cancel Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
