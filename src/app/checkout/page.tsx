'use client';

import Link from "next/link";
import { Footer } from "@/components/footer";
import { useCartStore } from "@/store/cart-store";

const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

const taxesRate = 0.12;

export default function CheckoutPage() {
  const products = useCartStore((state) => state.products);
  const subtotal = useCartStore((state) => state.subtotal);
  const clearCart = useCartStore((state) => state.clearCart);

  const taxes = subtotal * taxesRate;
  const deliveryFee = subtotal > 0 ? 0 : 0;
  const voucherDiscount = 0;
  const total = subtotal + taxes + deliveryFee - voucherDiscount;

  const handlePay = () => {
    alert("Payment successful! Thank you for your purchase.");
    clearCart();
  };

  return (
    <main className="bg-white text-zinc-900">
      <section className="mx-auto max-w-[1300px] px-6 py-10">
        <nav className="text-sm text-zinc-500">
          <Link href="/" className="text-[#4D9C2C] hover:underline">
            Home
          </Link>{" "}
          <span className="mx-2 text-zinc-400">/</span>
          <Link href="/cart" className="text-[#4D9C2C] hover:underline">
            Cart
          </Link>{" "}
          <span className="mx-2 text-zinc-400">/</span>
          <span className="font-medium text-zinc-700">Checkout</span>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-[#E6EEDF] bg-white p-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-[#355B20]">
                  Checkout
                </h1>
                <button className="text-sm font-semibold text-[#4D9C2C]">
                  Change Address
                </button>
              </div>
              <div className="mt-4 text-sm text-zinc-600">
                <p className="font-semibold text-[#355B20]">
                  Jessica Laura | +12 345 678 910 | Home
                </p>
                <p>South Merdeka Street, Kedudalem, Klojen District, Malang City, East Java 65119</p>
              </div>
            </div>

            <div className="rounded-3xl border border-[#E6EEDF] bg-white p-6">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-[#355B20]">Product Ordered</p>
                <Link href="/cart" className="text-sm font-semibold text-[#4D9C2C]">
                  Edit
                </Link>
              </div>

              <div className="mt-4 space-y-4">
                {products.length === 0 && (
                  <p className="text-zinc-500">
                    Your cart is empty.{" "}
                    <Link href="/shop-now" className="text-[#4D9C2C] underline">
                      Shop now
                    </Link>
                    .
                  </p>
                )}
                {products.map(({ product, quantity }) => (
                  <article
                    key={product.slug}
                    className="flex items-start gap-4 rounded-2xl border border-[#E6EEDF] bg-[#FDFEFE] p-4"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F4F6F1]">
                      <PlaceholderThumb />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-[0.2em] text-[#4D9C2C]/80">
                        {product.category}
                      </p>
                      <p className="text-base font-semibold text-[#355B20]">
                        {product.name}
                      </p>
                      <p className="mt-2 text-sm text-zinc-500">
                        {quantity} item{quantity > 1 ? "s" : ""} ×{" "}
                        <span className="font-semibold text-[#4D9C2C]">
                          {formatINR(product.price)}
                        </span>
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-[#4D9C2C]">
                      {formatINR(product.price * quantity)}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-[#E6EEDF] bg-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#355B20]">Summary</h2>
                <Link href="/cart" className="text-sm font-semibold text-[#4D9C2C]">
                  Back
                </Link>
              </div>
              <dl className="mt-4 space-y-3 text-sm text-zinc-500">
                <SummaryRow label="Subtotal" value={formatINR(subtotal)} />
                <SummaryRow label="Delivery Fee" value={deliveryFee === 0 ? "Free" : formatINR(deliveryFee)} />
                <SummaryRow label="Voucher Discount" value={formatINR(-voucherDiscount)} />
                <SummaryRow label="Estimated Taxes" value={formatINR(taxes)} />
              </dl>
              <div className="mt-4 rounded-2xl border border-[#BEEAB3] bg-[#F4FBF0] px-4 py-3 text-sm text-[#355B20]">
                <p className="font-semibold">Voucher Applied!</p>
                <p>Free shipping promo voucher successfully used.</p>
                <p className="text-xs text-zinc-500">
                  Use promo voucher before January 20, 2025
                </p>
              </div>
              <div className="mt-5 flex items-center justify-between text-lg font-semibold text-[#355B20]">
                <span>Total</span>
                <span>{formatINR(total)}</span>
              </div>
              <button
                onClick={handlePay}
                className="mt-5 w-full rounded-xl bg-[#4D9C2C] px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-[0_15px_35px_rgba(77,156,44,0.35)] transition hover:bg-[#356F1D]"
              >
                Pay Now ({formatINR(total)})
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
      <span className="font-semibold text-[#355B20]">{value}</span>
    </div>
  );
}
