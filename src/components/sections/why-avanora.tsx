import Image from "next/image";

const benefits = [
  {
    title: "Natural & Organic",
    description:
      "Crafted with plant-based ingredients for a gentle, non-toxic skincare routine.",
    image:
      "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Hydrating & Moisturizing",
    description: "Lock in moisture and keep your skin plump and fresh all day long.",
    image:
      "https://images.unsplash.com/photo-1512207846876-bb47da8d62cd?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Brightening & Glowing",
    description:
      "Enhance your skin’s radiance and achieve a naturally luminous glow.",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Anti-Aging & Protection",
    description:
      "Reduce fine lines, improve elasticity, and shield against environmental stressors.",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80",
  },
];

export function WhyAvanoraSection() {
  return (
    <section className="bg-zinc-950 text-white">
      <div className="relative mx-auto max-w-6xl px-6 py-20 text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mx-auto h-[520px] max-w-4xl bg-gradient-to-r from-zinc-900/0 via-zinc-900/60 to-zinc-900/0 blur-3xl"
        />
        <p className="text-sm uppercase tracking-[0.4em] text-[var(--color-primary-light)]">
          Why KANKI
        </p>
        <h2 className="mt-4 text-4xl font-semibold text-[var(--color-primary-lighter)]">
          Why KANKI
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-zinc-300">
          KANKI's best products formulated by natural ingredients that provide
          the best benefit for your skin.
        </p>

        <div className="mt-14 grid gap-10 md:grid-cols-2 xl:grid-cols-4">
          {benefits.map((benefit) => (
            <article
              key={benefit.title}
              className="flex flex-col items-center text-center"
            >
              <div className="h-[152px] w-[152px] overflow-hidden rounded-full border border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <Image
                  src={benefit.image}
                  alt={benefit.title}
                  width={152}
                  height={152}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mt-8 text-xl font-semibold text-white">
                {benefit.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                {benefit.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
