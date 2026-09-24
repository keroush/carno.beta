import type { Brand, Car, PriceClass, UsageType } from "./types";

/**
 * Mock data-access layer.
 * In production these functions would call your leasing backend
 * (REST/GraphQL). Each is async and lightly delayed so the
 * Suspense skeletons in the page are visibly exercised.
 */

function delay<T>(value: T, ms = 500): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

const IMG = {
  sedan1: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80&auto=format&fit=crop",
  sedan2: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80&auto=format&fit=crop",
  suv1: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80&auto=format&fit=crop",
  suv2: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80&auto=format&fit=crop",
  coupe1: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80&auto=format&fit=crop",
  coupe2: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80&auto=format&fit=crop",
  electric1: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80&auto=format&fit=crop",
  truck1: "https://images.unsplash.com/photo-1595589984649-7bc0d24ca34c?w=800&q=80&auto=format&fit=crop",
  hatch1: "https://images.unsplash.com/photo-1541348263662-e068662d82af?w=800&q=80&auto=format&fit=crop",
  lux1: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80&auto=format&fit=crop",
};

const ALL_CARS: Car[] = [
  { id: "c1", title: "M4 Competition", brand: "BMW", model: "M4", image: IMG.coupe1, location: "Los Angeles, CA", usageType: "new", price: 1240, currency: "$", mileageKm: 0, hasVideo: true, isBookmarked: false, views: 3420, demandScore: 97, tier: "lux" },
  { id: "c2", title: "Model 3 Long Range", brand: "Tesla", model: "Model 3", image: IMG.electric1, location: "Austin, TX", usageType: "new", price: 690, currency: "$", mileageKm: 0, hasVideo: true, isBookmarked: true, views: 5210, demandScore: 95, tier: "mid_range" },
  { id: "c3", title: "Wrangler Rubicon", brand: "Jeep", model: "Wrangler", image: IMG.suv1, location: "Denver, CO", usageType: "used", price: 520, currency: "$", mileageKm: 18500, hasVideo: false, isBookmarked: false, views: 2110, demandScore: 88, tier: "economic" },
  { id: "c4", title: "911 Carrera", brand: "Porsche", model: "911", image: IMG.coupe2, location: "Miami, FL", usageType: "pre_sale", price: 2380, currency: "$", mileageKm: 0, hasVideo: true, isBookmarked: false, views: 6890, demandScore: 99, tier: "special" },
  { id: "c5", title: "F-150 Lightning", brand: "Ford", model: "F-150", image: IMG.truck1, location: "Houston, TX", usageType: "new", price: 780, currency: "$", mileageKm: 0, hasVideo: false, isBookmarked: false, views: 1870, demandScore: 82, tier: "high_ranking" },
  { id: "c6", title: "A-Class Hatch", brand: "Mercedes-Benz", model: "A-Class", image: IMG.hatch1, location: "Seattle, WA", usageType: "used", price: 410, currency: "$", mileageKm: 24200, hasVideo: false, isBookmarked: true, views: 990, demandScore: 74, tier: "base" },
];

const LATEST_ADS: Car[] = [
  { id: "l1", title: "Civic Sport", brand: "Honda", model: "Civic", image: IMG.sedan1, location: "Phoenix, AZ", usageType: "used", price: 320, currency: "$", mileageKm: 32000, hasVideo: false, isBookmarked: false, views: 540, demandScore: 61, tier: "base" },
  { id: "l2", title: "Model Y Performance", brand: "Tesla", model: "Model Y", image: IMG.electric1, location: "San Jose, CA", usageType: "new", price: 860, currency: "$", mileageKm: 0, hasVideo: true, isBookmarked: false, views: 1290, demandScore: 79, tier: "mid_range" },
  { id: "l3", title: "X5 xDrive40i", brand: "BMW", model: "X5", image: IMG.suv2, location: "Chicago, IL", usageType: "pre_sale", price: 1490, currency: "$", mileageKm: 0, hasVideo: true, isBookmarked: true, views: 2035, demandScore: 85, tier: "high_ranking" },
  { id: "l4", title: "S-Class 580", brand: "Mercedes-Benz", model: "S-Class", image: IMG.lux1, location: "New York, NY", usageType: "new", price: 2790, currency: "$", mileageKm: 0, hasVideo: true, isBookmarked: false, views: 3110, demandScore: 91, tier: "special" },
  { id: "l5", title: "Corolla Hybrid", brand: "Toyota", model: "Corolla", image: IMG.sedan2, location: "Dallas, TX", usageType: "used", price: 260, currency: "$", mileageKm: 41000, hasVideo: false, isBookmarked: false, views: 410, demandScore: 55, tier: "base" },
  { id: "l6", title: "Range Rover Sport", brand: "Land Rover", model: "Range Rover Sport", image: IMG.suv1, location: "Scottsdale, AZ", usageType: "pre_sale", price: 2150, currency: "$", mileageKm: 0, hasVideo: false, isBookmarked: false, views: 1780, demandScore: 83, tier: "lux" },
];

