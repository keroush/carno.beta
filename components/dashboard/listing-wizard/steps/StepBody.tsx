"use client";

import { useState } from "react";
import { WizardStepShell } from "@/components/dashboard/listing-wizard/WizardStepShell";
import { TileSelect } from "@/components/dashboard/listing-wizard/TileSelect";
import { ColorSwatchSelect } from "@/components/dashboard/listing-wizard/ColorSwatchSelect";
import { wizardApi, WizardApiError } from "@/lib/listingWizardClient";
import type { ColorOption, ListingDraft, PaintworkStatusOption } from "@/types/listingDraft";

interface StepBodyProps {
  draftId: number;
  colors: ColorOption[];
  paintworkStatuses: PaintworkStatusOption[];
  selectedBodyColorId?: number;
  selectedInteriorColorId?: number;
  selectedPaintworkStatusId?: number;
  onComplete: (
    listing: ListingDraft,
    values: { bodyColor: ColorOption; interiorColor?: ColorOption; paintworkStatus: PaintworkStatusOption },
  ) => void;
  onBack: () => void;
}

export function StepBody({
  draftId,
  colors,
  paintworkStatuses,
  selectedBodyColorId,
  selectedInteriorColorId,
  selectedPaintworkStatusId,
  onComplete,
  onBack,
}: StepBodyProps) {
  const [bodyColorId, setBodyColorId] = useState<number | undefined>(selectedBodyColorId);
  const [interiorColorId, setInteriorColorId] = useState<number | undefined>(selectedInteriorColorId);
  const [paintworkStatusId, setPaintworkStatusId] = useState<number | undefined>(selectedPaintworkStatusId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = Boolean(bodyColorId) && Boolean(paintworkStatusId);

  async function handleSubmit() {
    if (!isValid || !bodyColorId || !paintworkStatusId) return;
    setError(null);
    setIsSubmitting(true);
    try {
      const { listing } = await wizardApi.putStep(draftId, "body", {
        body_color_id: bodyColorId,
        interior_color_id: interiorColorId ?? null,
        paintwork_status_id: paintworkStatusId,
      });
      const bodyColor = colors.find((c) => c.id === bodyColorId);
      const interiorColor = interiorColorId ? colors.find((c) => c.id === interiorColorId) : undefined;
      const paintworkStatus = paintworkStatuses.find((p) => p.id === paintworkStatusId);
      if (bodyColor && paintworkStatus) onComplete(listing, { bodyColor, interiorColor, paintworkStatus });
    } catch (err) {
      setError(err instanceof WizardApiError ? err.message : "خطای غیرمنتظره‌ای رخ داد.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <WizardStepShell title="وضعیت بدنه" subtitle="رنگ و وضعیت بدنه خودرو را مشخص کنید" error={error} onBack={onBack}>
      <div className="space-y-6">
        <div>
          <p className="mb-2.5 text-xs font-medium text-stone-500">رنگ بدنه</p>
          <ColorSwatchSelect colors={colors} value={bodyColorId} onChange={setBodyColorId} />
        </div>

        <div>
          <p className="mb-2.5 text-xs font-medium text-stone-500">رنگ داخل (اختیاری)</p>
          <ColorSwatchSelect colors={colors} value={interiorColorId} onChange={setInteriorColorId} allowClear />
        </div>

        <div>
          <p className="mb-2.5 text-xs font-medium text-stone-500">وضعیت رنگ بدنه</p>
          <TileSelect
            options={paintworkStatuses.map((status) => ({ value: status.id, label: status.name }))}
            value={paintworkStatusId}
            onChange={(value) => setPaintworkStatusId(Number(value))}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!isValid || isSubmitting}
        className="mt-6 w-full rounded-xl bg-orange px-5 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? "در حال ذخیره..." : "ادامه"}
      </button>
    </WizardStepShell>
  );
}
