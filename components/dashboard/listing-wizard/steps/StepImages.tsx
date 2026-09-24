"use client";

import { useRef, useState } from "react";
import { wizardApi, WizardApiError } from "@/lib/listingWizardClient";
import { WizardStepShell } from "@/components/dashboard/listing-wizard/WizardStepShell";
import type { ListingImage } from "@/types/listingDraft";

interface StepImagesProps {
  draftId: number;
  images: ListingImage[];
  onImagesChange: (images: ListingImage[]) => void;
  onContinue: () => void;
  onBack: () => void;
}

const MAX_IMAGES = 5;
const MAX_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export function StepImages({ draftId, images, onImagesChange, onContinue, onBack }: StepImagesProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (images.length >= MAX_IMAGES) {
      setError("حداکثر ۵ عکس برای هر آگهی مجاز است.");
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("فرمت تصویر مجاز نیست. فقط jpg، jpeg، png و webp پذیرفته می‌شود.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError("حجم تصویر نباید بیشتر از ۱۰ مگابایت باشد.");
      return;
    }

    setError(null);
    setIsUploading(true);
    try {
      const { listing } = await wizardApi.uploadImage(draftId, file);
      onImagesChange(listing.images);
    } catch (err) {
      setError(err instanceof WizardApiError ? err.message : "بارگذاری تصویر با خطا مواجه شد.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDelete(imageId: number) {
    setError(null);
    setDeletingId(imageId);
    try {
      const { listing } = await wizardApi.deleteImage(draftId, imageId);
      onImagesChange(listing.images);
    } catch (err) {
      setError(err instanceof WizardApiError ? err.message : "حذف تصویر با خطا مواجه شد.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <WizardStepShell title="تصاویر" subtitle="حداکثر ۵ عکس، تا ۱۰ مگابایت هر عکس (jpg، png، webp) — اختیاری" error={error} onBack={onBack}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((image) => (
          <div key={image.id} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.path} alt="تصویر آگهی" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => handleDelete(image.id)}
              disabled={deletingId === image.id}
              className="absolute top-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-stone-500 shadow-sm transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
              aria-label="حذف تصویر"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}

        {images.length < MAX_IMAGES && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex aspect-[4/3] flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-stone-300 text-stone-400 transition-colors hover:border-orange/30 hover:text-orange disabled:opacity-50"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span className="text-xs font-semibold">{isUploading ? "در حال بارگذاری..." : "افزودن عکس"}</span>
          </button>
        )}
      </div>

      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />

      <p className="mt-3 text-[11px] text-stone-400">
        {images.length} از {MAX_IMAGES} عکس
      </p>

      <button
        type="button"
        onClick={onContinue}
        className="mt-5 w-full rounded-xl bg-orange px-5 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 sm:w-auto"
      >
        {images.length > 0 ? "ادامه" : "رد کردن این مرحله"}
      </button>
    </WizardStepShell>
  );
}
