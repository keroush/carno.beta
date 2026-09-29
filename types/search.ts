export interface CarModelOption {
  id: number;
  name: string;
  slug: string;
}

export interface BrandOption {
  id: number;
  name: string;
  slug: string;
  models: CarModelOption[];
}

export interface CityOption {
  id: number;
  name: string;
}

export interface ProvinceOption {
  id: number;
  name: string;
  cities: CityOption[];
}

export interface FuelTypeOption {
  id: number;
  name: string;
}

export interface BodyTypeOption {
  id: number;
  name: string;
}

export interface ColorOption {
  id: number;
  name: string;
  hex_code: string;
}

export interface PaintworkStatusOption {
  id: number;
  name: string;
}

export interface CodedOption<Value extends string = string> {
  value: Value;
  label: string;
}

export type SearchUsageType = "zero" | "used" | "pre_sale";
export type SearchSaleType = "cash" | "negotiable";
export type SortOptionValue = "newest" | "price_asc" | "price_desc" | "mileage_asc" | "year_desc";

/**
 * GET /api/search/filters. Confirmed (not inferred) shape per the search API
 * doc: `brands` and `provinces` are Laravel API Resources and wrapped in
 * `{ data: [...] }`; the rest (fuel_types, colors, paintwork_statuses,
 * body_types, usage_types, sale_types, sort_options) are bare arrays. This
 * asymmetry is called out explicitly in the doc as deliberate, not a bug.
 * Don't trust it blindly though — see lib/normalizeSearchFilters.ts.
 */
export interface SearchFiltersResponse {
  brands: { data: BrandOption[] };
  provinces: { data: ProvinceOption[] };
  fuel_types: FuelTypeOption[];
  colors: ColorOption[];
  paintwork_statuses: PaintworkStatusOption[];
  body_types: BodyTypeOption[];
  usage_types: CodedOption<SearchUsageType>[];
  sale_types: CodedOption<SearchSaleType>[];
  sort_options: CodedOption<SortOptionValue>[];
}

/** Shared ListingCardResource shape — used by search/listings, search/hero, and the landing page's ad sections. */
export interface SearchListingCard {
  id: number;
  /** Null for old listings created before slugs existed — fall back to `id` for links in that case. */
  slug: string | null;
  title: string;
  year: number;
  price: number;
  usage_type: SearchUsageType | string;
  usage_type_label: string;
  mileage: number | null;
  city: string;
  cover_image: string;
  /** Only accurate when the request carried a valid Authorization header; false for guests. */
  is_saved: boolean;
  created_at: string;
}

export interface SearchListingsMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}

export interface SearchListingsLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface SearchListingsResponse {
  data: SearchListingCard[];
  links: SearchListingsLinks;
  meta: SearchListingsMeta;
}

/** Query params accepted by GET /api/search/listings — all optional. */
export interface SearchListingsQuery {
  brands?: number[];
  models?: number[];
  province_id?: number;
  city_id?: number;
  usage_type?: SearchUsageType[];
  price_min?: number;
  price_max?: number;
  year_min?: number;
  year_max?: number;
  mileage_max?: number;
  colors?: number[];
  fuel_types?: number[];
  body_types?: number[];
  sort?: SortOptionValue;
  page?: number;
  per_page?: number;
}

/** GET /api/search/suggestions — autocomplete search *terms*, not listings. Wired up in a later part. */
export interface SearchSuggestion {
  text: string;
  listings_count: number;
}

export interface SearchSuggestionsResponse {
  suggestions: SearchSuggestion[];
}
