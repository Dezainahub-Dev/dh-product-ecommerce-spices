import Image from "next/image";

export function MinimalMeBanner() {
  return (
    <section className="bg-white pb-0 pt-10">
      <div className="relative h-[480px] w-full overflow-hidden md:h-[560px] xl:h-[720px]">
        <Image
          src="/Image.png"
          alt="Minimalist fashion model"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-8 right-8 max-w-lg text-right text-white md:bottom-12 md:right-12">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80">
            Minimal Me
          </p>
          <h3 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">
            Introducing our new minimalist collection. Suitable for the active
            yet elegant.
          </h3>
          <button className="mt-6 inline-flex items-center justify-center rounded-xl bg-white px-10 py-3 text-base font-semibold uppercase tracking-wide text-zinc-900 shadow-lg transition hover:bg-white/90">
            Shop Now
          </button>
        </div>
      </div>
    </section>
  );
}
