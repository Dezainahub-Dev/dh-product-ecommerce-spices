import Image from "next/image";

const products = [
  {
    name: "Facial Cleanser Avanora Your Skin Bae Kojic Acid 100ml",
    price: 399,
    image:
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Moisturizer Avanora Your Skin Bae Multi Herbs 15ml",
    price: 349,
    image:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Deep Body Cleanser Avanora My Serendipity No.1 200ml",
    price: 499,
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Facial Cleanser Avanora Your Skin Bae Spirulina 100ml",
    price: 359,
    image:
      "https://images.unsplash.com/photo-1519400197429-404ae1a1e184?auto=format&fit=crop&w=800&q=80",
  },
];

export function NewArrivalsSection() {
  return (
    <section className="bg-white text-zinc-900">
      <div className="mx-auto max-w-[1368px] px-6 py-20 text-center">
       
        <h2 className="mt-4 text-4xl font-semibold text-[var(--color-primary)]">
          New Arrivals
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-base text-zinc-500">
          The latest products from Avanora to brighten and nourish your
          beautiful skin.
        </p>

        <div className="mx-auto mt-14 grid min-h-[474px] w-full max-w-[1368px] justify-items-center gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.name}
              className="group flex h-[474px] w-[324px] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white text-left shadow-[0_12px_35px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:border-emerald-500/60"
            >
              <div className="relative h-[324px] w-full bg-zinc-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={324}
                  height={324}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
                  style={{ opacity: 1 }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-zinc-600 shadow"
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
              <div className="flex flex-1 flex-col justify-between bg-white px-6 pb-6 pt-5">
                <div>
                  <p className="text-sm font-medium text-zinc-500">
                    Facial Care
                  </p>
                  <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-zinc-900">
                    {product.name}
                  </h3>
                </div>
                <p className="mt-4 text-xl font-semibold text-[var(--color-primary)]">
                  ₹{product.price}
                </p>
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
