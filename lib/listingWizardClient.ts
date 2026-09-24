import type { ListingDraft, ListingImage, SaleType, TrimOption, UsageType } from "@/types/listingDraft";
import type {
  BrandOption,
  CodedOption,
  ColorOption,
  PaintworkStatusOption,
  ProvinceOption,
  SearchFiltersResponse,
} from "@/types/search";
import { normalizeSearchFiltersResponse } from "@/lib/normalizeSearchFilters";

export class WizardApiError extends Error {
  readonly status: number;
  readonly payload: unknown;

  constructor(status: number, payload: unknown) {
    super(
      typeof payload === "object" && payload && "message" in payload
        ? String((payload as { message: unknown }).message)
        : "Wizard API error",
    );
    this.status = status;
    this.payload = payload;
    this.name = "WizardApiError";
  }

  /** Field-level errors, when the payload has the doc's `{ errors: { field: string[] } }` shape. */
  get fieldErrors(): Record<string, string[]> | undefined {
    if (typeof this.payload === "object" && this.payload && "errors" in this.payload) {
      return (this.payload as { errors?: Record<string, string[]> }).errors;
    }
    return undefined;
  }

  get missingFields(): string[] | undefined {
    if (typeof this.payload === "object" && this.payload && "errors" in this.payload) {
      const errors = (this.payload as { errors?: { missing_fields?: string[] } }).errors;
      return errors?.missing_fields;
    }
    return undefined;
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const isFormData = init?.body instanceof FormData;
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...init?.headers,
    },
  });
  const text = await res.text();
  const data = text ? (JSON.parse(text) as unknown) : {};
  if (!res.ok) {
    throw new WizardApiError(res.status, data);
  }
  return data as T;
}

export const wizardApi = {
  getCurrent: () => request<{ listing: ListingDraft | null }>("/api/listings/draft/current"),
  start: () => request<{ listing: ListingDraft }>("/api/listings/draft/start", { method: "POST" }),
  getFilters: () => request<SearchFiltersResponse>("/api/search/filters"),
  putStep: (id: number, step: string, body: unknown) =>
    request<{ listing: ListingDraft }>(`/api/listings/draft/${id}/${step}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  getYearOptions: (id: number) => request<{ years: number[] }>(`/api/listings/draft/${id}/year-options`),
  getTrimOptions: (id: number) => request<{ trims: TrimOption[] }>(`/api/listings/draft/${id}/trim-options`),
  uploadImage: (id: number, file: File) => {
    const form = new FormData();
    form.set("image", file);
    return request<{ image: ListingImage; listing: ListingDraft }>(`/api/listings/draft/${id}/images`, {
      method: "POST",
      body: form,
    });
  },
  deleteImage: (id: number, imageId: number) =>
    request<{ listing: ListingDraft }>(`/api/listings/draft/${id}/images/${imageId}`, { method: "DELETE" }),
  submit: (id: number) => request<{ message: string; listing: ListingDraft }>(`/api/listings/draft/${id}/submit`, { method: "POST" }),
  cancel: (id: number) => request<{ message: string }>(`/api/listings/draft/${id}`, { method: "DELETE" }),
};

/**
 * Fallback labels used only if /search/filters doesn't actually include
 * usage_types / sale_types as coded {value,label} pairs (the doc never shows
 * this endpoint's JSON, so the shape is inferred — see types/listingDraft.ts).
 */
const USAGE_TYPE_FALLBACK: CodedOption<UsageType>[] = [
  { value: "zero", label: "صفر کیلومتر" },
  { value: "used", label: "کارکرده" },
  { value: "pre_sale", label: "پیش‌فروش" },
];

const SALE_TYPE_FALLBACK: CodedOption<SaleType>[] = [
  { value: "cash", label: "نقدی" },
  { value: "negotiable", label: "توافقی" },
];

/**
 * The doc never shows what brand/car_model/trim/etc. look like once set (only
 * their empty `null` state) — see the comment on ListingDraft. This makes a
 * best-effort guess at the common Laravel API-Resource shape (`{ id, name }`)
 * so a resumed draft can pre-fill step labels, but never throws if the real
 * shape differs — callers just fall back to blank until the user revisits
 * that step in the current session.
 */
export function extractIdName(value: unknown): { id: number; name: string } | null {
  if (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value &&
    typeof (value as { id: unknown }).id === "number" &&
    typeof (value as { name: unknown }).name === "string"
  ) {
    return { id: (value as { id: number }).id, name: (value as { name: string }).name };
  }
  return null;
}

/**
 * Reads the /search/filters response via the shared, shape-agnostic
 * normalizer (lib/normalizeSearchFilters.ts) — see that file for why it
 * doesn't just trust the documented brands/provinces `.data` wrapper blindly.
 * usage_types/sale_types additionally fall back to hardcoded labels if the
 * live response omits them entirely, since the wizard can't function without
 * the user being able to pick a usage/sale type.
 */
export function normalizeFilters(raw: SearchFiltersResponse): {
  brands: BrandOption[];
  usageTypes: CodedOption<UsageType>[];
  colors: ColorOption[];
  paintworkStatuses: PaintworkStatusOption[];
  provinces: ProvinceOption[];
  saleTypes: CodedOption<SaleType>[];
} {
  const normalized = normalizeSearchFiltersResponse(raw);

  return {
    brands: normalized.brands,
    usageTypes: normalized.usageTypes.length > 0 ? normalized.usageTypes : USAGE_TYPE_FALLBACK,
    colors: normalized.colors,
    paintworkStatuses: normalized.paintworkStatuses,
    provinces: normalized.provinces,
    saleTypes: normalized.saleTypes.length > 0 ? normalized.saleTypes : SALE_TYPE_FALLBACK,
  };
}
