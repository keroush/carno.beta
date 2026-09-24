import "server-only";
import { ApiError, parseJsonResponse } from "@/lib/apiError";
import type { ListingDetailResponse, RelatedListingSummary } from "@/types/listingDetail";

const API_BASE_URL = process.env.API_BASE_URL ?? "https://auto-gallery.amlakemoon.com/api";

/**
 * The doc says `related_listings` is wrapped in `{ data: [...] }` (since it's
 * built from a Laravel API Resource collection), but real responses have
 * already surprised us once before (see the brand_id migration issue), so
 * this doesn't trust that shape blindly. Handles: the documented `{ data }`
 * wrapper, a bare array, or the key being missing/null entirely — anything
 * else just becomes an empty list instead of crashing the page.
 */
function normalizeRelatedListings(raw: unknown): RelatedListingSummary[] {
  if (Array.isArray(raw)) return raw as RelatedListingSummary[];
  if (raw && typeof raw === "object" && "data" in raw) {
    const data = (raw as { data: unknown }).data;
    if (Array.isArray(data)) return data as RelatedListingSummary[];
  }
  return [];
}

/**
 * GET /api/listings/{id} is public but has a side effect — every call records
 * a view. `cache: "no-store"` is load-bearing here, not a default: the doc is
 * explicit that this must never be cached, or view counts (and staleness)
 * break. Only call this from a page that's actually being viewed, never for
 * prefetch/preview.
 */
export async function getListingDetail(id: string): Promise<ListingDetailResponse> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/listings/${id}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
  } catch {
    throw new ApiError(502, { message: "امکان ارتباط با سرور وجود ندارد." });
  }

  const payload = await parseJsonResponse(res);

  if (!res.ok) {
    throw new ApiError(res.status, payload);
  }

  const raw = payload as { listing: ListingDetailResponse["listing"]; related_listings?: unknown };

  return {
    listing: raw.listing,
    related_listings: { data: normalizeRelatedListings(raw.related_listings) },
  };
}
