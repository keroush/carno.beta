"use client";

import { useState } from "react";
import { WizardStepShell } from "@/components/dashboard/listing-wizard/WizardStepShell";
import { TileSelect } from "@/components/dashboard/listing-wizard/TileSelect";
import { wizardApi, WizardApiError } from "@/lib/listingWizardClient";
import type { CodedOption, ListingDraft, SaleType } from "@/types/listingDraft";

interface StepPriceProps {
  draftId: number;
  saleTypes: CodedOption<SaleType>[];
  selectedSaleType?: SaleType;
  selectedPrice?: number;
  selectedIsExchange?: boolean;
  onComplete: (listing: ListingDraft, values: { saleType: SaleType; price?: number; isExchange: boolean }) => void;
  onBack: () => void;
}

function formatWithCommas(digitsOnly: string): string {
  if (!digitsOnly) return "";
  return Number(digitsOnly).toLocaleString("en-US");
}

export function StepPrice({
  draftId,
  saleTypes,
  selectedSaleType,
  selectedPrice,
  selectedIsExchange,
  onComplete,
  onBack,
}: StepPriceProps) {
  const [saleType, setSaleType] = useState<SaleType | undefined>(selectedSaleType);
  const [priceDigits, setPriceDigits] = useState(selectedPrice ? String(selectedPrice) : "");
  const [isExchange, setIsExchange] = useState(selectedIsExchange ?? false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = saleType === "negotiable" || (saleType === "cash" && priceDigits.trim().length > 0);

  async function handleSubmit() {
    if (!saleType || !isValid) return;
    setError(null);
    setIsSubmitting(true);
    try {
      const payload: { sale_type: SaleType; price?: number; is_exchange: boolean } = {
        sale_type: saleType,
        is_exchange: isExchange,
      };
      if (saleType === "cash") payload.price = Number(priceDigits);

      const { listing } = await wizardApi.putStep(draftId, "price", payload);
      onComplete(listing, {
        saleType,
        price: saleType === "cash" ? Number(priceDigits) : undefined,
        isExchange,
      });
    } catch (err) {
      setError(err instanceof WizardApiError ? err.message : "خطای غیرمنتظره‌ای رخ داد.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <WizardStepShell title="قیمت" subtitle="نوع فروش و قیمت خودرو را مشخص کنید" error={error} onBack={onBack}>
      <TileSelect
        options={saleTypes.map((type) => ({ value: type.value, label: type.label }))}
        value={saleType}
        onChange={(value) => setSaleType(value as SaleType)}
        columns={2}
      />

      {saleType === "cash" && (
        <div className="mt-5">
          <label htmlFor="price" className="mb-1.5 block text-xs font-medium text-stone-500">
            قیمت (تومان)
          </label>
          <input
            id="price"
            inputMode="numeric"
            dir="ltr"
            value={formatWithCommas(priceDigits)}
            onChange={(event) => setPriceDigits(event.target.value.replace(/[^\d]/g, ""))}
            placeholder="1,450,000,000"
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-700 outline-none transition-colors placeholder:text-stone-300 focus:border-orange/40"
          />
        </div>
      )}

      <label className="mt-5 flex items-center gap-2.5 text-sm text-stone-600">
        <input
          type="checkbox"
          checked={isExchange}
          onChange={(event) => setIsExchange(event.target.checked)}
          className="h-4 w-4 rounded border-stone-300 text-orange focus:ring-orange/30"
        />
        قابل معاوضه است
      </label>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!saleType || !isValid || isSubmitting}
        className="mt-6 w-full rounded-xl bg-orange px-5 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? "در حال ذخیره..." : "ادامه"}
      </button>
    </WizardStepShell>
  );
}
