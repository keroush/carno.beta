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
 * usage_types, sale_types, sort_options) are bare arrays. This asymmetry is
 * called out explicitly in the doc as deliberate, not a bug — don't "fix" it
 * into a uniform shape.
 */
export interface SearchFiltersResponse {
  brands: { data: BrandOption[] };
  provinces: { data: ProvinceOption[] };
  fuel_types: FuelTypeOption[];
  colors: ColorOption[];
  paintwork_statuses: PaintworkStatusOption[];
  usage_types: CodedOption<SearchUsageType>[];
  sale_types: CodedOption<SearchSaleType>[];
  sort_options: CodedOption<SortOptionValue>[];
}

/** Shared ListingCardResource shape — used by search/listings, search/hero, and the landing page's ad sections. */
export interface SearchListingCard {
  id: number;
  slug?: string;
  title: string;
  year: number;
  price: number;
  usage_type: SearchUsageType | string;
  usage_type_label: string;
  mileage: number | null;
  city: string;
  cover_image: string;
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
  sort?: SortOptionValue;
  page?: number;
  per_page?: number;
}