const BY_TYPE: Record<UsageType, Car[]> = {
  new: [ALL_CARS[0]!, ALL_CARS[1]!, ALL_CARS[4]!, LATEST_ADS[1]!, LATEST_ADS[3]!],
  used: [ALL_CARS[2]!, ALL_CARS[5]!, LATEST_ADS[0]!, LATEST_ADS[4]!],
  pre_sale: [ALL_CARS[3]!, LATEST_ADS[2]!, LATEST_ADS[5]!],
};

const PRICE_CLASSES: PriceClass[] = [
  { id: "base", label: "Base", rangeLabel: "Under $350/mo", minPrice: 0, maxPrice: 350, listingCount: 128, colorVar: "--color-sand" },
  { id: "economic", label: "Economic", rangeLabel: "$350 – $600/mo", minPrice: 350, maxPrice: 600, listingCount: 214, colorVar: "--color-sky" },
  { id: "mid_range", label: "Mid-Range", rangeLabel: "$600 – $950/mo", minPrice: 600, maxPrice: 950, listingCount: 176, colorVar: "--color-amber" },
  { id: "high_ranking", label: "High-Ranking", rangeLabel: "$950 – $1,600/mo", minPrice: 950, maxPrice: 1600, listingCount: 93, colorVar: "--color-orange" },
  { id: "lux", label: "Lux", rangeLabel: "$1,600 – $2,500/mo", minPrice: 1600, maxPrice: 2500, listingCount: 47, colorVar: "--color-plum" },
  { id: "special", label: "Special", rangeLabel: "$2,500/mo +", minPrice: 2500, maxPrice: null, listingCount: 21, colorVar: "--color-rust" },
];

const BRANDS: Brand[] = [
  { id: "b1", name: "BMW", logoInitial: "B", activeListings: 312, accentVar: "--color-plum" },
  { id: "b2", name: "Mercedes-Benz", logoInitial: "M", activeListings: 289, accentVar: "--color-sand" },
  { id: "b3", name: "Tesla", logoInitial: "T", accentVar: "--color-rust", activeListings: 401 },
  { id: "b4", name: "Toyota", logoInitial: "T", activeListings: 356, accentVar: "--color-sky-deep" },
  { id: "b5", name: "Porsche", logoInitial: "P", activeListings: 118, accentVar: "--color-orange" },
  { id: "b6", name: "Audi", logoInitial: "A", activeListings: 244, accentVar: "--color-plum" },
  { id: "b7", name: "Jeep", logoInitial: "J", activeListings: 167, accentVar: "--color-amber" },
  { id: "b8", name: "Ford", logoInitial: "F", activeListings: 198, accentVar: "--color-orange" },
];

export async function getHighDemandCars(): Promise<Car[]> {
  return delay(
    [...ALL_CARS].sort((a, b) => b.demandScore - a.demandScore),
    650
  );
}

export async function getLatestAds(): Promise<Car[]> {
  return delay(LATEST_ADS, 550);
}

export async function getCarsByType(): Promise<Record<UsageType, Car[]>> {
  return delay(BY_TYPE, 600);
}

export async function getPriceClasses(): Promise<PriceClass[]> {
  return delay(PRICE_CLASSES, 450);
}

export async function getHighDemandBrands(): Promise<Brand[]> {
  return delay(
    [...BRANDS].sort((a, b) => b.activeListings - a.activeListings),
    500
  );
}
