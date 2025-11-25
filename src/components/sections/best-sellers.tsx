import Image from "next/image";

const products = [
  {
    name: "Skincare Your Anti Aging Package (Retinol Ampoule 30ml)",
    price: 399,
    oldPrice: 449,
    image:
      "https://images.unsplash.com/photo-1542838686-73e5377144cc?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Avanora Your Skin Bae Marine Collagen Serum 30ml",
    price: 349,
    oldPrice: 389,
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Sunscreen Avanora Your Skin Bae Shield of Sun SPF 50",
    price: 359,
    oldPrice: 399,
    image:
      "https://images.unsplash.com/photo-1501426026826-31c667bdf23d?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Avanora Your Skin Bae Lactic Acid Serum 30ml",
    price: 299,
    oldPrice: 359,
    image:
      "https://images.unsplash.com/photo-1600180758890-6bedff6b1d83?auto=format&fit=crop&w=800&q=80",
  },
];

export function BestSellersSection() {
  return (
    <section className="bg-white py-20 text-zinc-900">
      <div className="mx-auto max-w-[1368px] px-6 text-center">
        
        <h2 className="mt-4 text-4xl font-semibold text-[#355B20]">
          Best Sellers
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-base text-zinc-500">
          Kanki Stores best products formulated by natural ingredients that
          provides the best benefit for your health.
        </p>

        <div className="mx-auto mt-14 grid min-h-[474px] w-full max-w-[1368px] justify-items-center gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.name}
              className="group flex h-[474px] w-[324px] flex-col gap-6 rounded-3xl border border-zinc-200 bg-white p-4 pb-6 text-left shadow-[0_12px_45px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:border-emerald-500/60"
            >
              <div className="relative h-[324px] w-full overflow-hidden rounded-3xl bg-zinc-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={324}
                  height={324}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-zinc-500 shadow"
                  aria-label="Save product"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.7}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 20s-5.5-3.5-8-7a4.5 4.5 0 0 1 7-5 4.5 4.5 0 0 1 7 5c-2.5 3.5-8 7-8 7Z" />
                  </svg>
                </button>
              </div>
              <div className="flex flex-1 flex-col justify-between px-2">
                <h3 className="text-base font-semibold text-zinc-900">
                  {product.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-2 text-xl font-semibold text-[#4D9C2C]">
                  ₹{product.price}
                  {product.oldPrice && (
                    <span className="text-base font-normal text-zinc-400 line-through">
                      ₹{product.oldPrice}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <button className="mt-12 inline-flex items-center gap-3 rounded-xl border border-zinc-900/20 px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-900 transition hover:border-zinc-900/50">
          See All Products
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
