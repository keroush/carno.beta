"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ListingCard } from "@/components/ListingCard";
import { ShowAllCard } from "@/components/ShowAllCard";
import { useFreeDragCarousel } from "@/components/useFreeDragCarousel";
import type { AdCategoryTab, CarListing } from "@/types/listing";

interface FeaturedAdsCarouselProps {
  adsByTab: Record<AdCategoryTab, CarListing[]>;
}

const CATEGORY_TO_SORT: Record<AdCategoryTab, string> = {
  new: "newest",
  popular: "newest",
  economy: "price_asc",
  luxury: "price_desc",
};

const tabDefs: { id: AdCategoryTab; label: string }[] = [
  { id: "new", label: "جدیدترین‌ها" },
  { id: "popular", label: "پربازدیدترین" },
  { id: "economy", label: "اقتصادی" },
  { id: "luxury", label: "لوکس" },
];

function getSlidesPerView(width: number): number {
  if (width >= 1024) return 3;
  if (width >= 640) return 2;
  return 1;
}

export function FeaturedAdsCarousel({ adsByTab }: FeaturedAdsCarouselProps) {
  const [activeTab, setActiveTab] = useState<AdCategoryTab>("new");
  const [slidesPerView, setSlidesPerView] = useState(3);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const ads = adsByTab[activeTab];
  // Real ads, plus one trailing "show all" slide.
  const totalSlides = ads.length + 1;
  const maxSlide = Math.max(0, totalSlides - slidesPerView);
  const slideWidthPercent = 100 / slidesPerView;

  const {
    offsetPercent,
    isDragging,
    activeIndex,
    goToIndex,
    stepBy,
    canGoPrev,
    canGoNext,
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

  const advance = useCallback(() => {
    goToIndex(activeIndex < maxSlide ? activeIndex + 1 : 0);
  }, [activeIndex, goToIndex, maxSlide]);

  useEffect(() => {
    if (isHovering || isDragging) return undefined;
    intervalRef.current = setInterval(advance, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [advance, isHovering, isDragging]);

  function handleTabChange(tab: AdCategoryTab) {
    setActiveTab(tab);
    goToIndex(0);
  }

  return (
    <div>
      <div className="mb-10 flex flex-wrap items-center justify-center gap-1">
        {tabDefs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabChange(tab.id)}
            className={`relative rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors duration-300 ${
              activeTab === tab.id
                ? "text-orange"
                : "text-stone-400 hover:text-stone-600"
            }`}
          >
            <span className="relative">
              {tab.label}
              <span
                className={`absolute -bottom-1.5 right-0 h-[2.5px] w-full rounded-full bg-orange transition-transform duration-300 ${
                  activeTab === tab.id ? "scale-x-100" : "scale-x-0"
                }`}
                style={{ transformOrigin: "right" }}
              />
            </span>
          </button>
        ))}
      </div>

      <div
        className="relative"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <button
          type="button"
          onClick={() => stepBy(-1)}
          aria-label="آگهی قبلی"
          disabled={!canGoPrev}
          className="shadow-bento absolute -right-1 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-stone-400 transition-all duration-300 hover:text-orange disabled:opacity-40 lg:-right-4"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9 5 7 7-7 7"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => stepBy(1)}
          aria-label="آگهی بعدی"
          disabled={!canGoNext}
          className="shadow-bento absolute -left-1 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-stone-400 transition-all duration-300 hover:text-orange disabled:opacity-40 lg:-left-4"
        >
          <svg
            className="h-5 w-5"
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

        <div className="overflow-hidden rounded-[28px]">
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
            {ads.map((ad) => (
              <div
                key={ad.id}
                className="w-full flex-shrink-0 px-2.5 sm:w-1/2 lg:w-1/3"
              >
                <ListingCard listing={ad} />
              </div>
            ))}
            <div className="w-full flex-shrink-0 px-2.5 sm:w-1/2 lg:w-1/3">
              <ShowAllCard href={`/listings?sort=${CATEGORY_TO_SORT[activeTab]}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
