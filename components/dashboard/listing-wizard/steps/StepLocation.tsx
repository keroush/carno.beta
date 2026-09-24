"use client";

import { useMemo, useState } from "react";
import { WizardStepShell } from "@/components/dashboard/listing-wizard/WizardStepShell";
import { wizardApi, WizardApiError } from "@/lib/listingWizardClient";
import type { CityOption, ListingDraft, ProvinceOption } from "@/types/listingDraft";

interface StepLocationProps {
  draftId: number;
  provinces: ProvinceOption[];
  selectedProvinceId?: number;
  selectedCityId?: number;
  onComplete: (listing: ListingDraft, values: { province: ProvinceOption; city: CityOption }) => void;
  onBack: () => void;
}

export function StepLocation({ draftId, provinces, selectedProvinceId, selectedCityId, onComplete, onBack }: StepLocationProps) {
  const [provinceId, setProvinceId] = useState<number | undefined>(selectedProvinceId);
  const [cityId, setCityId] = useState<number | undefined>(selectedCityId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cities = useMemo(() => provinces.find((p) => p.id === provinceId)?.cities ?? [], [provinces, provinceId]);

  async function handleSubmit() {
    if (!provinceId || !cityId) return;
    setError(null);
    setIsSubmitting(true);
    try {
      const { listing } = await wizardApi.putStep(draftId, "location", { province_id: provinceId, city_id: cityId });
      const province = provinces.find((p) => p.id === provinceId);
      const city = cities.find((c) => c.id === cityId);
      if (province && city) onComplete(listing, { province, city });
    } catch (err) {
      setError(err instanceof WizardApiError ? err.message : "خطای غیرمنتظره‌ای رخ داد.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <WizardStepShell title="محل بازدید" subtitle="استان و شهر محل بازدید خودرو را انتخاب کنید" error={error} onBack={onBack}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="province" className="mb-1.5 block text-xs font-medium text-stone-500">
            استان
          </label>
          <select
            id="province"
            value={provinceId ?? ""}
            onChange={(event) => {
              setProvinceId(event.target.value ? Number(event.target.value) : undefined);
              setCityId(undefined);
            }}
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-700 outline-none transition-colors focus:border-orange/40"
          >
            <option value="">انتخاب کنید...</option>
            {provinces.map((province) => (
              <option key={province.id} value={province.id}>
                {province.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="city" className="mb-1.5 block text-xs font-medium text-stone-500">
            شهر
          </label>
          <select
            id="city"
            value={cityId ?? ""}
            disabled={!provinceId}
            onChange={(event) => setCityId(event.target.value ? Number(event.target.value) : undefined)}
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-700 outline-none transition-colors focus:border-orange/40 disabled:cursor-not-allowed disabled:bg-stone-50"
          >
            <option value="">انتخاب کنید...</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!provinceId || !cityId || isSubmitting}
        className="mt-6 w-full rounded-xl bg-orange px-5 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? "در حال ذخیره..." : "ادامه"}
      </button>
    </WizardStepShell>
  );
}
