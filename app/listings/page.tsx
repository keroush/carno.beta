import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FilterSidebar } from "@/components/search/FilterSidebar";
import { RelatedListingCard } from "@/components/listing-detail/RelatedListingCard";
import { Pagination } from "@/components/dashboard/Pagination";
import {
  getSearchFilters,
  getSearchHero,
  getSearchListings,
} from "@/lib/searchApi";
import { normalizeSearchFiltersResponse } from "@/lib/normalizeSearchFilters";
import { toPersianDigits } from "@/lib/persianNumber";
import type {
  SearchListingsQuery,
  SearchUsageType,
  SortOptionValue,
} from "@/types/search";

export const metadata: Metadata = {
  title: "جستجوی آگهی — کارنو",
};

interface ListingsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function toIntArray(value: string | string[] | undefined): number[] {
  return toArray(value)
    .map(Number)
    .filter((n) => Number.isFinite(n));
}

function toInt(value: string | string[] | undefined): number | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export default async function ListingsPage({
  searchParams,
}: ListingsPageProps) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim() : "";
  const page = toInt(params.page) ?? 1;

  const query: SearchListingsQuery = {
    brands: toIntArray(params["brands[]"]),
    models: toIntArray(params["models[]"]),
    province_id: toInt(params.province_id),
    city_id: toInt(params.city_id),
    usage_type: toArray(params["usage_type[]"]) as SearchUsageType[],
    price_min: toInt(params.price_min),
    price_max: toInt(params.price_max),
    year_min: toInt(params.year_min),
    year_max: toInt(params.year_max),
    mileage_max: toInt(params.mileage_max),
    colors: toIntArray(params["colors[]"]),
    fuel_types: toIntArray(params["fuel_types[]"]),
    sort:
      typeof params.sort === "string"
        ? (params.sort as SortOptionValue)
        : undefined,
    page,
  };

  const rawFilters = await getSearchFilters();
  const filters = normalizeSearchFiltersResponse(rawFilters);

  // search/listings doesn't support a free-text `q` param yet (per the doc) —
  // when the hero search bar sends one, use search/hero instead so the query
  // still does something useful rather than being silently dropped.
  const hasStructuredFilters =
    (query.brands?.length ?? 0) > 0 ||
    (query.models?.length ?? 0) > 0 ||
    query.province_id !== undefined ||
    query.city_id !== undefined ||
    (query.usage_type?.length ?? 0) > 0 ||
    query.price_min !== undefined ||
    query.price_max !== undefined ||
    query.year_min !== undefined ||
    query.year_max !== undefined ||
    query.mileage_max !== undefined ||
    (query.colors?.length ?? 0) > 0 ||
    (query.fuel_types?.length ?? 0) > 0;

  const results =
    q.length >= 2 && !hasStructuredFilters
      ? await getSearchHero(q, page)
      : await getSearchListings(query);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-20 pt-[166px] lg:pt-[110px]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-8">
            <h1 className="mb-1 text-2xl font-black text-stone-800 sm:text-3xl">
              {q.length > 0 ? `نتایج جستجو برای «${q}»` : "همه آگهی‌ها"}
            </h1>
            <p className="text-sm text-stone-400">
              {toPersianDigits(results.meta.total)} آگهی یافت شد
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
            <FilterSidebar filters={filters} initialQuery={query} />

            <div>
              {results.data.length === 0 ? (
                <div className="shadow-card rounded-[24px] border border-dashed border-stone-200 bg-white/60 p-10 text-center text-sm text-stone-400">
                  آگهی‌ای مطابق با این جستجو یافت نشد.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {results.data.map((listing) => (
                    <RelatedListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              )}

              <Pagination
                meta={{
                  current_page: results.meta.current_page,
                  last_page: results.meta.last_page,
                }}
                basePath={`/listings${q ? `?q=${encodeURIComponent(q)}` : ""}`}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
