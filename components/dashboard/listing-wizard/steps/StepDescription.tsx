"use client";

import { useState } from "react";
import { WizardStepShell } from "@/components/dashboard/listing-wizard/WizardStepShell";
import { wizardApi, WizardApiError } from "@/lib/listingWizardClient";
import type { ListingDraft } from "@/types/listingDraft";

interface StepDescriptionProps {
  draftId: number;
  selectedDescription?: string;
  onComplete: (listing: ListingDraft, description: string) => void;
  onBack: () => void;
}

export function StepDescription({ draftId, selectedDescription, onComplete, onBack }: StepDescriptionProps) {
  const [description, setDescription] = useState(selectedDescription ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    setIsSubmitting(true);
    try {
      const trimmed = description.trim();
      const { listing } = await wizardApi.putStep(draftId, "description", { description: trimmed.length > 0 ? trimmed : null });
      onComplete(listing, trimmed);
    } catch (err) {
      setError(err instanceof WizardApiError ? err.message : "خطای غیرمنتظره‌ای رخ داد.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <WizardStepShell title="توضیحات" subtitle="توضیحات تکمیلی درباره خودرو (اختیاری)" error={error} onBack={onBack}>
      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        rows={5}
        placeholder="خودرو تمیز، بدون رنگ، فقط تماس تلفنی..."
        className="font-vazir w-full resize-none rounded-xl border border-stone-200 px-4 py-3 text-sm text-stone-700 outline-none transition-colors placeholder:text-stone-300 focus:border-orange/40"
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="mt-5 w-full rounded-xl bg-orange px-5 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? "در حال ذخیره..." : description.trim().length > 0 ? "ادامه" : "رد کردن این مرحله"}
      </button>
    </WizardStepShell>
  );
}
