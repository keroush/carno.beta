"use client";

import { useState } from "react";
import Image from "next/image";
import type { ListingImageDetail } from "@/types/listingDetail";

interface ListingGalleryProps {
  images: ListingImageDetail[];
  title: string;
}

export function ListingGallery({ images, title }: ListingGalleryProps) {
  const sorted = [...images].sort((a, b) => a.order - b.order);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = sorted[activeIndex];

  if (sorted.length === 0 || !activeImage) {
    return (
      <div className="shadow-card flex h-72 items-center justify-center rounded-[24px] bg-stone-100 text-sm text-stone-400 sm:h-96">
        بدون تصویر
      </div>
    );
  }

  return (
    <div>
      <div className="shadow-card relative h-72 overflow-hidden rounded-[24px] bg-stone-100 sm:h-96">
        <Image
          src={activeImage.path}
          alt={`${title} — تصویر ${activeIndex + 1}`}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
          priority
        />
      </div>

      {sorted.length > 1 && (
        <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
          {sorted.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                index === activeIndex ? "border-orange" : "border-transparent"
              }`}
            >
              <Image src={image.path} alt={`${title} — بندانگشتی ${index + 1}`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
