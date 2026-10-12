"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { searchSuggestions } from "@/lib/searchClient";
import { toPersianDigits } from "@/lib/persianNumber";
import type { SearchSuggestion } from "@/types/search";

const popularTags = ["سانتافه", "پژو ۲۰۶", "تارا", "تیگو ۷"];

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 350;

export function SearchBar() {
  const router = useRouter();
  const listId = useId();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Picking a suggestion fills the input with its text — that must not kick
  // off another suggestions lookup (and re-open the dropdown) for that text.
  const skipNextFetchRef = useRef(false);

  useEffect(() => {
    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false;
      return undefined;
    }

    const trimmed = query.trim();
    if (trimmed.length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setIsLoading(false);
      setIsOpen(false);
      setActiveIndex(-1);
      return undefined;
    }

    setIsLoading(true);
    const controller = new AbortController();
    const handle = setTimeout(async () => {
      try {
        const results = await searchSuggestions(trimmed, controller.signal);
        if (controller.signal.aborted) return;
        setSuggestions(results);
        setActiveIndex(-1);
        // Per the API doc: an empty list means hide the dropdown entirely and
        // just let the user submit the free-text search directly, rather than
        // showing an empty / "no results" panel.
        setIsOpen(results.length > 0);
      } catch {
        if (controller.signal.aborted) return;
        setSuggestions([]);
        setIsOpen(false);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(handle);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function goToResults(text: string) {
    setIsOpen(false);
    setActiveIndex(-1);
    router.push(`/listings?q=${encodeURIComponent(text)}`);
  }

  function selectSuggestion(text: string) {
    skipNextFetchRef.current = true;
    setQuery(text);
    goToResults(text);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const active = isOpen ? suggestions[activeIndex] : undefined;
    if (active) {
      selectSuggestion(active.text);
      return;
    }
    const trimmed = query.trim();
    if (trimmed.length === 0) return;
    goToResults(trimmed);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }
    if (suggestions.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((index) => (index + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((index) => (index <= 0 ? suggestions.length - 1 : index - 1));
    }
  }

  const showDropdown = isOpen && suggestions.length > 0;

  return (
    <div ref={containerRef} className="relative z-30 mx-auto max-w-2xl">
      <form
        role="search"
        onSubmit={handleSubmit}
        className="shadow-bento relative z-10 flex items-center gap-2 rounded-2xl border border-stone-100/80 bg-white p-2"
      >
        <div className="flex flex-1 items-center gap-3 px-3">
          {isLoading ? (
            <svg className="h-[18px] w-[18px] flex-shrink-0 animate-spin text-orange" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={2.5} />
              <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" />
            </svg>
          ) : (
            <svg className="h-[18px] w-[18px] flex-shrink-0 text-stone-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          )}
          <input
            type="text"
            role="combobox"
            aria-expanded={showDropdown}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={showDropdown && activeIndex >= 0 ? `${listId}-opt-${activeIndex}` : undefined}
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setIsOpen(true)}
            placeholder="جستجوی برند، مدل، یا سال ساخت..."
            className="font-vazir w-full bg-transparent py-2.5 text-sm text-stone-700 outline-none placeholder:text-stone-300"
          />
        </div>
        <button type="submit" className="rounded-xl bg-orange px-6 py-2.5 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5">
          جستجو
        </button>
      </form>

      {showDropdown && (
        <ul
          id={listId}
          role="listbox"
          className="shadow-bento-hover absolute inset-x-0 top-full z-20 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-stone-100 bg-white py-2"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.text}
              id={`${listId}-opt-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => selectSuggestion(suggestion.text)}
              className={`flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 transition-colors ${
                index === activeIndex ? "bg-warm-50/80" : ""
              }`}
            >
              <span className="flex min-w-0 items-center gap-2 text-sm text-stone-700">
                <svg className="h-4 w-4 flex-shrink-0 text-stone-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <span className="truncate">{suggestion.text}</span>
              </span>
              <span className="flex-shrink-0 text-[11px] text-stone-300">{toPersianDigits(suggestion.listings_count)} آگهی</span>
            </li>
          ))}
        </ul>
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
