import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { getProductBySlug, products } from "@/data/products";
import type { Product } from "@/data/products";
import { AddToCartPanel } from "@/components/cart/add-to-cart-panel";
import { ProductInfoTabs } from "@/components/product/product-info-tabs";

type PageProps =
  | { params: { slug: string } }
  | { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

export default async function Page({ params }: PageProps) {
  const resolvedParams =
    params instanceof Promise ? await params : params;

  const product = getProductBySlug(resolvedParams.slug);
  if (!product) {
    notFound();
  }

  const relatedProducts = product.relatedSlugs
    .map((slug) => getProductBySlug(slug))
    .filter((item): item is Product => Boolean(item));

  return (
    <main className="bg-white text-zinc-900">
      <section className="mx-auto max-w-[1300px] px-6 py-8">
        <nav className="text-sm text-zinc-500">
          <Link href="/" className="text-primary hover:underline">
            Home
          </Link>{" "}
          <span className="mx-2 text-zinc-400">/</span>
          <Link href="/shop-now" className="text-primary hover:underline">
            Shop Now
          </Link>{" "}
          <span className="mx-2 text-zinc-400">/</span>
          <span className="font-medium text-zinc-700">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-10 rounded-3xl border border-border-primary bg-white p-6 lg:grid-cols-[420px_1fr]">
          <ProductGallery />

          <div className="space-y-5">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                {product.category}
              </p>
              <h1 className="text-3xl font-semibold text-primary-dark">{product.name}</h1>
              <div className="flex items-center gap-3 text-sm text-zinc-500">
                <span className="inline-flex items-center gap-1 text-base font-semibold text-accent-yellow">
                  ★ {product.rating.toFixed(1)}
                </span>
                <span>({product.reviews.toLocaleString()} Reviews)</span>
                <button className="font-semibold text-primary hover:underline">
                  See All Reviews
                </button>
              </div>
              <p className="text-base text-zinc-600">
                {product.description.slice(0, 220)}{" "}
                <button className="text-primary font-semibold">See more...</button>
              </p>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-border-primary bg-bg-primary p-4 text-lg font-semibold text-primary sm:flex-row sm:items-center sm:justify-between">
              <div>
                {formatINR(product.price)}
                {product.oldPrice && (
                  <span className="ml-3 text-base font-normal text-zinc-400 line-through">
                    {formatINR(product.oldPrice)}
                  </span>
                )}
              </div>
              {product.oldPrice && (
                <span className="rounded-full bg-accent-orange-bg px-4 py-1 text-sm font-semibold text-accent-orange">
                  {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                </span>
              )}
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-border-primary p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-zinc-500">{product.stock} Stock Available</p>
                <div className="mt-2 h-2 w-48 rounded-full bg-progress-bg">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.min(100, (product.stock / product.totalStock) * 100)}%` }}
                  />
                </div>
              </div>
              <p className="text-sm text-zinc-500">100 Item Limit</p>
            </div>

            <AddToCartPanel slug={product.slug} product={product} />

            <ProductInfoTabs product={product} />
          </div>
        </div>

        <RelateProducts related={relatedProducts} />
      </section>
      <Footer />
    </main>
  );
}

function ProductGallery() {
  return (
    <div className="grid gap-4 sm:grid-cols-[80px_1fr]">
      <div className="flex sm:flex-col gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((item) => (
          <button
            key={item}
            className={`flex h-16 w-16 items-center justify-center rounded-2xl border border-border-primary bg-bg-image ${
              item === 1 ? "ring-2 ring-primary" : ""
            }`}
          >
            <PlaceholderThumb />
          </button>
        ))}
      </div>
      <div className="flex h-[360px] w-full items-center justify-center rounded-3xl border border-border-primary bg-bg-image">
        <PlaceholderThumb large />
      </div>
    </div>
  );
}

function PlaceholderThumb({ large }: { large?: boolean }) {
  return (
    <div className={`flex flex-col items-center text-zinc-400 ${large ? "scale-125" : "scale-90"}`}>
      <svg
        viewBox="0 0 48 48"
        className="h-10 w-10"
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
    </div>
  );
}

function RelateProducts({ related }: { related: Product[] }) {
  return (
    <section className="mt-16 rounded-3xl border border-border-primary bg-white px-6 py-10">
      <h2 className="text-center text-3xl font-semibold text-primary-dark">Related Products</h2>
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {related.map((item) => {
          if (!item) return null;
          return (
            <article
              key={item.slug}
              className="flex flex-col rounded-3xl border border-border-secondary bg-bg-card p-4 shadow-[0_10px_32px_rgba(77,156,44,0.06)]"
            >
              <div className="relative flex h-40 items-center justify-center rounded-2xl bg-bg-image">
                <PlaceholderThumb />
              </div>
              <div className="mt-4 space-y-2 text-left">
                <p className="text-sm text-accent-yellow">
                  ★ {item.rating.toFixed(1)}{" "}
                  <span className="text-zinc-400">({item.reviews.toLocaleString()} Reviews)</span>
                </p>
                <h3 className="text-base font-semibold text-zinc-800">{item.name}</h3>
                <p className="text-lg font-semibold text-primary">
                  {formatINR(item.price)}
                  {item.oldPrice && (
                    <span className="ml-3 text-base font-normal text-zinc-400 line-through">
                      {formatINR(item.oldPrice)}
                    </span>
                  )}
                </p>
              </div>
            </article>
          );
        })}
      </div>
      <div className="mt-8 flex justify-center">
        <Link
          href="/shop-now"
          className="rounded-full border border-primary px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary"
        >
          See All Products
        </Link>
      </div>
    </section>
  );
}
