import type { SearchListingsResponse } from "@/types/search";

export class SearchApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "SearchApiError";
  }
}

export async function searchHero(q: string, signal?: AbortSignal): Promise<SearchListingsResponse> {
  const res = await fetch(`/api/search/hero?q=${encodeURIComponent(q)}`, { signal });
  const data = (await res.json()) as SearchListingsResponse & { message?: string };
  if (!res.ok) {
    throw new SearchApiError(res.status, data.message ?? "جستجو با خطا مواجه شد.");
  }
  return data;
}
