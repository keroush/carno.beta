"use client";

import { useEffect, useState } from "react";
import { ListingCard } from "@/components/ListingCard";
import { ShowAllCard } from "@/components/ShowAllCard";
import { useFreeDragCarousel } from "@/components/useFreeDragCarousel";
import type { CarListing } from "@/types/listing";

interface ListingsCarouselProps {
  listings: CarListing[];
  showAllHref: string;
}

function getSlidesPerView(width: number): number {
  if (width >= 1280) return 4.2;
  if (width >= 1024) return 3.3;
  if (width >= 640) return 2.3;
  return 1.25;
}

export function ListingsCarousel({
  listings,
  showAllHref,
}: ListingsCarouselProps) {
  const [slidesPerView, setSlidesPerView] = useState(4.2);

  // Real ads, plus one trailing "show all" slide.
  const totalSlides = listings.length + 1;
  const maxSlide = Math.max(0, totalSlides - 1);
  const slideWidthPercent = 100 / slidesPerView;

  const {
    offsetPercent,
    isDragging,
    activeIndex,
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

  return (
    <div className="relative">
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
          <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
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

      <div className="overflow-hidden py-3 pb-10">
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
          {listings.map((listing, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={listing.id}
                style={{ flex: `0 0 ${slideWidthPercent}%` }}
                className="px-0.8"
              >
                <div
                  className={`h-full origin-center transition-all duration-500 ease-out ${
                    isActive ? "pl-1 z-10 scale-[1]" : "scale-[0.95] opacity-80"
                  }`}
                >
                  <ListingCard listing={listing} />
                </div>
              </div>
            );
          })}

          <div
            style={{ flex: `0 0 ${slideWidthPercent}%` }}
            className="px-2 sm:px-2.5"
          >
            <div
              className={`h-full origin-center transition-all duration-500 ease-out ${
                activeIndex === listings.length
                  ? "z-10 scale-[1.06]"
                  : "scale-[0.94] opacity-80"
              }`}
            >
              <ShowAllCard href={showAllHref} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
