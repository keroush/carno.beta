"use client";

import { useState } from "react";
import { WizardStepShell } from "@/components/dashboard/listing-wizard/WizardStepShell";
import { TileSelect } from "@/components/dashboard/listing-wizard/TileSelect";
import { wizardApi, WizardApiError } from "@/lib/listingWizardClient";
import type { BrandOption, ListingDraft } from "@/types/listingDraft";

interface StepBrandProps {
  draftId: number;
  brands: BrandOption[];
  selectedBrandId?: number;
  onComplete: (listing: ListingDraft, brand: BrandOption) => void;
}

export function StepBrand({ draftId, brands, selectedBrandId, onComplete }: StepBrandProps) {
  const [pendingId, setPendingId] = useState<number | undefined>(selectedBrandId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSelect(brandId: number) {
    setPendingId(brandId);
    setError(null);
    setIsSubmitting(true);
    try {
      const { listing } = await wizardApi.putStep(draftId, "brand", { brand_id: brandId });
      const brand = brands.find((item) => item.id === brandId);
      if (brand) onComplete(listing, brand);
    } catch (err) {
      setError(err instanceof WizardApiError ? err.message : "خطای غیرمنتظره‌ای رخ داد.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <WizardStepShell title="برند خودرو" subtitle="برند خودروی خود را انتخاب کنید" error={error}>
      {brands.length === 0 ? (
        <p className="text-sm text-stone-400">فهرست برندها در دسترس نیست.</p>
      ) : (
        <TileSelect
          options={brands.map((brand) => ({ value: brand.id, label: brand.name }))}
          value={pendingId}
          onChange={(value) => !isSubmitting && handleSelect(Number(value))}
        />
      )}
      {isSubmitting && <p className="mt-4 text-xs text-stone-400">در حال ذخیره...</p>}
    </WizardStepShell>
  );
}
