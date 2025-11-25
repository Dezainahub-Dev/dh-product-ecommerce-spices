const testimonials = [
  {
    quote:
      '"I\'ve never felt more confident in my skin! The glow serum worked wonders. My complexion has never been this even, and I love how lightweight it feels on my skin. Highly recommended!"',
    name: "Amanda S.",
    title: "Beauty Vlogger",
  },
  {
    quote:
      '"A skincare brand that truly cares about my skin and the environment. I love knowing that the ingredients are clean & safe. My skin feels nourished and refreshed every day!"',
    name: "Jessica L.",
    title: "Beauty Enthusiast",
  },
  {
    quote:
      '"Hydrated and healthy. I\'ve tried so many moisturizers before, but this one keeps my skin soft without feeling greasy. I can confidently go out without makeup now!"',
    name: "Rachel K.",
    title: "Beauty Enthusiast",
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-[#F0F6EA] px-6 pb-24 pt-0 text-zinc-900">
      <div className="mx-auto max-w-[1368px] text-center pt-12 md:pt-16">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-900/70">
          Testimonials
        </p>
        <h2 className="mt-3 text-4xl font-semibold text-[#355B20]">
          What our customers say?
        </h2>

        <div className="relative mt-14 grid gap-6 md:grid-cols-3">
          <button
            aria-label="Previous testimonial"
            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full border border-emerald-100 bg-white/70 p-3 text-emerald-700 shadow-sm transition hover:bg-white hidden md:block"
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            aria-label="Next testimonial"
            className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full border border-emerald-100 bg-white/70 p-3 text-emerald-700 shadow-sm transition hover:bg-white hidden md:block"
          >
            <span aria-hidden="true">›</span>
          </button>
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="rounded-3xl bg-white px-6 py-8 text-left shadow-[0_15px_45px_rgba(53,91,32,0.1)]"
            >
              <p className="text-base leading-relaxed text-zinc-600">
                {testimonial.quote}
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#CEE5C2] text-lg font-semibold text-[#355B20]">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="text-base font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-zinc-500">{testimonial.title}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="relative mx-auto mt-12 h-1 w-full max-w-[420px] rounded-full bg-emerald-100">
          <div className="absolute left-0 top-0 h-full w-1/3 rounded-full bg-[#4D9C2C]" />
        </div>
      </div>
    </section>
  );
}
