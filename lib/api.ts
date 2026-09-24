import {
  LatestListingsResponse,
  Listing,
  normalizeListing,
  PopularBrand,
  PopularBrandsResponse,
  PopularModel,
  PopularModelsResponse,
  SearchSuggestion,
  UsageType,
} from "./types";

const API_BASE = "https://auto-gallery.amlakemoon.com/api/landing";

async function safeJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  return (await res.json()) as T;
}

export async function getLatestListings(): Promise<Listing[]> {
  const res = await fetch(`${API_BASE}/listings/latest`, {
    next: { revalidate: 60 },
  });
  const json = await safeJson<LatestListingsResponse>(res);
  return json.data.map(normalizeListing);
}

export async function getPopularModels(): Promise<PopularModel[]> {
  const res = await fetch(`${API_BASE}/models/popular`, {
    next: { revalidate: 300 },
  });
  const json = await safeJson<PopularModelsResponse>(res);
  return json.data;
}

export async function getPopularBrands(): Promise<PopularBrand[]> {
  const res = await fetch(`${API_BASE}/brands/popular`, {
    next: { revalidate: 300 },
  });
  const json = await safeJson<PopularBrandsResponse>(res);
  return json.data;
}

export async function getListingsByUsageType(
  usageType: UsageType
): Promise<Listing[]> {
  const res = await fetch(`${API_BASE}/listings/${usageType}`, {
    next: { revalidate: 60 },
  });
  const json = await safeJson<LatestListingsResponse>(res);
  return json.data.map(normalizeListing);
}

/**
 * No real search endpoint exists yet. This simulates a network round trip
 * (latency + a rejected/aborted request on rapid re-typing) against a small
 * in-memory fixture, so the SearchBar's debounce/abort logic is exercised
 * exactly as it would be against a live API.
 */
const MOCK_CATALOG: SearchSuggestion[] = [
  { id: 1, title: "پژو 207 دنده‌ای", slug: "peugeot-207" },
  { id: 2, title: "پژو 206 تیپ 2", slug: "peugeot-206" },
  { id: 3, title: "پراید 131", slug: "pride-131" },
  { id: 4, title: "سمند LX", slug: "samand-lx" },
  { id: 5, title: "تارا اتوماتیک", slug: "tara-automatic" },
  { id: 6, title: "دنا پلاس توربو", slug: "dena-plus-turbo" },
  { id: 7, title: "شاهین G", slug: "shahin-g" },
];

export function searchCarVariants(
  query: string,
  signal: AbortSignal
): Promise<SearchSuggestion[]> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      if (signal.aborted) return;
      const q = query.trim();
      if (!q) {
        resolve([]);
        return;
      }
      resolve(
        MOCK_CATALOG.filter((item) => item.title.includes(q)).slice(0, 6)
      );
    }, 250); // simulated network latency, on top of the caller's debounce

    signal.addEventListener("abort", () => {
      clearTimeout(timeout);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}
