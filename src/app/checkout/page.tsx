'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/footer";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { formatCartPrice } from "@/lib/cart";

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { cart, loading } = useCart();

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
              Please login to proceed with checkout.
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

  const handlePay = () => {
    alert("Payment successful! Thank you for your purchase.");
    // Note: In a real implementation, this would create an order via API
    // and the cart would be cleared by the backend
  };

  return (
    <main className="bg-white text-zinc-900">
      <section className="mx-auto max-w-[1300px] px-6 py-10">
        <nav className="text-sm text-zinc-500">
          <Link href="/" className="text-[var(--color-primary)] hover:underline">
            Home
          </Link>{" "}
          <span className="mx-2 text-zinc-400">/</span>
          <Link href="/cart" className="text-[var(--color-primary)] hover:underline">
            Cart
          </Link>{" "}
          <span className="mx-2 text-zinc-400">/</span>
          <span className="font-medium text-zinc-700">Checkout</span>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-[var(--color-border-primary)] bg-white p-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-[var(--color-text-dark)]">
                  Checkout
                </h1>
                <button className="text-sm font-semibold text-[var(--color-primary)]">
                  Change Address
                </button>
              </div>
              <div className="mt-4 text-sm text-zinc-600">
                <p className="font-semibold text-[var(--color-text-dark)]">
                  Jessica Laura | +12 345 678 910 | Home
                </p>
                <p>South Merdeka Street, Kedudalem, Klojen District, Malang City, East Java 65119</p>
              </div>
            </div>

            <div className="rounded-3xl border border-[var(--color-border-primary)] bg-white p-6">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-[var(--color-text-dark)]">Product Ordered</p>
                <Link href="/cart" className="text-sm font-semibold text-[var(--color-primary)]">
                  Edit
                </Link>
              </div>

              <div className="mt-4 space-y-4">
                {loading && (
                  <p className="text-zinc-500">Loading cart...</p>
                )}
                {!loading && (!cart?.items || cart.items.length === 0) && (
                  <p className="text-zinc-500">
                    Your cart is empty.{" "}
                    <Link href="/shop-now" className="text-[var(--color-primary)] underline">
                      Shop now
                    </Link>
                    .
                  </p>
                )}
                {!loading && cart?.items.map((item) => (
                  <article
                    key={item.itemUid}
                    className="flex items-start gap-4 rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-card)] p-4"
                  >
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-[var(--color-bg-image)]">
                      {item.product.thumbnail ? (
                        <img src={item.product.thumbnail} alt={item.product.name} className="h-full w-full object-cover" />
                      ) : (
                        <PlaceholderThumb />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-semibold text-[var(--color-text-dark)]">
                        {item.product.name}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">SKU: {item.sku.code}</p>
                      <p className="mt-2 text-sm text-zinc-500">
                        {item.quantity} item{item.quantity > 1 ? "s" : ""} ×{" "}
                        <span className="font-semibold text-[var(--color-primary)]">
                          {formatCartPrice(item.unitPriceCents)}
                        </span>
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-[var(--color-primary)]">
                      {formatCartPrice(item.totalPriceCents)}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-[var(--color-border-primary)] bg-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[var(--color-text-dark)]">Summary</h2>
                <Link href="/cart" className="text-sm font-semibold text-[var(--color-primary)]">
                  Back
                </Link>
              </div>
              <dl className="mt-4 space-y-3 text-sm text-zinc-500">
                <SummaryRow label="Subtotal" value={formatCartPrice(subtotalCents)} />
                <SummaryRow label="Delivery Fee" value={shippingCents === 0 ? "Free" : formatCartPrice(shippingCents)} />
                <SummaryRow label="Voucher Discount" value={discountCents > 0 ? `- ${formatCartPrice(discountCents)}` : "- ₹0.00"} />
                <SummaryRow label="Estimated Taxes" value={formatCartPrice(taxCents)} />
              </dl>
              {cart?.discounts && cart.discounts.length > 0 && (
                <div className="mt-4 rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] px-4 py-3 text-sm text-[var(--color-text-dark)]">
                  <p className="font-semibold">Voucher Applied!</p>
                  <p>Code: {cart.discounts[0].code}</p>
                  <p className="text-xs text-zinc-500">
                    Discount: {formatCartPrice(cart.discounts[0].valueCents)}
                  </p>
                </div>
              )}
              <div className="mt-5 flex items-center justify-between text-lg font-semibold text-[var(--color-text-dark)]">
                <span>Total</span>
                <span>{formatCartPrice(totalCents)}</span>
              </div>
              <button
                onClick={handlePay}
                className="mt-5 w-full rounded-xl bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-[0_15px_35px_rgba(103,39,27,0.35)] transition hover:bg-[var(--color-primary-darker)]"
              >
                Pay Now ({formatCartPrice(totalCents)})
              </button>
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

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <span className="font-semibold text-[var(--color-text-dark)]">{value}</span>
    </div>
  );
}
