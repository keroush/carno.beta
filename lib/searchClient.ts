import type { SearchSuggestion } from "@/types/search";

export class SearchApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "SearchApiError";
  }
}

/**
 * Autocomplete search *terms* (not listings) for the hero search box's live
 * dropdown — GET /api/search/suggestions. Returns the bare suggestion array
 * (the endpoint has no `data` wrapper). An empty array is a normal, expected
 * result per the API doc ("no suggestions found"), not an error: callers
 * should just hide the dropdown and let the user submit a direct search.
 */
export async function searchSuggestions(q: string, signal?: AbortSignal): Promise<SearchSuggestion[]> {
  const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(q)}`, { signal });
  const data = (await res.json().catch(() => ({}))) as { suggestions?: unknown; message?: string };
  if (!res.ok) {
    throw new SearchApiError(res.status, data.message ?? "جستجو با خطا مواجه شد.");
  }
  if (!Array.isArray(data.suggestions)) return [];

  return data.suggestions
    .filter((item): item is { text: string; listings_count?: unknown } => {
      return !!item && typeof (item as { text?: unknown }).text === "string";
    })
    .map((item) => ({ text: item.text, listings_count: Number(item.listings_count) || 0 }));
}
