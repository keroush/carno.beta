"use client";

import { useState } from "react";
import type { Car, UsageType } from "@/lib/types";
import SwiperTrack from "./ui/swiper-track";
import CarCard from "./ui/car-card";

const TABS: { key: UsageType; label: string }[] = [
  { key: "new", label: "New" },
  { key: "used", label: "Used" },
  { key: "pre_sale", label: "Pre-Sale" },
];

interface TabbedAdsSwiperProps {
  carsByType: Record<UsageType, Car[]>;
}

export default function TabbedAdsSwiper({ carsByType }: TabbedAdsSwiperProps) {
  const [active, setActive] = useState<UsageType>("new");
  const activeCars = carsByType[active];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filter by listing type"
        className="mb-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:px-8"
      >
        {TABS.map((tab) => {
          const isActive = tab.key === active;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(tab.key)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                isActive
                  ? "bg-[var(--color-orange)] text-white shadow-[0_10px_24px_-10px_rgba(255,159,67,0.6)]"
                  : "bg-[var(--color-surface)] text-[var(--color-text-dim)] ring-1 ring-[var(--color-border)] hover:bg-white"
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-xs opacity-70">{carsByType[tab.key].length}</span>
            </button>
          );
        })}
      </div>

      {activeCars.length > 0 ? (
        <SwiperTrack ariaLabel={`${active} listings`} key={active}>
          {activeCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </SwiperTrack>
      ) : (
        <p className="px-4 text-sm text-[var(--color-text-mute)] lg:px-8">
          No {active.replace("_", "-")} listings match your filters yet.
        </p>
      )}
    </div>
  );
}
