export type Product = {
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  stock: number;
  totalStock: number;
  tags: string[];
  highlights: string[];
  howToUse: string[];
  ingredients: string[];
  forWho: string[];
  relatedSlugs: string[];
};

export const products: Product[] = [
  {
    slug: "skin-serum-brighten-vitamin-c-30ml",
    name: "Avanora Skin Serum to Brighten Your Skin Bae Vitamin C 30ml",
    category: "Serum/Ampule",
    shortDescription:
      "Brightening serum packed with Vitamin C, Niacinamide, and Mandarin Orange Extract for glowing, even-toned skin.",
    description:
      "Avanora Serum from Your Skin Bae Series which functions as a brightening serum. Contains a combination of Brightening Complex, namely Vitamin C, Niacinamide, and Mandarin Orange Extract which are effective for brightening the skin, disguising acne scars, moisturizing the skin, disguising the appearance of pores, as an antioxidant, caring for the skin to look healthier.",
    price: 14.99,
    oldPrice: 20.99,
    rating: 4.9,
    reviews: 1142,
    stock: 36,
    totalStock: 100,
    tags: ["Dry Skin", "Oily Skin", "Sensitive Skin"],
    highlights: ["Best Seller", "New Arrival"],
    howToUse: [
      "After washing your face and using toner/essence, apply a few drops of serum to your face and massage gently.",
      "Use moisturizer to provide extra hydration.",
      "For skin protection, end your morning skincare routine with sunscreen.",
      "This serum can be used in the morning and at night.",
    ],
    ingredients: ["Vitamin C", "Niacinamide", "Mandarin Orange Extract", "Aloe Vera"],
    forWho: ["Dull skin seeking radiance", "Skin with uneven tone", "Those needing antioxidant protection"],
    relatedSlugs: [
      "anti-aging-package-retinol-ampoule",
      "marine-collagen-serum-30ml",
      "skin-bae-sun-shield-spf50",
      "lactic-acid-serum-30ml",
    ],
  },
  {
    slug: "anti-aging-package-retinol-ampoule",
    name: "Skincare Your Anti Aging Package (Retinol Ampoule 30ml & YSB Multi ...)",
    category: "Treatment Set",
    shortDescription: "Power duo set that targets fine lines and rejuvenates the skin barrier.",
    description:
      "This anti-aging package blends the potency of Retinol Ampoule and Your Skin Bae Multi booster to revive the skin barrier and improve elasticity.",
    price: 24.99,
    oldPrice: 34.99,
    rating: 4.7,
    reviews: 7593,
    stock: 58,
    totalStock: 120,
    tags: ["Mature Skin", "Barrier Repair"],
    highlights: ["Best Seller"],
    howToUse: [
      "Apply Retinol Ampoule at night after cleanser and toner.",
      "Follow with the Multi booster to lock in hydration.",
    ],
    ingredients: ["Retinol", "Ceramide Complex", "Centella Asiatica"],
    forWho: ["Skin with fine lines", "Barrier-compromised skin"],
    relatedSlugs: [
      "skin-serum-brighten-vitamin-c-30ml",
      "marine-collagen-serum-30ml",
      "lactic-acid-serum-30ml",
    ],
  },
  {
    slug: "marine-collagen-serum-30ml",
    name: "Avanora Your Skin Bae Marine Collagen Serum 30ml - Treats Skin...",
    category: "Serum",
    shortDescription: "Collagen-rich serum for plump, hydrated, and elastic skin.",
    description:
      "Marine collagen molecules boost firmness and hydration while botanical extracts soothe tired skin.",
    price: 24.99,
    oldPrice: 34.99,
    rating: 5,
    reviews: 2476,
    stock: 42,
    totalStock: 110,
    tags: ["Dry Skin", "Hydration"],
    highlights: ["New Arrival"],
    howToUse: [
      "Apply 2-3 drops to damp skin and pat gently.",
      "Layer with your moisturizer for best results.",
    ],
    ingredients: ["Marine Collagen", "Hyaluronic Acid", "Chamomile"],
    forWho: ["Dehydrated skin", "Loss of elasticity"],
    relatedSlugs: [
      "skin-serum-brighten-vitamin-c-30ml",
      "anti-aging-package-retinol-ampoule",
      "skin-bae-sun-shield-spf50",
    ],
  },
  {
    slug: "skin-bae-sun-shield-spf50",
    name: "Sunscreen Avanora Your Skin Bae Shield of Sun SPF 50 PA+ 30ml",
    category: "Sunscreen",
    shortDescription: "Lightweight sunscreen with broad-spectrum protection.",
    description:
      "A silky sunscreen that shields skin from UV rays while providing hydration and a soft matte finish.",
    price: 19.99,
    oldPrice: 34.99,
    rating: 5,
    reviews: 1317,
    stock: 65,
    totalStock: 140,
    tags: ["All Skin Types", "SPF"],
    highlights: ["Best Seller"],
    howToUse: [
      "Apply generously as the last step in your morning routine.",
      "Reapply every 2 hours when outdoors.",
    ],
    ingredients: ["Zinc Oxide", "Green Tea Extract", "Vitamin E"],
    forWho: ["Daily SPF users", "Sensitive skin needing mineral protection"],
    relatedSlugs: [
      "skin-serum-brighten-vitamin-c-30ml",
      "marine-collagen-serum-30ml",
      "lactic-acid-serum-30ml",
    ],
  },
  {
    slug: "lactic-acid-serum-30ml",
    name: "Avanora Your Skin Bae Lactic Acid Serum 30ml - Time to Look Glow Up",
    category: "Exfoliating Serum",
    shortDescription: "Gentle exfoliating serum for brighter, smoother skin.",
    description:
      "Lactic Acid renews the skin surface while natural humectants prevent dryness, revealing glass-like radiance.",
    price: 24.99,
    oldPrice: 34.99,
    rating: 4.9,
    reviews: 3144,
    stock: 47,
    totalStock: 110,
    tags: ["Dull Skin", "Texture"],
    highlights: ["Special Release"],
    howToUse: [
      "Use at night, 2-3 times a week after cleansing.",
      "Follow with hydrating serum and moisturizer.",
    ],
    ingredients: ["Lactic Acid", "Panthenol", "Allantoin"],
    forWho: ["Texture issues", "Uneven tone"],
    relatedSlugs: [
      "skin-serum-brighten-vitamin-c-30ml",
      "skin-bae-sun-shield-spf50",
      "anti-aging-package-retinol-ampoule",
    ],
  },
  {
    slug: "tranexamic-acid-serum-30ml",
    name: "Avanora Your Skin Bae Tranexamic Acid Serum 30ml - Disguise PIH & PIE",
    category: "Serum",
    shortDescription: "Targeted treatment to fade spots and post-inflammatory hyperpigmentation.",
    description:
      "Tranexamic Acid and licorice root even skin tone while peptides support barrier repair.",
    price: 9.99,
    oldPrice: 24.99,
    rating: 4.8,
    reviews: 1822,
    stock: 38,
    totalStock: 90,
    tags: ["Spots", "Brightening"],
    highlights: ["Best Seller"],
    howToUse: [
      "Apply to areas of concern morning and night.",
      "Layer sunscreen during the day.",
    ],
    ingredients: ["Tranexamic Acid", "Licorice Root", "Peptides"],
    forWho: ["Hyperpigmentation", "Dark spots"],
    relatedSlugs: [
      "skin-serum-brighten-vitamin-c-30ml",
      "lactic-acid-serum-30ml",
      "marine-collagen-serum-30ml",
    ],
  },
  {
    slug: "shield-defense-mist-30ml",
    name: "Avanora Your Skin Bae Shield Defense Mist 30ml",
    category: "Mist",
    shortDescription: "Anti-pollution mist for on-the-go hydration.",
    description:
      "Protective mist with antioxidants to refresh makeup and block daily aggressors.",
    price: 21.99,
    rating: 4.6,
    reviews: 642,
    stock: 72,
    totalStock: 150,
    tags: ["Hydration", "Anti-pollution"],
    highlights: ["New Arrival"],
    howToUse: [
      "Spritz whenever skin needs a pick-me-up.",
      "Use before sunscreen for added antioxidant defense.",
    ],
    ingredients: ["Niacinamide", "Green Tea", "Betaine"],
    forWho: ["Urban commuters", "All skin types"],
    relatedSlugs: [
      "skin-serum-brighten-vitamin-c-30ml",
      "skin-bae-sun-shield-spf50",
    ],
  },
  {
    slug: "intensive-repair-cream-35ml",
    name: "Avanora Your Skin Bae Intensive Repair Cream 35ml",
    category: "Moisturizer",
    shortDescription: "Barrier strengthening cream for resilient, calm skin.",
    description:
      "Ceramides and squalane deeply moisturize while calming oat soothe irritated skin.",
    price: 29.99,
    rating: 4.5,
    reviews: 988,
    stock: 54,
    totalStock: 120,
    tags: ["Barrier Repair", "Sensitive Skin"],
    highlights: ["Derm Approved"],
    howToUse: ["Apply generously as the final step of your routine."],
    ingredients: ["Ceramides", "Squalane", "Oat Extract"],
    forWho: ["Compromised barrier", "Dry skin"],
    relatedSlugs: [
      "anti-aging-package-retinol-ampoule",
      "tranexamic-acid-serum-30ml",
    ],
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}
