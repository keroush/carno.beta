"use client";

import { useState } from "react";
import { WizardStepShell } from "@/components/dashboard/listing-wizard/WizardStepShell";
import { TileSelect } from "@/components/dashboard/listing-wizard/TileSelect";
import { wizardApi, WizardApiError } from "@/lib/listingWizardClient";
import type { CarModelOption, ListingDraft } from "@/types/listingDraft";

interface StepModelProps {
  draftId: number;
  brandName: string;
  models: CarModelOption[];
  selectedModelId?: number;
  onComplete: (listing: ListingDraft, model: CarModelOption) => void;
  onBack: () => void;
}

export function StepModel({ draftId, brandName, models, selectedModelId, onComplete, onBack }: StepModelProps) {
  const [pendingId, setPendingId] = useState<number | undefined>(selectedModelId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSelect(modelId: number) {
    setPendingId(modelId);
    setError(null);
    setIsSubmitting(true);
    try {
      const { listing } = await wizardApi.putStep(draftId, "model", { car_model_id: modelId });
      const model = models.find((item) => item.id === modelId);
      if (model) onComplete(listing, model);
    } catch (err) {
      setError(err instanceof WizardApiError ? err.message : "خطای غیرمنتظره‌ای رخ داد.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <WizardStepShell title="مدل خودرو" subtitle={`مدل ${brandName} را انتخاب کنید`} error={error} onBack={onBack}>
      {models.length === 0 ? (
        <p className="text-sm text-stone-400">مدلی برای این برند یافت نشد.</p>
      ) : (
        <TileSelect
          options={models.map((model) => ({ value: model.id, label: model.name }))}
          value={pendingId}
          onChange={(value) => !isSubmitting && handleSelect(Number(value))}
        />
      )}
      {isSubmitting && <p className="mt-4 text-xs text-stone-400">در حال ذخیره...</p>}
    </WizardStepShell>
  );
}
