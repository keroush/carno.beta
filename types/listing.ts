import type { CarUsageType } from "@/lib/usageType";

export interface CarListing {
  id: string;
  title: string;
  usageType: CarUsageType;
  /** Kilometers driven — only meaningful (and shown) when usageType is "used". */
  mileage?: number;
  year: string;
  city: string;
  transmission: string;
  views: string;
  /** Display string. Negotiable-priced ads set this to "توافقی" instead of a number. */
  price: string;
  priceLabel?: string;
  postedAt: string;
  image: string;
  imageAlt: string;
}

export interface MarketStat {
  id: string;
  value: string;
  label: string;
  tone: "orange" | "sky" | "neutral" | "peach";
}

export interface Brand {
  id: string;
  name: string;
  initials: string;
  count: string;
  tone: "orange" | "sky" | "neutral";
}

/** The four ad-category tabs shown in the homepage's featured-ads carousel. */
export type AdCategoryTab = "new" | "popular" | "economy" | "luxury";
