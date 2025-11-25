"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/data/products";

const TABS = [
  { key: "description", label: "Description" },
  { key: "howToUse", label: "How To Use" },
  { key: "ingredients", label: "Ingredients" },
  { key: "forWho", label: "For Who" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function ProductInfoTabs({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState<TabKey>("description");

  const content = useMemo(() => {
    switch (activeTab) {
      case "description":
        return (
          <p className="text-sm leading-relaxed text-zinc-600">
            {product.description}
          </p>
        );
      case "howToUse":
        return (
          <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-600">
            {product.howToUse.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        );
      case "ingredients":
        return (
          <ul className="flex flex-wrap gap-2 text-sm text-zinc-600">
            {product.ingredients.map((item) => (
              <li
                key={item}
                className="rounded-full border border-[#E6EEDF] px-3 py-1 text-[#355B20]"
              >
                {item}
              </li>
            ))}
          </ul>
        );
      case "forWho":
        return (
          <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-600">
            {product.forWho.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  }, [activeTab, product]);

  return (
    <div className="space-y-4 rounded-3xl border border-[#E6EEDF] bg-white">
      <div className="flex overflow-x-auto rounded-t-3xl bg-[#F7F8F4] px-4">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 px-4 py-4 text-sm font-semibold uppercase tracking-wide transition ${
              activeTab === tab.key
                ? "rounded-t-3xl bg-white text-[#355B20] shadow-[inset_0_-4px_0_#355B20]"
                : "text-zinc-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="px-6 pb-6">{content}</div>
    </div>
  );
}
