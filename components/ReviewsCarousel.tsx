"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { BookmarkButton } from "@/components/BookmarkButton";
import type { ReviewArticle, ReviewTab } from "@/types/listing";

interface ReviewsCarouselProps {
  reviewsByTab: Record<ReviewTab, ReviewArticle[]>;
}

const tabDefs: { id: ReviewTab; label: string }[] = [
  { id: "new", label: "جدیدترین‌ها" },
  { id: "popular", label: "پربازدیدترین" },
  { id: "economy", label: "اقتصادی" },
  { id: "luxury", label: "لوکس" },
];

const authorTone: Record<ReviewArticle["authorTone"], string> = {
  orange: "bg-warm-50 text-orange",
  sky: "bg-sky-50 text-sky-400",
};

function getSlidesPerView(width: number): number {
  if (width >= 1024) return 3;
  if (width >= 640) return 2;
  return 1;
}

export function ReviewsCarousel({ reviewsByTab }: ReviewsCarouselProps) {
  const [activeTab, setActiveTab] = useState<ReviewTab>("new");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slides = reviewsByTab[activeTab];
  const maxSlide = Math.max(0, slides.length - slidesPerView);

  useEffect(() => {
    function handleResize() {
      setSlidesPerView(getSlidesPerView(window.innerWidth));
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setCurrentSlide((prev) => Math.min(prev, maxSlide));
  }, [maxSlide]);

  const advance = useCallback(() => {
    setCurrentSlide((prev) => (prev < maxSlide ? prev + 1 : 0));
  }, [maxSlide]);

  useEffect(() => {
    intervalRef.current = setInterval(advance, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [advance]);

  function handlePrev() {
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  }

  function handleNext() {
    setCurrentSlide((prev) => Math.min(maxSlide, prev + 1));
  }

  function handleTabChange(tab: ReviewTab) {
    setActiveTab(tab);
    setCurrentSlide(0);
  }

  function pauseAutoplay() {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  function resumeAutoplay() {
    pauseAutoplay();
    intervalRef.current = setInterval(advance, 6000);
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
              activeTab === tab.id ? "text-orange" : "text-stone-400 hover:text-stone-600"
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

      <div className="relative" onMouseEnter={pauseAutoplay} onMouseLeave={resumeAutoplay}>
        <button
          type="button"
          onClick={handlePrev}
          aria-label="بررسی قبلی"
          disabled={currentSlide === 0}
          className="shadow-bento absolute -right-1 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-stone-400 transition-all duration-300 hover:text-orange disabled:opacity-40 lg:-right-4"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={handleNext}
          aria-label="بررسی بعدی"
          disabled={currentSlide === maxSlide}
          className="shadow-bento absolute -left-1 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-stone-400 transition-all duration-300 hover:text-orange disabled:opacity-40 lg:-left-4"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m15 19-7-7 7-7" />
          </svg>
        </button>

        <div className="overflow-hidden rounded-[28px]">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(${currentSlide * (100 / slidesPerView)}%)` }}
          >
            {slides.map((review) => (
              <div key={review.id} className="w-full flex-shrink-0 px-2.5 sm:w-1/2 lg:w-1/3">
                <div className="shadow-card hover:shadow-card-hover group cursor-pointer overflow-hidden rounded-[24px] border border-transparent bg-white transition-all duration-[400ms] hover:border-orange/10">
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={review.image}
                      alt={review.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    />
                    <span className="glass-badge absolute top-3 left-3 rounded-lg border border-white/50 px-3 py-1 text-[10px] font-bold text-stone-700">
                      {review.category}
                    </span>
                    <BookmarkButton label={`ذخیره ${review.title}`} variant="glass" className="absolute top-3 right-3 h-9 w-9" />
                  </div>
                  <div className="p-5">
                    <h3 className="mb-2 text-base font-bold leading-snug text-stone-800">{review.title}</h3>
                    <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-stone-400">{review.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${authorTone[review.authorTone]}`}>
                          <span className="text-[10px] font-bold">{review.authorInitials}</span>
                        </div>
                        <span className="text-[11px] text-stone-400">{review.authorName}</span>
                      </div>
                      <span className="text-[11px] text-stone-300">{review.views} بازدید</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
