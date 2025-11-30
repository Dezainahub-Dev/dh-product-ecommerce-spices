'use client';

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/footer";
import { AddToCartPanel } from "@/components/cart/add-to-cart-panel";
import { ProductInfoTabs } from "@/components/product/product-info-tabs";
import { productService, formatPrice } from "@/lib/products";
import type { ProductDetail, ProductListItem } from "@/lib/products";

type PageProps =
  | { params: { slug: string } }
  | { params: Promise<{ slug: string }> };

export default function Page({ params }: PageProps) {
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const router = useRouter();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, find the product by slug to get the UID
        const foundProduct = await productService.findProductBySlug(resolvedParams.slug);

        if (!foundProduct) {
          setError('Product not found');
          setLoading(false);
          return;
        }

        // Fetch full product details using UID
        const [productDetail, related] = await Promise.all([
          productService.getProductDetail(foundProduct.uid),
          productService.getRelatedProducts(foundProduct.uid),
        ]);

        setProduct(productDetail);
        setRelatedProducts(related);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <main className="bg-background text-foreground min-h-screen flex items-center justify-center">
        <p className="text-zinc-500">Loading product...</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="bg-background text-foreground min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Product not found'}</p>
          <Link href="/shop-now" className="text-[--color-primary] hover:underline">
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  const totalStock = product.skus.reduce((sum, sku) => sum + sku.availableQuantity, 0);
  const inStockSkus = product.skus.filter(sku => sku.inStock);

  return (
    <main className="bg-background text-foreground">
      <section className="mx-auto max-w-[1300px] px-6 py-8">
        <nav className="text-sm text-zinc-500">
          <Link href="/" className="text-[--color-primary] hover:underline">
            Home
          </Link>{" "}
          <span className="mx-2 text-zinc-400">/</span>
          <Link href="/shop-now" className="text-[--color-primary] hover:underline">
            Shop Now
          </Link>{" "}
          <span className="mx-2 text-zinc-400">/</span>
          <span className="font-medium text-zinc-700">{product.title}</span>
        </nav>

        <div className="mt-6 grid gap-10 rounded-3xl border border-[--color-border-primary] bg-background p-6 lg:grid-cols-[420px_1fr]">
          <ProductGallery images={product.images} />

          <div className="space-y-5">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[--color-primary]">
                {product.category.name}
              </p>
              <h1 className="text-3xl font-semibold text-[--color-primary-dark]">{product.title}</h1>
              <div className="flex items-center gap-3 text-sm text-zinc-500">
                <span className="inline-flex items-center gap-1 text-base font-semibold text-[--color-accent-yellow]">
                  ★ {product.averageRating?.toFixed(1) || 'N/A'}
                </span>
                <span>({product.reviewCount.toLocaleString()} Reviews)</span>
                <button className="font-semibold text-[--color-primary] hover:underline">
                  See All Reviews
                </button>
              </div>
              {product.description && (
                <p className="text-base text-zinc-600">
                  {product.description.length > 220
                    ? `${product.description.slice(0, 220)}...`
                    : product.description}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-[--color-border-primary] bg-[--color-bg-primary] p-4 text-lg font-semibold text-[--color-primary] sm:flex-row sm:items-center sm:justify-between">
              <div>
                {formatPrice(product.minPriceCents)}
                {product.maxPriceCents && product.maxPriceCents > product.minPriceCents && (
                  <span className="ml-3 text-base font-normal text-zinc-400 line-through">
                    {formatPrice(product.maxPriceCents)}
                  </span>
                )}
              </div>
              {product.maxPriceCents && product.maxPriceCents > product.minPriceCents && (
                <span className="rounded-full bg-[--color-accent-orange-bg] px-4 py-1 text-sm font-semibold text-[--color-accent-orange]">
                  {Math.round(((product.maxPriceCents - product.minPriceCents) / product.maxPriceCents) * 100)}% OFF
                </span>
              )}
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-[--color-border-primary] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-zinc-500">{totalStock} Stock Available</p>
                <div className="mt-2 h-2 w-48 rounded-full bg-[--color-progress-bg]">
                  <div
                    className="h-full rounded-full bg-[--color-primary]"
                    style={{ width: `${Math.min(100, totalStock > 0 ? 60 : 0)}%` }}
                  />
                </div>
              </div>
              <p className="text-sm text-zinc-500">SKUs: {product.totalSkus}</p>
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

function ProductGallery({ images }: { images: { uid: string; url: string; altText?: string | null; position: number; isPrimary: boolean }[] }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const sortedImages = [...images].sort((a, b) => a.position - b.position);
  const displayImages = sortedImages.length > 0 ? sortedImages : [];

  if (displayImages.length === 0) {
    return (
      <div className="flex h-[360px] w-full items-center justify-center rounded-3xl border border-[--color-border-primary] bg-[--color-bg-image]">
        <PlaceholderThumb large />
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-[80px_1fr]">
      <div className="flex sm:flex-col gap-3 sm:gap-4">
        {displayImages.slice(0, 4).map((image, index) => (
          <button
            key={image.uid}
            onClick={() => setSelectedImage(index)}
            className={`flex h-16 w-16 items-center justify-center rounded-2xl border border-[--color-border-primary] bg-[--color-bg-image] overflow-hidden ${
              index === selectedImage ? "ring-2 ring-[--color-primary]" : ""
            }`}
          >
            <img src={image.url} alt={image.altText || 'Product'} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
      <div className="flex h-[360px] w-full items-center justify-center rounded-3xl border border-[--color-border-primary] bg-[--color-bg-image] overflow-hidden">
        <img
          src={displayImages[selectedImage]?.url}
          alt={displayImages[selectedImage]?.altText || 'Product'}
          className="h-full w-full object-contain"
        />
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

function RelateProducts({ related }: { related: ProductListItem[] }) {
  if (related.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 rounded-3xl border border-[--color-border-primary] bg-background px-6 py-10">
      <h2 className="text-center text-3xl font-semibold text-[--color-primary-dark]">Related Products</h2>
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {related.map((item) => (
          <Link
            key={item.uid}
            href={`/shop-now/${item.slug}`}
            className="flex flex-col rounded-3xl border border-[--color-border-secondary] bg-[--color-bg-card] p-4 shadow-[0_10px_32px_rgba(77,156,44,0.06)] hover:-translate-y-1 transition"
          >
            <div className="relative flex h-40 items-center justify-center rounded-2xl bg-[--color-bg-image] overflow-hidden">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
              ) : (
                <PlaceholderThumb />
              )}
            </div>
            <div className="mt-4 space-y-2 text-left">
              <h3 className="text-base font-semibold text-zinc-800 line-clamp-2">{item.title}</h3>
              <p className="text-lg font-semibold text-[--color-primary]">
                {formatPrice(item.minPriceCents)}
                {item.maxPriceCents && item.maxPriceCents > item.minPriceCents && (
                  <span className="ml-3 text-base font-normal text-zinc-400 line-through">
                    {formatPrice(item.maxPriceCents)}
                  </span>
                )}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Link
          href="/shop-now"
          className="rounded-full border border-[--color-primary] px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-[--color-primary] hover:bg-[--color-primary] hover:text-white transition"
        >
          See All Products
        </Link>
      </div>
    </section>
  );
}
