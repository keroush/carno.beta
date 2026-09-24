"use client";

import { useEffect, useState } from "react";
import { getListingsByUsageType } from "@/lib/api";
import { Listing, UsageType } from "@/lib/types";
import ListingCarousel from "./ListingCarousel";
import { CarouselSkeleton } from "./Skeletons";

const TABS: { key: UsageType; label: string }[] = [
  { key: "zero", label: "صفر کیلومتر" },
  { key: "used", label: "کارکرده" },
  { key: "pre_sale", label: "پیش‌فروش" },
];

export default function TabbedListings() {
  const [activeTab, setActiveTab] = useState<UsageType>("zero");
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getListingsByUsageType(activeTab)
      .then((data) => {
        if (!cancelled) setListings(data);
      })
      .catch(() => {
        if (!cancelled) setError("بارگذاری آگهی‌ها با خطا مواجه شد.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  return (
    <div>
      <div
        role="tablist"
        aria-label="نوع آگهی"
        className="mb-4 inline-flex gap-1 rounded-2xl bg-sky-100 p-1"
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            type="button"
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={
              "focus-ring rounded-xl px-4 py-2 text-sm font-semibold transition-colors " +
              (activeTab === tab.key
                ? "bg-orange-500 text-white shadow-bento-sm"
                : "text-ink-700 hover:text-ink-900")
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading && <CarouselSkeleton />}

      {!isLoading && error && (
        <p className="bento-card p-6 text-center text-sm text-orange-600">
          {error}
        </p>
      )}

      {!isLoading && !error && listings.length === 0 && (
        <p className="bento-card p-6 text-center text-sm text-ink-400">
          آگهی‌ای در این دسته موجود نیست.
        </p>
      )}

      {!isLoading && !error && listings.length > 0 && (
        <ListingCarousel listings={listings} />
      )}
    </div>
  );
}
