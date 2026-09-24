import type { SaleType, UsageType } from "@/types/listingDraft";

/**
 * Human-readable echo of what the user picked at each step. This is the
 * wizard's source of truth for display — see the comment on ListingDraft in
 * types/listingDraft.ts for why we don't parse selections back out of the
 * server's nested response fields.
 */
export interface WizardSelections {
  brandId?: number;
  brandName?: string;
  modelId?: number;
  modelName?: string;
  year?: number;
  trimId?: number;
  trimLabel?: string;
  usageType?: UsageType;
  mileage?: number;
  deliveryDate?: string;
  bodyColorId?: number;
  bodyColorName?: string;
  interiorColorId?: number;
  interiorColorName?: string;
  paintworkStatusId?: number;
  paintworkStatusName?: string;
  provinceId?: number;
  provinceName?: string;
  cityId?: number;
  cityName?: string;
  saleType?: SaleType;
  price?: number;
  isExchange?: boolean;
  description?: string;
}
