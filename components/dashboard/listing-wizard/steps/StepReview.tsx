"use client";

import { useState } from "react";
import { wizardApi, WizardApiError } from "@/lib/listingWizardClient";
import { MISSING_FIELD_TO_STEP, WIZARD_STEPS } from "@/lib/wizardSteps";
import type { ListingDraft } from "@/types/listingDraft";
import type { WizardSelections } from "@/components/dashboard/listing-wizard/types";

interface StepReviewProps {
  draftId: number;
  draft: ListingDraft;
  selections: WizardSelections;
  onSubmitted: (message: string) => void;
  onJumpToStep: (step: number) => void;
  onBack: () => void;
}

function toPersianDigits(value: string | number): string {
  const digits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(value)
    .split("")
    .map((char) => digits[Number(char)] ?? char)
    .join("");
}

function formatPrice(price?: number): string {
  if (!price) return "—";
  return `${toPersianDigits(price.toLocaleString("en-US"))} تومان`;
}

export function StepReview({ draftId, draft, selections, onSubmitted, onJumpToStep, onBack }: StepReviewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [missingStepIds, setMissingStepIds] = useState<number[]>([]);

  const summaryRows: { label: string; value: string }[] = [
    { label: "برند و مدل", value: [selections.brandName, selections.modelName].filter(Boolean).join(" / ") || "—" },
    { label: "سال ساخت", value: selections.year ? toPersianDigits(selections.year) : "—" },
    { label: "تیپ", value: selections.trimLabel ?? "—" },
    {
      label: "کارکرد",
      value:
        selections.usageType === "used"
          ? `کارکرده — ${toPersianDigits(selections.mileage ?? 0)} کیلومتر`
          : selections.usageType === "pre_sale"
            ? `پیش‌فروش — تحویل ${selections.deliveryDate ?? "—"}`
            : selections.usageType === "zero"
              ? "صفر کیلومتر"
              : "—",
    },
    {
      label: "رنگ بدنه",
      value: [selections.bodyColorName, selections.interiorColorName ? `(داخل: ${selections.interiorColorName})` : null]
        .filter(Boolean)
        .join(" "),
    },
    { label: "وضعیت رنگ", value: selections.paintworkStatusName ?? "—" },
    { label: "محل بازدید", value: [selections.provinceName, selections.cityName].filter(Boolean).join(" - ") || "—" },
    {
      label: "قیمت",
      value: selections.saleType === "negotiable" ? "توافقی" : formatPrice(selections.price),
    },
    { label: "قابل معاوضه", value: selections.isExchange ? "بله" : "خیر" },
    { label: "توضیحات", value: selections.description && selections.description.length > 0 ? selections.description : "—" },
    { label: "تصاویر", value: `${toPersianDigits(draft.images.length)} عکس` },
  ];

  async function handleSubmit() {
    setError(null);
    setMissingStepIds([]);
    setIsSubmitting(true);
    try {
      const { message } = await wizardApi.submit(draftId);
      onSubmitted(message);
    } catch (err) {
      if (err instanceof WizardApiError) {
        const missing = err.missingFields ?? [];
        const stepIds = Array.from(
          new Set(missing.map((field) => MISSING_FIELD_TO_STEP[field]).filter((id): id is number => typeof id === "number")),
        );
        setMissingStepIds(stepIds);
        setError(err.message || "برخی فیلدهای الزامی تکمیل نشده‌اند.");
      } else {
        setError("خطای غیرمنتظره‌ای رخ داد.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="shadow-bento mx-auto w-full max-w-2xl rounded-[28px] border border-transparent bg-white p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-stone-800 sm:text-xl">بازبینی و ثبت نهایی</h2>
        <p className="mt-1 text-xs text-stone-400">اطلاعات آگهی را بررسی کنید و در صورت درستی، ثبت نهایی را بزنید</p>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs text-red-600">
          <p className="mb-2">{error}</p>
          {missingStepIds.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {missingStepIds.map((stepId) => {
                const step = WIZARD_STEPS.find((s) => s.id === stepId);
                if (!step) return null;
                return (
                  <button
                    key={stepId}
                    type="button"
                    onClick={() => onJumpToStep(stepId)}
                    className="rounded-lg border border-red-200 bg-white px-3 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-100"
                  >
                    برگشت به «{step.shortLabel}»
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      <dl className="divide-y divide-stone-50">
        {summaryRows.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-2.5 text-sm">
            <dt className="text-stone-400">{row.label}</dt>
            <dd className="font-semibold text-stone-700">{row.value}</dd>
          </div>
        ))}
      </dl>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="mt-6 w-full rounded-xl bg-orange px-5 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "در حال ثبت..." : "ثبت نهایی آگهی"}
      </button>

      <button type="button" onClick={onBack} className="mt-4 block text-xs font-medium text-stone-400 transition-colors hover:text-stone-600">
        ← بازگشت به مرحله قبل
      </button>
    </div>
  );
}
