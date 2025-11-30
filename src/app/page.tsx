import { NewArrivalsSection } from "@/components/sections/new-arrivals";
import { WhyAvanoraSection } from "@/components/sections/why-avanora";
import { ShopByCategorySection } from "@/components/sections/shop-by-category";
import { BestSellersSection } from "@/components/sections/best-sellers";
import { MinimalMeBanner } from "@/components/sections/minimal-me-banner";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { FAQSection } from "@/components/sections/faq";
import { GlowRevolutionCTA } from "@/components/sections/glow-cta";
import { Footer } from "@/components/footer";

const heroStats = [
  { value: "500K+", label: "Radiant customers worldwide" },
  { value: "98%", label: "Report brighter, calmer skin" },
  { value: "24/7", label: "Dermatologist guidance" },
];

const heroHighlights = [
  "Botanical active ingredients",
  "Dermatologist tested",
  "Cruelty free & vegan",
];

export default function Home() {
  return (
    <main className="bg-white">
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-[1240px] items-center gap-16 px-6 pb-20 pt-16 lg:grid-cols-[minmax(0,1fr)_520px]">
        <div className="max-w-2xl">
          
          <h1 className="mt-8 text-4xl font-semibold leading-tight text-zinc-900 sm:text-5xl lg:text-[64px]">
            Let Your Skin{" "}
            <span className="text-emerald-900">Shine From Within</span>
          </h1>
          <p className="mt-6 text-2xl font-light leading-snug text-zinc-500 sm:text-[28px]">
            Bright, Beautiful, <br /> And Confidence
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button className="inline-flex items-center justify-center rounded-xl bg-[var(--color-primary)] px-8 py-3 text-base font-semibold uppercase tracking-wide text-white shadow-[0_18px_45px_rgba(103,39,27,0.35)] transition hover:bg-[var(--color-primary-dark)]">
              Shop Now
            </button>
            
          </div>

          

          <ul className="mt-10 flex flex-wrap gap-3 text-sm font-medium text-zinc-500">
            {heroHighlights.map((item) => (
              <li
                key={item}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-100 bg-zinc-50 px-4 py-2"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>

      </section>
      <WhyAvanoraSection />
      <NewArrivalsSection />
      <ShopByCategorySection />
      <BestSellersSection />
      <MinimalMeBanner />
      <TestimonialsSection />
      <FAQSection />
      <GlowRevolutionCTA />
      <Footer />
    </main>
  );
}
