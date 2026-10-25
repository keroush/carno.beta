"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/** Pages where the button would be redundant or would sit on top of the page's own actions. */
const HIDDEN_ON = ["/dashboard/listing", "/login"];
/** Always expanded this close to the top of the page. */
const ALWAYS_EXPANDED_UNDER_PX = 80;
/** Scroll movement needed (in either direction) before the button reacts — ignores jitter. */
const DIRECTION_THRESHOLD_PX = 8;

/**
 * Small-screen replacement for the header's «ثبت آگهی رایگان» button (the header one is
 * hidden below md). Sits at the bottom-left, shrinks to just its icon while the user scrolls
 * down, and expands again when they scroll up or return near the top.
 *
 * It is rendered next to — not inside — the <nav>: the nav gets a backdrop-filter once the
 * page scrolls, and a backdrop-filter makes `position: fixed` descendants anchor to the nav
 * instead of the viewport.
 */
export function PostAdFab() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);
  const anchorY = useRef(0);

  useEffect(() => {
    anchorY.current = window.scrollY;
    let frame = 0;

    function update() {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      if (y < ALWAYS_EXPANDED_UNDER_PX) {
        setExpanded(true);
        anchorY.current = y;
        return;
      }
      // Compare against the last position that *triggered* a change, so slow scrolling still adds up.
      const delta = y - anchorY.current;
      if (delta > DIRECTION_THRESHOLD_PX) {
        setExpanded(false);
        anchorY.current = y;
      } else if (delta < -DIRECTION_THRESHOLD_PX) {
        setExpanded(true);
        anchorY.current = y;
      }
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  if (HIDDEN_ON.some((path) => pathname === path || pathname.startsWith(`${path}/`))) return null;

  return (
    <Link
      href="/dashboard/listing"
      aria-label="ثبت آگهی رایگان"
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-4 z-40 flex h-12 flex-row-reverse items-center overflow-hidden rounded-full bg-orange text-white shadow-[0_8px_24px_rgba(255,159,67,0.35),0_2px_8px_rgba(0,0,0,0.12)] transition-transform duration-200 active:scale-95 md:hidden"
    >
      <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center">
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </span>
      <span
        className={`overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 ease-out motion-reduce:transition-none ${
          expanded ? "max-w-[10rem] ps-5 opacity-100" : "max-w-0 ps-0 opacity-0"
        }`}
      >
        ثبت آگهی رایگان
      </span>
    </Link>
  );
}
