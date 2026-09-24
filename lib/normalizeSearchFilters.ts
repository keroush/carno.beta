import type {
  BrandOption,
  CodedOption,
  ColorOption,
  FuelTypeOption,
  PaintworkStatusOption,
  ProvinceOption,
  SearchFiltersResponse,
  SearchSaleType,
  SearchUsageType,
  SortOptionValue,
} from "@/types/search";

export interface NormalizedSearchFilters {
  brands: BrandOption[];
  provinces: ProvinceOption[];
  fuelTypes: FuelTypeOption[];
  colors: ColorOption[];
  paintworkStatuses: PaintworkStatusOption[];
  usageTypes: CodedOption<SearchUsageType>[];
  saleTypes: CodedOption<SearchSaleType>[];
  sortOptions: CodedOption<SortOptionValue>[];
}

/**
 * Unwraps a value into an array regardless of whether it arrives as a bare
 * array (`[...]`), a Laravel API Resource wrapper (`{ data: [...] }`), or —
 * just in case — a double-wrapped one (`{ data: { data: [...] } }`). The
 * search/filters doc says `brands`/`provinces` are wrapped and the rest are
 * bare, but trusting that distinction blindly is exactly what silently
 * dropped brands before: if the live response for a given field doesn't
 * match the documented shape, the old `field?.data ?? []` code would read
 * `.data` off a bare array (always `undefined`) and quietly return nothing.
 * This checks the actual shape instead of assuming it.
 */
function unwrapArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object" && "data" in value) {
    return unwrapArray<T>((value as { data: unknown }).data);
  }
  return [];
}

export function normalizeSearchFiltersResponse(raw: unknown): NormalizedSearchFilters {
  const source = (raw ?? {}) as Partial<Record<keyof SearchFiltersResponse, unknown>>;

  return {
    brands: unwrapArray<BrandOption>(source.brands),
    provinces: unwrapArray<ProvinceOption>(source.provinces),
    fuelTypes: unwrapArray<FuelTypeOption>(source.fuel_types),
    colors: unwrapArray<ColorOption>(source.colors),
    paintworkStatuses: unwrapArray<PaintworkStatusOption>(source.paintwork_statuses),
    usageTypes: unwrapArray<CodedOption<SearchUsageType>>(source.usage_types),
    saleTypes: unwrapArray<CodedOption<SearchSaleType>>(source.sale_types),
    sortOptions: unwrapArray<CodedOption<SortOptionValue>>(source.sort_options),
  };
}
