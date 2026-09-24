"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useFreeDragCarousel } from "@/components/useFreeDragCarousel";
import {
  ConvertibleIcon,
  CoupeIcon,
  CrossoverIcon,
  PickupIcon,
  VanIcon,
} from "@/components/BodyTypeIcons";

const bodyTypes = [
  { id: "van", label: "ون", Icon: VanIcon },
  { id: "convertible", label: "کروک", Icon: ConvertibleIcon },
  { id: "coupe", label: "کوپه", Icon: CoupeIcon },
  { id: "pickup", label: "وانت", Icon: PickupIcon },
  { id: "crossover", label: "کراس‌اوور", Icon: CrossoverIcon },
  { id: "sedan", label: "سدان", Icon: CoupeIcon },
  { id: "hatchback", label: "هاچبک", Icon: CrossoverIcon },
  { id: "suv", label: "شاسی‌بلند", Icon: CrossoverIcon },
] as const;

function getSlidesPerView(width: number): number {
  if (width >= 1280) return 7;
  if (width >= 1024) return 5;
  if (width >= 640) return 3.5;
  return 2.5;
}

export function BodyTypeSwiper() {
  const [slidesPerView, setSlidesPerView] = useState(6);

  const maxSlide = Math.max(0, bodyTypes.length - slidesPerView);
  const slideWidthPercent = 100 / slidesPerView;

  const {
    offsetPercent,
    isDragging,
    canGoPrev,
    canGoNext,
    stepBy,
    dragHandlers,
  } = useFreeDragCarousel({
    slideWidthPercent,
    maxSlideIndex: maxSlide,
  });

  useEffect(() => {
    function handleResize() {
      setSlidesPerView(getSlidesPerView(window.innerWidth));
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => stepBy(-1)}
        aria-label="نوع بدنه قبلی"
        disabled={!canGoPrev}
        className="shadow-bento absolute -right-1 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-stone-100 bg-white text-stone-400 transition-all duration-300 hover:text-orange disabled:opacity-30 lg:-right-4"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => stepBy(1)}
        aria-label="نوع بدنه بعدی"
        disabled={!canGoNext}
        className="shadow-bento absolute -left-1 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-stone-100 bg-white text-stone-400 transition-all duration-300 hover:text-orange disabled:opacity-30 lg:-left-4"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m15 19-7-7 7-7"
          />
        </svg>
      </button>

      <div className="overflow-hidden px-8">
        <div
          className={`flex ${dragHandlers.className} ${isDragging ? "" : "transition-transform duration-500 ease-out"}`}
          style={{
            transform: `translateX(${offsetPercent}%)`,
            ...dragHandlers.style,
          }}
          onPointerDown={dragHandlers.onPointerDown}
          onPointerMove={dragHandlers.onPointerMove}
          onPointerUp={dragHandlers.onPointerUp}
          onPointerCancel={dragHandlers.onPointerCancel}
          onPointerLeave={dragHandlers.onPointerLeave}
          onDragStart={dragHandlers.onDragStart}
        >
          {bodyTypes.map(({ id, label, Icon }) => (
            <div
              key={id}
              style={{ flex: `0 0 ${slideWidthPercent}%` }}
              className="px-1"
            >
              <Link
                href={`/listings?bodyType=${id}`}
                className="group flex flex-col items-center gap-3 py-4"
              >
                <Icon className="h-15 w-auto transition-transform duration-300 group-hover:-translate-y-1" />
                <span className="text-sm font-semibold text-stone-500 transition-colors group-hover:text-orange">
                  {label}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
