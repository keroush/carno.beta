"use client";

import { useState } from "react";
import { WizardStepShell } from "@/components/dashboard/listing-wizard/WizardStepShell";
import { TileSelect } from "@/components/dashboard/listing-wizard/TileSelect";
import { wizardApi, WizardApiError } from "@/lib/listingWizardClient";
import type { CodedOption, ListingDraft, UsageType } from "@/types/listingDraft";

interface StepUsageProps {
  draftId: number;
  usageTypes: CodedOption<UsageType>[];
  selectedUsageType?: UsageType;
  selectedMileage?: number;
  selectedDeliveryDate?: string;
  onComplete: (listing: ListingDraft, values: { usageType: UsageType; mileage?: number; deliveryDate?: string }) => void;
  onBack: () => void;
}

export function StepUsage({
  draftId,
  usageTypes,
  selectedUsageType,
  selectedMileage,
  selectedDeliveryDate,
  onComplete,
  onBack,
}: StepUsageProps) {
  const [usageType, setUsageType] = useState<UsageType | undefined>(selectedUsageType);
  const [mileage, setMileage] = useState(selectedMileage ? String(selectedMileage) : "");
  const [deliveryDate, setDeliveryDate] = useState(selectedDeliveryDate ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function isValid(): boolean {
    if (!usageType) return false;
    if (usageType === "used") return mileage.trim().length > 0;
    if (usageType === "pre_sale") return deliveryDate.trim().length > 0;
    return true;
  }

  async function handleSubmit() {
    if (!usageType || !isValid()) return;
    setError(null);
    setIsSubmitting(true);
    try {
      const payload: { usage_type: UsageType; mileage?: number; delivery_date?: string } = { usage_type: usageType };
      if (usageType === "used") payload.mileage = Number(mileage);
      if (usageType === "pre_sale") payload.delivery_date = deliveryDate;

      const { listing } = await wizardApi.putStep(draftId, "usage", payload);
      onComplete(listing, {
        usageType,
        mileage: usageType === "used" ? Number(mileage) : undefined,
        deliveryDate: usageType === "pre_sale" ? deliveryDate : undefined,
      });
    } catch (err) {
      setError(err instanceof WizardApiError ? err.message : "خطای غیرمنتظره‌ای رخ داد.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <WizardStepShell title="کارکرد" subtitle="وضعیت کارکرد خودرو را مشخص کنید" error={error} onBack={onBack}>
      <TileSelect
        options={usageTypes.map((type) => ({ value: type.value, label: type.label }))}
        value={usageType}
        onChange={(value) => setUsageType(value as UsageType)}
      />

      {usageType === "used" && (
        <div className="mt-5">
          <label htmlFor="mileage" className="mb-1.5 block text-xs font-medium text-stone-500">
            کارکرد (کیلومتر)
          </label>
          <input
            id="mileage"
            inputMode="numeric"
            dir="ltr"
            value={mileage}
            onChange={(event) => setMileage(event.target.value.replace(/[^\d]/g, ""))}
            placeholder="42000"
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-700 outline-none transition-colors placeholder:text-stone-300 focus:border-orange/40"
          />
        </div>
      )}

      {usageType === "pre_sale" && (
        <div className="mt-5">
          <label htmlFor="deliveryDate" className="mb-1.5 block text-xs font-medium text-stone-500">
            تاریخ تحویل
          </label>
          <input
            id="deliveryDate"
            type="date"
            dir="ltr"
            value={deliveryDate}
            onChange={(event) => setDeliveryDate(event.target.value)}
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-700 outline-none transition-colors focus:border-orange/40"
          />
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!isValid() || isSubmitting}
        className="mt-5 w-full rounded-xl bg-orange px-5 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? "در حال ذخیره..." : "ادامه"}
      </button>
    </WizardStepShell>
  );
}
