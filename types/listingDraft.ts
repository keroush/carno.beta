export type UsageType = "zero" | "used" | "pre_sale";
export type SaleType = "cash" | "negotiable";
export type ListingStatus = "draft" | "pending" | string;

export interface ListingImage {
  id: number;
  path: string;
  order: number;
}

/**
 * The doc only ever shows this shape in its *empty* state (every relational
 * field null). It doesn't show what brand/car_model/trim/etc. look like once
 * set — plausibly a nested `{ id, name }` object per typical Laravel API
 * Resource conventions, but that's an assumption, not something the doc
 * confirms. Because of that, the wizard doesn't rely on parsing these nested
 * fields back out of the server response: it tracks the human-readable
 * selection (brand name, model name, etc.) in its own client-side state,
 * populated at the moment the user picks it from the /search/filters list —
 * which we always know precisely, regardless of what shape the server
 * echoes back. `unknown` here keeps that boundary honest.
 */
export interface ListingDraft {
  id: number;
  current_step: number;
  status: ListingStatus;
  brand: unknown;
  car_model: unknown;
  year: number | null;
  trim: unknown;
  usage_type: UsageType | null;
  mileage: number | null;
  delivery_date: string | null;
  body_color: unknown;
  interior_color: unknown;
  paintwork_status: unknown;
  city: unknown;
  price: number | null;
  sale_type: SaleType | null;
  is_exchange: boolean;
  description: string | null;
  images: ListingImage[];
  missing_fields: string[];
}

export interface TrimOption {
  id: number;
  name: string;
  generation_name: string;
}

export interface YearOptionsResponse {
  years: number[];
}

export interface TrimOptionsResponse {
  trims: TrimOption[];
}

// Re-exported for existing call sites; the canonical definitions now live in
// types/search.ts since /api/search/filters is shared by the wizard and the
// public search/filter page.
export type { CarModelOption, BrandOption, CityOption, ProvinceOption, ColorOption, PaintworkStatusOption, CodedOption, SearchFiltersResponse } from "@/types/search";
