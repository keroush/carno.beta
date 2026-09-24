"use client";

import { useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SwiperTrackProps {
  children: ReactNode[];
  showDots?: boolean;
  ariaLabel: string;
}

/**
 * Native swiper: CSS scroll-snap drives the motion on touch, and a
 * small client island adds the dot indicator plus desktop prev/next
 * arrows (mouse users don't reach for touch-drag) — no external
 * carousel dependency required.
 */
export default function SwiperTrack({ children, showDots = true, ariaLabel }: SwiperTrackProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const frame = useRef<number | null>(null);

  const cardStep = () => {
    const track = trackRef.current;
    if (!track) return 264;
    const width = track.firstElementChild?.getBoundingClientRect().width ?? 264;
    return width + 16;
  };

  const handleScroll = () => {
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const track = trackRef.current;
      if (!track) return;
      const index = Math.round(track.scrollLeft / cardStep());
      setActiveIndex(Math.min(index, children.length - 1));
    });
  };

  const scrollBy = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * cardStep(), behavior: "smooth" });
  };

  return (
    <div className="group/track relative">
      <div
        ref={trackRef}
        role="list"
        aria-label={ariaLabel}
        onScroll={handleScroll}
        className="no-scrollbar snap-x-mandatory flex gap-4 overflow-x-auto px-4 pb-1 lg:px-8"
      >
        {children.map((child, i) => (
          <div role="listitem" key={i} className="snap-start">
            {child}
          </div>
        ))}
      </div>

      {children.length > 2 && (
        <>
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scrollBy(-1)}
            className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-[var(--color-surface)] p-2 text-[var(--color-text-dim)] opacity-0 shadow-md ring-1 ring-[var(--color-border)] transition-opacity group-hover/track:opacity-100 hover:text-[var(--color-orange)] lg:block"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scrollBy(1)}
            className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-[var(--color-text)] p-2 text-white opacity-0 shadow-md transition-opacity group-hover/track:opacity-100 hover:bg-[var(--color-orange)] lg:block"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {showDots && children.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-1.5 lg:hidden">
          {children.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-5 bg-[var(--color-orange)]" : "w-1.5 bg-[var(--color-border)]"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
