"use client";

import { ListingCard } from "@/components/ListingCard";
import { ShowAllCard } from "@/components/ShowAllCard";
import { useDragCarousel } from "@/components/useDragCarousel";
import type { CarListing } from "@/types/listing";

interface ListingsCarouselProps {
  listings: CarListing[];
  showAllHref: string;
}

/**
 * Slide width is pure CSS (how many cards fit): ~1.7 on phones so the next card
 * clearly peeks in, then 2.3 / 3.3 / 4.2. The drag hook measures the result, so
 * there's no JS copy of these numbers to keep in sync.
 */
const SLIDE_BASIS =
  "shrink-0 grow-0 basis-[calc(100%/1.7)] sm:basis-[calc(100%/2.3)] lg:basis-[calc(100%/3.3)] xl:basis-[calc(100%/4.2)]";

export function ListingsCarousel({
  listings,
  showAllHref,
}: ListingsCarouselProps) {
  // Real ads, plus one trailing "show all" slide.
  const totalSlides = listings.length + 1;

  const { trackProps, activeIndex, stepBy, canGoPrev, canGoNext } = useDragCarousel({
    slideCount: totalSlides,
  });

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => stepBy(-1)}
        aria-label="آگهی قبلی"
        disabled={!canGoPrev}
        className="shadow-bento absolute -right-1 top-[84px] z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-stone-400 transition-all duration-300 hover:text-orange disabled:opacity-40 sm:top-1/2 sm:h-11 sm:w-11 lg:-right-4"
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
        className="shadow-bento absolute -left-1 top-[84px] z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-stone-400 transition-all duration-300 hover:text-orange disabled:opacity-40 sm:top-1/2 sm:h-11 sm:w-11 lg:-left-4"
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
          {...trackProps}
          className="flex cursor-grab select-none active:cursor-grabbing [&_a]:[-webkit-user-drag:none] [&_img]:[-webkit-user-drag:none]"
        >
          {listings.map((listing, index) => {
            const isActive = index === activeIndex;
            return (
              <div key={listing.id} className={`${SLIDE_BASIS} px-0.8`}>
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

          <div className={`${SLIDE_BASIS} px-2 sm:px-2.5`}>
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
