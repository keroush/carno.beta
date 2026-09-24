"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, Search, X } from "lucide-react";

interface SearchBarProps {
  debounceMs?: number;
}

export default function SearchBar({ debounceMs = 350 }: SearchBarProps) {
  const [value, setValue] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const query = value.trim();
    if (!query) return;
    timerRef.current = setTimeout(() => {
      router.prefetch(`/listings?q=${encodeURIComponent(query)}`);
    }, debounceMs);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, debounceMs]);

  const submit = () => {
    const query = value.trim();
    if (query) router.push(`/listings?q=${encodeURIComponent(query)}`);
  };

  return (
    <section aria-label="Search listings" className="relative overflow-hidden px-4 pb-6 pt-7 lg:px-8 lg:pb-10 lg:pt-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -left-10 h-56 w-56 rounded-full bg-[var(--color-orange)]/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-[var(--color-sky)]/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-semibold text-[var(--color-orange-deep)] shadow-sm ring-1 ring-[var(--color-border)] backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-orange)]" />
          A leasing marketplace you can trust
        </span>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-extrabold leading-tight tracking-tight text-[var(--color-text)] lg:text-4xl">
          Drive it today,{" "}
          <span className="text-[var(--color-orange)]">own the deal</span> tomorrow.
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-[var(--color-text-mute)] lg:text-base">
          Every listing is from a verified dealer, with transparent pricing and no surprise fees.
        </p>

        <div className="mt-5 flex items-center gap-2 lg:mt-7">
          <div className="card-soft flex flex-1 items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 lg:py-4">
            <button type="button" aria-label="Search" onClick={submit} className="shrink-0">
              <Search size={18} className="text-[var(--color-text-mute)]" />
            </button>
            <input
              type="text"
              inputMode="search"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
              placeholder="Search brand, model, or city"
              className="w-full bg-transparent text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-mute)] focus:outline-none lg:text-base"
            />
            {value.length > 0 && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setValue("")}
                className="shrink-0 text-[var(--color-text-mute)]"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            type="button"
            aria-label="Open filters"
            className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-full bg-[var(--color-orange)] text-white shadow-[0_10px_24px_-10px_rgba(255,159,67,0.7)] transition-transform hover:brightness-105 active:scale-95 lg:h-[54px] lg:w-[54px]"
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
