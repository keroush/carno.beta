"use client";

import { useEffect, useState } from "react";
import { WizardStepShell } from "@/components/dashboard/listing-wizard/WizardStepShell";
import { wizardApi, WizardApiError } from "@/lib/listingWizardClient";
import type { ListingDraft } from "@/types/listingDraft";

interface StepYearProps {
  draftId: number;
  modelName: string;
  selectedYear?: number;
  onComplete: (listing: ListingDraft, year: number) => void;
  onBack: () => void;
}

export function StepYear({ draftId, modelName, selectedYear, onComplete, onBack }: StepYearProps) {
  const [years, setYears] = useState<number[] | null>(null);
  const [pendingYear, setPendingYear] = useState<number | undefined>(selectedYear);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoadingOptions(true);
    wizardApi
      .getYearOptions(draftId)
      .then(({ years: options }) => {
        if (!cancelled) setYears(options);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof WizardApiError ? err.message : "دریافت فهرست سال‌ها با خطا مواجه شد.");
      })
      .finally(() => {
        if (!cancelled) setIsLoadingOptions(false);
      });
    return () => {
      cancelled = true;
    };
  }, [draftId]);

  async function handleSubmit() {
    if (!pendingYear) return;
    setError(null);
    setIsSubmitting(true);
    try {
      const { listing } = await wizardApi.putStep(draftId, "year", { year: pendingYear });
      onComplete(listing, pendingYear);
    } catch (err) {
      setError(err instanceof WizardApiError ? err.message : "خطای غیرمنتظره‌ای رخ داد.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <WizardStepShell title="سال ساخت" subtitle={`سال ساخت ${modelName} را انتخاب کنید`} error={error} onBack={onBack}>
      {isLoadingOptions ? (
        <p className="text-sm text-stone-400">در حال دریافت فهرست سال‌ها...</p>
      ) : !years || years.length === 0 ? (
        <p className="text-sm text-stone-400">سالی برای این مدل یافت نشد.</p>
      ) : (
        <>
          <select
            value={pendingYear ?? ""}
            onChange={(event) => setPendingYear(event.target.value ? Number(event.target.value) : undefined)}
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-700 outline-none transition-colors focus:border-orange/40"
          >
            <option value="">انتخاب کنید...</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!pendingYear || isSubmitting}
            className="mt-5 w-full rounded-xl bg-orange px-5 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isSubmitting ? "در حال ذخیره..." : "ادامه"}
          </button>
        </>
      )}
    </WizardStepShell>
  );
}
