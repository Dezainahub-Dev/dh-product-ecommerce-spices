'use client';

import Link from "next/link";
import { Footer } from "@/components/footer";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { products as allProducts } from "@/data/products";

const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

const taxesRate = 0.12;

export default function CartPage() {
  const products = useCartStore((state) => state.products);
  const updateQuantity = useCartStore(
    (state) => state.updateQuantity
  );
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = useCartStore((state) => state.subtotal);
  const addWishlistItem = useWishlistStore(
    (state) => state.addItem
  );
  const wishlistItems = useWishlistStore((state) => state.items);

  const taxes = subtotal * taxesRate;
  const deliveryFee = subtotal > 0 ? 0 : 0;
  const total = subtotal + taxes + deliveryFee;
  const totalItems = products.reduce((count, item) => count + item.quantity, 0);

  const recommended = allProducts.slice(0, 4);

  return (
    <main className="bg-white text-zinc-900">
      <section className="mx-auto max-w-[1300px] px-6 py-10">
        <nav className="text-sm text-zinc-500">
          <Link href="/" className="text-[#4D9C2C] hover:underline">
            Home
          </Link>{" "}
          <span className="mx-2 text-zinc-400">/</span>
          <span className="font-medium text-zinc-700">Cart</span>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-3xl border border-[#E6EEDF] bg-white p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-[#355B20]">
                Your Cart ({totalItems})
              </h1>
              <button className="text-sm font-semibold text-[#4D9C2C]">
                Select All Products ({products.length})
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {products.length === 0 && (
                <p className="text-zinc-500">
                  Your cart is empty.{" "}
                  <Link href="/shop-now" className="text-[#4D9C2C] underline">
                    Start shopping
                  </Link>
                </p>
              )}
              {products.map(({ product, quantity, sku }) => {
                const wishlisted = wishlistItems.includes(
                  product.slug
                );
                const skuData = product.skus.find(s => s.size === sku);
                const price = skuData?.price || product.price;
                const oldPrice = skuData?.oldPrice || product.oldPrice;

                const handleMoveToWishlist = () => {
                  if (!wishlisted) {
                    addWishlistItem(product.slug);
                  }
                  removeItem(product.slug, sku);
                };
                return (
                  <article
                    key={`${product.slug}-${sku}`}
                    className="flex flex-col gap-4 rounded-3xl border border-[#E6EEDF] bg-[#FDFEFE] p-4 shadow-sm sm:flex-row sm:items-center"
                  >
                  <div className="flex items-start gap-4 sm:flex-1">
                    <input
                      type="checkbox"
                      checked
                      readOnly
                      className="mt-2 h-5 w-5 rounded border border-[#4D9C2C] accent-[#4D9C2C]"
                    />
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#F4F6F1]">
                      <PlaceholderThumb />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-[0.2em] text-[#4D9C2C]/80">
                        {product.category}
                      </p>
                      <Link
                        href={`/shop-now/${product.slug}`}
                        className="mt-1 text-base font-semibold text-[#355B20]"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-1 text-xs font-medium text-zinc-500">
                        Size: <span className="text-[#4D9C2C]">{sku}</span>
                      </p>
                      <div className="mt-2 text-lg font-semibold text-[#4D9C2C]">
                        {formatINR(price * quantity)}
                        {oldPrice && (
                          <span className="ml-3 text-sm font-normal text-zinc-400 line-through">
                            {formatINR(oldPrice * quantity)}
                          </span>
                        )}
                        <span className="ml-2 text-xs font-medium text-zinc-500">
                          ({formatINR(price)} each)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:w-auto">
                    <QuantityControl
                      quantity={quantity}
                      onChange={(qty) => updateQuantity(product.slug, sku, qty)}
                    />
                    <div className="flex items-center gap-3 text-zinc-400">
                      <button
                        type="button"
                        aria-label={
                          wishlisted
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                        onClick={handleMoveToWishlist}
                        className={`text-lg transition ${
                          wishlisted
                            ? "text-[#E24B4A]"
                            : "text-zinc-400 hover:text-[#4D9C2C]"
                        }`}
                      >
                        {wishlisted ? "♥" : "♡"}
                      </button>
                      <button
                        type="button"
                        aria-label="Remove"
                        onClick={() => removeItem(product.slug, sku)}
                        className="text-xl text-zinc-500"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                  </article>
                );
              })}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-[#E6EEDF] bg-white p-6">
              <h2 className="text-lg font-semibold text-[#355B20]">Summary</h2>
              <dl className="mt-4 space-y-3 text-sm text-zinc-500">
                <SummaryRow label="Subtotal" value={formatINR(subtotal)} />
                <SummaryRow label="Delivery Fee" value={deliveryFee === 0 ? "Free" : formatINR(deliveryFee)} />
                <SummaryRow label="Voucher Discount" value="- ₹0.00" />
                <SummaryRow label="Estimated Taxes" value={formatINR(taxes)} />
              </dl>
              <div className="mt-5 flex items-center justify-between text-lg font-semibold text-[#355B20]">
                <span>Total</span>
                <span>{formatINR(total)}</span>
              </div>
              <Link
                href="/checkout"
                className="mt-5 flex w-full items-center justify-center rounded-full bg-[#4D9C2C] px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-[0_15px_35px_rgba(77,156,44,0.35)] transition hover:bg-[#356F1D]"
              >
                Checkout ({formatINR(total)})
              </Link>
            </div>

            <div className="rounded-3xl border border-[#E6EEDF] bg-white p-6 text-sm text-zinc-600">
              <h3 className="text-base font-semibold text-[#355B20]">
                Voucher Discount
              </h3>
              <p className="mt-2">Have a promo code to use?</p>
              <div className="mt-3 flex gap-3">
                <input
                  type="text"
                  defaultValue="AVANORA10"
                  className="flex-1 rounded-2xl border border-[#DDE8CC] px-4 py-2 text-sm outline-none"
                />
                <button className="rounded-xl bg-[#4D9C2C] px-4 py-2 text-sm font-semibold text-white">
                  Apply
                </button>
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-16 rounded-3xl border border-[#E6EEDF] bg-white px-6 py-10">
          <h2 className="text-center text-3xl font-semibold text-[#355B20]">
            Recommended for you
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {recommended.map((item) => (
              <article
                key={item.slug}
                className="flex flex-col rounded-3xl border border-[#E5EED5] bg-[#FDFEFE] p-4"
              >
                <div className="relative flex h-40 items-center justify-center rounded-2xl bg-[#F4F6F1]">
                  <PlaceholderThumb />
                </div>
                <div className="mt-4 space-y-2 text-left">
                  <p className="text-sm text-[#F5A524]">
                    ★ {item.rating.toFixed(1)}{" "}
                    <span className="text-zinc-400">
                      ({item.reviews.toLocaleString()} Reviews)
                    </span>
                  </p>
                  <Link
                    href={`/shop-now/${item.slug}`}
                    className="text-base font-semibold text-zinc-800"
                  >
                    {item.name}
                  </Link>
                  <p className="text-lg font-semibold text-[#4D9C2C]">
                    {formatINR(item.price)}
                    {item.oldPrice && (
                      <span className="ml-3 text-base font-normal text-zinc-400 line-through">
                        {formatINR(item.oldPrice)}
                      </span>
                    )}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Link
              href="/shop-now"
              className="rounded-full border border-[#4D9C2C] px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#4D9C2C]"
            >
              See All Products
            </Link>
          </div>
        </section>
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
  onChange,
}: {
  quantity: number;
  onChange: (qty: number) => void;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[#DDE8CC] px-4 py-2 text-base font-semibold text-[#355B20]">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, quantity - 1))}
        className="text-2xl leading-none text-[#4D9C2C]"
      >
        -
      </button>
      <span>{quantity}</span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        className="text-2xl leading-none text-[#4D9C2C]"
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
      <span className="font-semibold text-[#355B20]">{value}</span>
    </div>
  );
}
