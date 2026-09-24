export type UsageType = "new" | "used" | "pre_sale";

export type PriceTierId =
  | "base"
  | "economic"
  | "mid_range"
  | "high_ranking"
  | "lux"
  | "special";

export interface Car {
  id: string;
  title: string;
  brand: string;
  model: string;
  image: string;
  location: string;
  usageType: UsageType;
  price: number;
  currency: string;
  mileageKm: number;
  hasVideo: boolean;
  isBookmarked: boolean;
  views: number;
  demandScore: number; // 0-100, used for the "High-Demand" swiper ranking
  tier: PriceTierId;
}

export interface PriceClass {
  id: PriceTierId;
  label: string;
  rangeLabel: string;
  minPrice: number;
  maxPrice: number | null;
  listingCount: number;
  colorVar: string; // css var name, e.g. "--color-ember"
}

export interface Brand {
  id: string;
  name: string;
  logoInitial: string;
  activeListings: number;
  accentVar: string;
}

export interface SessionState {
  authenticated: boolean;
}
