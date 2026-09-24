"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { searchHero } from "@/lib/searchClient";
import { useFreeDragCarousel } from "@/components/useFreeDragCarousel";
import { formatPriceToman, toPersianDigits } from "@/lib/persianNumber";
import type { SearchListingCard } from "@/types/search";
import Image from "next/image";

const popularTags = ["سانتافه", "پژو ۲۰۶", "تارا", "تیگو ۷"];

function getSlidesPerView(width: number): number {
  if (width >= 640) return 3.3;
  return 1.6;
}

function ResultsSwiper({ results, onSelect }: { results: SearchListingCard[]; onSelect: () => void }) {
  const [slidesPerView, setSlidesPerView] = useState(3.3);
  const maxSlide = Math.max(0, results.length - slidesPerView);
  const slideWidthPercent = 100 / slidesPerView;

  const { offsetPercent, isDragging, canGoPrev, canGoNext, stepBy, dragHandlers } = useFreeDragCarousel({
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
    <div className="relative py-3 pr-3 pl-3">
      {canGoPrev && (
        <button
          type="button"
          onClick={() => stepBy(-1)}
          aria-label="نتیجه قبلی"
          className="absolute right-0 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-stone-400 shadow-md hover:text-orange"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
          </svg>
        </button>
      )}
      {canGoNext && (
        <button
          type="button"
          onClick={() => stepBy(1)}
          aria-label="نتیجه بعدی"
          className="absolute left-0 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-stone-400 shadow-md hover:text-orange"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m15 19-7-7 7-7" />
          </svg>
        </button>
      )}

      <div className="overflow-hidden">
        <div
          className={`flex ${dragHandlers.className} ${isDragging ? "" : "transition-transform duration-300 ease-out"}`}
          style={{ transform: `translateX(${offsetPercent}%)`, ...dragHandlers.style }}
          onPointerDown={dragHandlers.onPointerDown}
          onPointerMove={dragHandlers.onPointerMove}
          onPointerUp={dragHandlers.onPointerUp}
          onPointerCancel={dragHandlers.onPointerCancel}
          onPointerLeave={dragHandlers.onPointerLeave}
          onDragStart={dragHandlers.onDragStart}
        >
          {results.map((item) => (
            <div key={item.id} style={{ flex: `0 0 ${slideWidthPercent}%` }} className="px-1.5">
              <Link
                href={`/listings/${item.id}`}
                onClick={onSelect}
                className="block overflow-hidden rounded-xl border border-stone-100 bg-white transition-colors hover:border-orange/20"
              >
                <div className="relative h-20 w-full overflow-hidden bg-stone-100">
                  <Image src={item.cover_image} alt={item.title} fill sizes="180px" className="object-cover" />
                </div>
                <div className="p-2.5">
                  <p className="truncate text-xs font-semibold text-stone-700">{item.title}</p>
                  <p className="mb-1 text-[10px] text-stone-400">
                    {toPersianDigits(item.year)} — {item.city}
                  </p>
                  <p className="text-[11px] font-bold text-orange">{formatPriceToman(item.price)}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchListingCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const controller = new AbortController();
    const handle = setTimeout(async () => {
      try {
        const { data } = await searchHero(trimmed, controller.signal);
        setResults(data);
        setIsOpen(true);
      } catch {
        // Aborted or failed — just leave the previous results as-is.
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => {
      clearTimeout(handle);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length === 0) return;
    setIsOpen(false);
    router.push(`/listings?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div ref={containerRef} className="relative z-30 mx-auto max-w-2xl">
      <form
        onSubmit={handleSubmit}
        className="shadow-bento relative z-10 flex items-center gap-2 rounded-2xl border border-stone-100/80 bg-white p-2"
      >
        <div className="flex flex-1 items-center gap-3 px-3">
          {isLoading ? (
            <svg className="h-[18px] w-[18px] flex-shrink-0 animate-spin text-orange" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={2.5} />
              <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" />
            </svg>
          ) : (
            <svg className="h-[18px] w-[18px] flex-shrink-0 text-stone-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          )}
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            placeholder="جستجوی برند، مدل، یا سال ساخت..."
            className="font-vazir w-full bg-transparent py-2.5 text-sm text-stone-700 outline-none placeholder:text-stone-300"
          />
        </div>
        <button type="submit" className="rounded-xl bg-orange px-6 py-2.5 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5">
          جستجو
        </button>
      </form>

      {isOpen && (
        <div className="shadow-bento-hover absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-stone-100 bg-white">
          {results.length === 0 ? (
            <p className="p-4 text-center text-xs text-stone-400">{isLoading ? "در حال جستجو..." : "نتیجه‌ای یافت نشد."}</p>
          ) : (
            <ResultsSwiper results={results} onSelect={() => setIsOpen(false)} />
          )}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-stone-400">پرطرفدار:</span>
        {popularTags.map((tag) => (
          <Link
            key={tag}
            href={`/listings?q=${encodeURIComponent(tag)}`}
            className="rounded-lg border border-stone-100 bg-white/60 px-3 py-1 text-xs text-stone-500 transition-all hover:border-orange/30 hover:text-orange"
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
}
