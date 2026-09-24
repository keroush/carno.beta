"use client";

import { useEffect, useMemo, useState } from "react";
import { WizardStepShell } from "@/components/dashboard/listing-wizard/WizardStepShell";
import { TileSelect } from "@/components/dashboard/listing-wizard/TileSelect";
import { wizardApi, WizardApiError } from "@/lib/listingWizardClient";
import type { ListingDraft, TrimOption } from "@/types/listingDraft";

interface StepTrimProps {
  draftId: number;
  year: number;
  selectedTrimId?: number;
  onComplete: (listing: ListingDraft, trim: TrimOption) => void;
  onBack: () => void;
}

export function StepTrim({ draftId, year, selectedTrimId, onComplete, onBack }: StepTrimProps) {
  const [trims, setTrims] = useState<TrimOption[] | null>(null);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoadingOptions(true);
    wizardApi
      .getTrimOptions(draftId)
      .then(({ trims: options }) => {
        if (!cancelled) setTrims(options);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof WizardApiError ? err.message : "دریافت فهرست تیپ‌ها با خطا مواجه شد.");
      })
      .finally(() => {
        if (!cancelled) setIsLoadingOptions(false);
      });
    return () => {
      cancelled = true;
    };
  }, [draftId]);

  const hasDuplicateNames = useMemo(() => {
    if (!trims) return false;
    const names = trims.map((trim) => trim.name);
    return new Set(names).size !== names.length;
  }, [trims]);

  async function handleSelect(trimId: number) {
    setError(null);
    setIsSubmitting(true);
    try {
      const { listing } = await wizardApi.putStep(draftId, "trim", { trim_id: trimId });
      const trim = trims?.find((item) => item.id === trimId);
      if (trim) onComplete(listing, trim);
    } catch (err) {
      setError(err instanceof WizardApiError ? err.message : "خطای غیرمنتظره‌ای رخ داد.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <WizardStepShell title="تیپ" subtitle={`تیپ خودروی سال ${year} را انتخاب کنید`} error={error} onBack={onBack}>
      {isLoadingOptions ? (
        <p className="text-sm text-stone-400">در حال دریافت فهرست تیپ‌ها...</p>
      ) : !trims || trims.length === 0 ? (
        <p className="text-sm text-stone-400">تیپی برای این مدل و سال یافت نشد.</p>
      ) : (
        <TileSelect
          options={trims.map((trim) => ({
            value: trim.id,
            label: trim.name,
            sublabel: hasDuplicateNames ? trim.generation_name : undefined,
          }))}
          value={selectedTrimId}
          onChange={(value) => !isSubmitting && handleSelect(Number(value))}
          columns={2}
        />
      )}
      {isSubmitting && <p className="mt-4 text-xs text-stone-400">در حال ذخیره...</p>}
    </WizardStepShell>
  );
}
