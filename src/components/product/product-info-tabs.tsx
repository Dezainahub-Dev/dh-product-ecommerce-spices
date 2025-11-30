"use client";

import { useMemo, useState } from "react";
import type { ProductDetail } from "@/lib/products";

const TABS = [
  { key: "description", label: "Description" },
  { key: "ingredients", label: "Ingredients" },
  { key: "manufacturer", label: "Manufacturer Info" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function ProductInfoTabs({ product }: { product: ProductDetail }) {
  const [activeTab, setActiveTab] = useState<TabKey>("description");

  const content = useMemo(() => {
    switch (activeTab) {
      case "description":
        return (
          <p className="text-sm leading-relaxed text-zinc-600">
            {product.description || "No description available."}
          </p>
        );
      case "ingredients":
        if (!product.ingredients || product.ingredients.length === 0) {
          return <p className="text-sm text-zinc-500">No ingredients information available.</p>;
        }
        return (
          <ul className="flex flex-wrap gap-2 text-sm text-zinc-600">
            {product.ingredients.map((item) => (
              <li
                key={item}
                className="rounded-full border border-[--color-border-secondary] px-3 py-1 text-[--color-primary-dark]"
              >
                {item}
              </li>
            ))}
          </ul>
        );
      case "manufacturer":
        if (!product.manufacturerInfo) {
          return <p className="text-sm text-zinc-500">No manufacturer information available.</p>;
        }
        return (
          <div className="text-sm text-zinc-600">
            {typeof product.manufacturerInfo === 'string' ? (
              <p>{product.manufacturerInfo}</p>
            ) : (
              <pre className="whitespace-pre-wrap">{JSON.stringify(product.manufacturerInfo, null, 2)}</pre>
            )}
          </div>
        );
      default:
        return null;
    }
  }, [activeTab, product]);

  return (
    <div className="space-y-4 rounded-3xl border border-[--color-border-secondary] bg-background">
      <div className="flex overflow-x-auto rounded-t-3xl bg-[--color-bg-secondary] px-4">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 px-4 py-4 text-sm font-semibold uppercase tracking-wide transition ${
              activeTab === tab.key
                ? "rounded-t-3xl bg-background text-[--color-primary-dark] shadow-[inset_0_-4px_0_var(--color-primary-dark)]"
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
