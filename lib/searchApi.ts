import "server-only";
import { ApiError, parseJsonResponse } from "@/lib/apiError";
import type {
  SearchFiltersResponse,
  SearchListingsQuery,
  SearchListingsResponse,
  SearchSuggestionsResponse,
} from "@/types/search";

const API_BASE_URL = process.env.API_BASE_URL ?? "https://auto-gallery.amlakemoon.com/api";

/**
 * `token` is always optional here — every endpoint in this file is public.
 * But `search/listings` and `search/hero` both read an optional Authorization
 * header to populate `is_saved` accurately for a logged-in caller; omitting
 * it just means `is_saved` comes back `false` for every item, per the doc.
 */
async function callApi<T>(path: string, token?: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      // Both search endpoints are explicitly documented as never cached —
      // /listings due to query-string variety, /filters technically could be
      // cached (it only changes when an admin adds a brand/color), but the
      // doc frames it as "cache on the frontend once per page load", which
      // the wizard/search page already do in memory — no need for an HTTP
      // cache layer on top.
      cache: "no-store",
    });
  } catch {
    throw new ApiError(502, { message: "امکان ارتباط با سرور وجود ندارد." });
  }

  const payload = await parseJsonResponse(res);
  if (!res.ok) throw new ApiError(res.status, payload);
  return payload as T;
}

function buildQueryString(query: SearchListingsQuery): string {
  const params = new URLSearchParams();

  const appendArray = (key: string, values: number[] | string[] | undefined) => {
    values?.forEach((value) => params.append(`${key}[]`, String(value)));
  };
  const appendScalar = (key: string, value: number | string | undefined) => {
    if (value !== undefined) params.set(key, String(value));
  };

  appendArray("brands", query.brands);
  appendArray("models", query.models);
  appendScalar("province_id", query.province_id);
  appendScalar("city_id", query.city_id);
  appendArray("usage_type", query.usage_type);
  appendScalar("price_min", query.price_min);
  appendScalar("price_max", query.price_max);
  appendScalar("year_min", query.year_min);
  appendScalar("year_max", query.year_max);
  appendScalar("mileage_max", query.mileage_max);
  appendArray("colors", query.colors);
  appendArray("fuel_types", query.fuel_types);
  appendArray("body_types", query.body_types);
  appendScalar("sort", query.sort);
  appendScalar("page", query.page);
  appendScalar("per_page", query.per_page);

  return params.toString();
}

export function getSearchFilters(): Promise<SearchFiltersResponse> {
  return callApi("/search/filters");
}

export function getSearchListings(query: SearchListingsQuery, token?: string): Promise<SearchListingsResponse> {
  const qs = buildQueryString(query);
  return callApi(`/search/listings${qs ? `?${qs}` : ""}`, token);
}

export function getSearchHero(q: string, page = 1, perPage = 20, token?: string): Promise<SearchListingsResponse> {
  const params = new URLSearchParams({ q, page: String(page), per_page: String(perPage) });
  return callApi(`/search/hero?${params.toString()}`, token);
}

/** Autocomplete search *terms* (not listings) — GET /api/search/suggestions. Wired up in a later part. */
export function getSearchSuggestions(q: string): Promise<SearchSuggestionsResponse> {
  const params = new URLSearchParams({ q });
  return callApi(`/search/suggestions?${params.toString()}`);
}
