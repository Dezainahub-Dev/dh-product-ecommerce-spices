'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/footer";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { formatCartPrice } from "@/lib/cart";
import { useToastStore } from "@/components/toast-notification";

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { cart, loading, updateQuantity, removeItem, applyCoupon, removeCoupon } = useCart();
  const { addToast } = useToastStore();
  const [couponCode, setCouponCode] = useState("");
  const [couponProcessing, setCouponProcessing] = useState(false);

  // Redirect to login if not authenticated
  if (!isAuthenticated && !loading) {
    return (
      <main className="bg-white text-zinc-900">
        <section className="mx-auto max-w-[1300px] px-6 py-20 text-center">
          <div className="mx-auto max-w-md">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-bg-secondary)]">
                <svg
                  className="h-10 w-10 text-[var(--color-primary)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-[var(--color-text-dark)]">Login Required</h1>
            <p className="mt-4 text-lg text-zinc-600">
              Please login to view your cart and manage your items.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={() => router.push('/login')}
                className="w-full rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_15px_35px_rgba(103,39,27,0.25)] transition hover:bg-[var(--color-primary-darker)]"
              >
                Login Now
              </button>
              <button
                onClick={() => router.push('/shop-now')}
                className="w-full rounded-full border border-[var(--color-border-primary)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-text-dark)] transition hover:bg-[var(--color-bg-secondary)]"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const subtotalCents = cart?.summary.subtotalCents || 0;
  const discountCents = cart?.summary.discountCents || 0;
  const taxCents = cart?.summary.taxCents || 0;
  const shippingCents = cart?.summary.shippingCents || 0;
  const totalCents = cart?.summary.totalCents || 0;
  const totalItems = cart?.items.reduce((count, item) => count + item.quantity, 0) || 0;

  return (
    <main className="bg-white text-zinc-900">
      <section className="mx-auto max-w-[1300px] px-6 py-10">
        <nav className="text-sm text-zinc-500">
          <Link href="/" className="text-primary hover:underline">
            Home
          </Link>{" "}
          <span className="mx-2 text-zinc-400">/</span>
          <span className="font-medium text-zinc-700">Cart</span>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-3xl border border-[var(--color-border-primary)] bg-white p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-[var(--color-text-dark)]">
                Your Cart ({totalItems})
              </h1>
            </div>

            {loading && (
              <div className="mt-6 flex items-center justify-center py-20">
                <p className="text-zinc-500">Loading cart...</p>
              </div>
            )}

            {!loading && (!cart?.items || cart.items.length === 0) && (
              <div className="mt-6">
                <p className="text-zinc-500">
                  Your cart is empty.{" "}
                  <Link href="/shop-now" className="text-[var(--color-primary)] underline">
                    Start shopping
                  </Link>
                </p>
              </div>
            )}

            <div className="mt-6 space-y-4">
              {!loading && cart?.items.map((item) => (
                <article
                  key={item.itemUid}
                  className="flex flex-col gap-4 rounded-3xl border border-[var(--color-border-primary)] bg-[var(--color-bg-card)] p-4 shadow-sm sm:flex-row sm:items-center"
                >
                  <div className="flex items-start gap-4 sm:flex-1">
                    <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-[var(--color-bg-image)]">
                      {item.product.thumbnail ? (
                        <img src={item.product.thumbnail} alt={item.product.name} className="h-full w-full object-cover" />
                      ) : (
                        <PlaceholderThumb />
                      )}
                    </div>
                    <div className="flex-1">
                      <Link
                        href={`/shop-now/${item.product.slug}`}
                        className="mt-1 text-base font-semibold text-[var(--color-text-dark)] hover:text-[var(--color-primary)]"
                      >
                        {item.product.name}
                      </Link>
                      <p className="mt-1 text-xs font-medium text-zinc-500">
                        SKU: <span className="text-[var(--color-primary)]">{item.sku.code}</span>
                      </p>
                      {!item.isInStock && (
                        <p className="mt-1 text-xs font-semibold text-red-600">Out of Stock</p>
                      )}
                      <div className="mt-2 text-lg font-semibold text-[var(--color-primary)]">
                        {formatCartPrice(item.totalPriceCents)}
                        <span className="ml-2 text-xs font-medium text-zinc-500">
                          ({formatCartPrice(item.unitPriceCents)} each)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:w-auto">
                    <QuantityControl
                      quantity={item.quantity}
                      max={item.availableQty}
                      onChange={(qty) => updateQuantity(item.itemUid, qty)}
                    />
                    <button
                      type="button"
                      aria-label="Remove"
                      onClick={() => removeItem(item.itemUid)}
                      className="text-xl text-zinc-500 hover:text-[var(--color-primary)]"
                    >
                      🗑
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-[var(--color-border-primary)] bg-white p-6">
              <h2 className="text-lg font-semibold text-[var(--color-text-dark)]">Summary</h2>
              <dl className="mt-4 space-y-3 text-sm text-zinc-500">
                <SummaryRow label="Subtotal" value={formatCartPrice(subtotalCents)} />
                <SummaryRow label="Delivery Fee" value={shippingCents === 0 ? "Free" : formatCartPrice(shippingCents)} />
                <SummaryRow label="Voucher Discount" value={discountCents > 0 ? `- ${formatCartPrice(discountCents)}` : "- ₹0.00"} />
                <SummaryRow label="Estimated Taxes" value={formatCartPrice(taxCents)} />
              </dl>
              <div className="mt-5 flex items-center justify-between text-lg font-semibold text-[var(--color-text-dark)]">
                <span>Total</span>
                <span>{formatCartPrice(totalCents)}</span>
              </div>
              <Link
                href="/checkout"
                className="mt-5 flex w-full items-center justify-center rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-[0_15px_35px_rgba(103,39,27,0.35)] transition hover:bg-[var(--color-primary-darker)]"
              >
                Checkout ({formatCartPrice(totalCents)})
              </Link>
            </div>

            <div className="rounded-3xl border border-[var(--color-border-primary)] bg-white p-6 text-sm text-zinc-600">
                <h3 className="text-base font-semibold text-[var(--color-text-dark)]">
                  Voucher Discount
                </h3>
                <p className="mt-2">Have a promo code to use?</p>
                {cart?.discounts && cart.discounts.length > 0 ? (
                  <div className="mt-3">
                    {cart.discounts.map((discount) => (
                      <div key={discount.code} className="flex items-center justify-between rounded-2xl border border-[var(--color-primary)] bg-[var(--color-bg-primary)] px-4 py-2">
                        <span className="font-semibold text-[var(--color-primary)]">{discount.code}</span>
                        <button
                          onClick={async () => {
                            setCouponProcessing(true);
                            try {
                              await removeCoupon();
                            } catch (error) {
                              console.error('Failed to remove coupon:', error);
                            } finally {
                              setCouponProcessing(false);
                            }
                          }}
                          disabled={couponProcessing}
                          className="text-xs font-semibold text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3 flex gap-3">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 rounded-2xl border border-[var(--color-border-lighter)] px-4 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
                    />
                    <button
                      onClick={async () => {
                        if (!couponCode.trim()) return;
                        setCouponProcessing(true);
                        try {
                          const result = await applyCoupon(couponCode);
                          if (result.success) {
                            addToast('Coupon applied successfully!', 'success');
                            setCouponCode('');
                          } else {
                            addToast(result.message, 'error');
                          }
                        } catch (error: any) {
                          addToast(error.message || 'Failed to apply coupon', 'error');
                        } finally {
                          setCouponProcessing(false);
                        }
                      }}
                      disabled={couponProcessing || !couponCode.trim()}
                      className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-primary-darker)] disabled:opacity-50"
                    >
                      {couponProcessing ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                )}
              </div>
          </aside>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function PlaceholderThumb() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-10 w-10 text-zinc-400"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="8" y="12" width="32" height="24" rx="4" />
      <circle cx="18" cy="20" r="2" />
      <path d="m12 32 8-8 6 6 10-10 8 8" />
    </svg>
  );
}

function QuantityControl({
  quantity,
  max,
  onChange,
}: {
  quantity: number;
  max?: number;
  onChange: (qty: number) => void;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[var(--color-border-lighter)] px-4 py-2 text-base font-semibold text-[var(--color-text-dark)]">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, quantity - 1))}
        className="text-2xl leading-none text-[var(--color-primary)]"
      >
        -
      </button>
      <span>{quantity}</span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        disabled={max !== undefined && quantity >= max}
        className="text-2xl leading-none text-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        +
      </button>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <span className="font-semibold text-[var(--color-text-dark)]">{value}</span>
    </div>
  );
}
