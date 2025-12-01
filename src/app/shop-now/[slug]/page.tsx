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

        <div className="mt-6 grid gap-8 lg:grid-cols-[480px_1fr]">
          <ProductGallery images={product.images} />

          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">
                {product.category.name}
              </p>
              <h1 className="text-4xl font-bold text-[var(--color-primary-dark)]">{product.title}</h1>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < Math.floor(product.averageRating || 0)
                          ? 'text-[var(--color-accent-yellow)]'
                          : 'text-zinc-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-zinc-600">
                  {product.averageRating?.toFixed(1) || '0.0'} ({product.reviewCount.toLocaleString()} Reviews)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 border-y border-zinc-200 py-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[var(--color-primary)]">
                  {formatPrice(product.minPriceCents)}
                </span>
                {product.maxPriceCents && product.maxPriceCents > product.minPriceCents && (
                  <>
                    <span className="text-xl font-medium text-zinc-400 line-through">
                      {formatPrice(product.maxPriceCents)}
                    </span>
                    <span className="rounded-full bg-[var(--color-accent-orange-bg)] px-3 py-1 text-sm font-semibold text-[var(--color-accent-orange)]">
                      {Math.round(((product.maxPriceCents - product.minPriceCents) / product.maxPriceCents) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {product.description && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary-lighter)]">
                  Product Description
                </h3>
                <p className="text-base leading-relaxed text-zinc-600">
                  {product.description}
                </p>
              </div>
            )}

            <div className="flex items-center gap-6 rounded-xl bg-zinc-50 p-4">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span className="text-sm font-medium text-zinc-700">
                  {totalStock > 0 ? `${totalStock} in stock` : 'Out of stock'}
                </span>
              </div>
              <div className="h-6 w-px bg-zinc-300" />
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm font-medium text-zinc-700">{product.totalSkus} variant(s)</span>
              </div>
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
      <div className="flex h-[500px] w-full items-center justify-center rounded-3xl border border-zinc-200 bg-zinc-50">
        <PlaceholderThumb large />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex h-[500px] w-full items-center justify-center overflow-hidden rounded-3xl border border-zinc-200 bg-white p-8">
        <img
          src={displayImages[selectedImage]?.url}
          alt={displayImages[selectedImage]?.altText || 'Product'}
          className="h-full w-full object-contain"
        />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {displayImages.slice(0, 4).map((image, index) => (
          <button
            key={image.uid}
            onClick={() => setSelectedImage(index)}
            className={`flex h-24 w-full items-center justify-center overflow-hidden rounded-2xl border-2 bg-white p-2 transition ${
              index === selectedImage
                ? 'border-[var(--color-primary)]'
                : 'border-zinc-200 hover:border-zinc-300'
            }`}
          >
            <img
              src={image.url}
              alt={image.altText || 'Product'}
              className="h-full w-full object-contain"
            />
          </button>
        ))}
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
    <section className="mt-16">
      <h2 className="text-center text-3xl font-bold text-[var(--color-primary-dark)]">Related Products</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {related.map((item) => (
          <Link
            key={item.uid}
            href={`/shop-now/${item.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:shadow-lg"
          >
            <div className="relative flex h-48 items-center justify-center overflow-hidden bg-zinc-50 p-4">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-contain transition group-hover:scale-105"
                />
              ) : (
                <PlaceholderThumb />
              )}
            </div>
            <div className="flex flex-col gap-2 p-4">
              <h3 className="line-clamp-2 text-base font-semibold text-zinc-800 group-hover:text-[var(--color-primary)]">
                {item.title}
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-[var(--color-primary)]">
                  {formatPrice(item.minPriceCents)}
                </span>
                {item.maxPriceCents && item.maxPriceCents > item.minPriceCents && (
                  <span className="text-sm text-zinc-400 line-through">
                    {formatPrice(item.maxPriceCents)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-10 flex justify-center">
        <Link
          href="/shop-now"
          className="rounded-full border-2 border-[var(--color-primary)] px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-white"
        >
          View All Products
        </Link>
      </div>
    </section>
  );
}
