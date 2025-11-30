'use client';

import { useState } from "react";

const faqs = [
  {
    question: "What skin types are your products suitable for?",
    answer:
      "Our products are designed to cater to a variety of skin types, including dry, oily, combination, and sensitive skin. We provide detailed descriptions for each product to help you choose the best option for your specific needs.",
  },
  {
    question: "Are your products cruelty-free?",
    answer:
      "Yes. All of our formulas are cruelty-free and never tested on animals at any stage of development.",
  },
  {
    question: "Can I determine which products are right for me?",
    answer:
      "Absolutely. Each product page includes guidance on skin concerns, ingredients, and how to incorporate the product into your routine.",
  },
  {
    question: "Do you offer any samples or travel sizes?",
    answer:
      "We regularly release deluxe samples and discovery sizes so you can experience a product before committing to the full size.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We accept returns and exchanges within 30 days of purchase. Simply contact our care team with your order number to get started.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index: number) =>
    setOpenIndex((prev) => (prev === index ? -1 : index));

  return (
    <section className="bg-white px-6 py-24 text-[var(--color-text-dark)]">
      <div className="mx-auto max-w-[920px] text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-text-medium)]">
          FAQ
        </p>
        <h2 className="mt-4 text-4xl font-semibold">Frequently Asked Questions</h2>
      </div>

      <div className="mx-auto mt-14 flex max-w-[920px] flex-col gap-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.question}
              className="rounded-3xl border border-zinc-200 bg-white shadow-[0_10px_35px_rgba(53,91,32,0.05)]"
            >
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-6 px-8 py-6 text-left"
              >
                <span className="text-lg font-semibold text-zinc-900">
                  {faq.question}
                </span>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-600 transition">
                  <svg
                    viewBox="0 0 24 24"
                    className={`h-5 w-5 transition-transform ${
                      isOpen ? "-rotate-180" : "rotate-0"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </button>
              {isOpen && (
                <div className="px-8 pb-8 text-base leading-relaxed text-zinc-500">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
