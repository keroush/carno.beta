"use client";

import { useState } from "react";
import Link from "next/link";
import { AdCard } from "@/components/dashboard/AdCard";
import type { MyAdListing, MyAdStatus } from "@/types/dashboard";

interface MyAdsTabsProps {
  ads: Record<MyAdStatus, MyAdListing[]>;
}

const statusDefs: { id: MyAdStatus; label: string }[] = [
  { id: "active", label: "فعال" },
  { id: "incomplete", label: "تکمیل نشده" },
  { id: "inactive", label: "غیرفعال" },
];

const badgeStyles: Record<MyAdStatus, string> = {
  active: "bg-orange text-white",
  incomplete: "bg-white text-stone-700",
  inactive: "bg-white text-stone-700",
};

function toPersianDigits(value: number): string {
  const digits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(value)
    .split("")
    .map((char) => digits[Number(char)] ?? char)
    .join("");
}

export function MyAdsTabs({ ads }: MyAdsTabsProps) {
  const [activeStatus, setActiveStatus] = useState<MyAdStatus>("active");
  const activeAds = ads[activeStatus];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {statusDefs.map((status) => {
            const count = ads[status.id].length;
            const isActive = activeStatus === status.id;
            return (
              <button
                key={status.id}
                type="button"
                onClick={() => setActiveStatus(status.id)}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "border-orange/20 bg-orange/10 text-orange"
                    : "border-stone-200 text-stone-500 hover:border-orange/20 hover:text-orange"
                }`}
              >
                {status.label}
                <span
                  className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
                    isActive ? "bg-orange text-white" : "bg-stone-100 text-stone-500"
                  }`}
                >
                  {toPersianDigits(count)}
                </span>
              </button>
            );
          })}
        </div>

        <Link
          href="/dashboard/listing"
          className="rounded-xl bg-orange px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5"
        >
          + ثبت آگهی جدید
        </Link>
      </div>

      {activeAds.length === 0 ? (
        <div className="shadow-card rounded-[20px] border border-dashed border-stone-200 bg-white/60 p-10 text-center text-sm text-stone-400">
          آگهی‌ای در این بخش وجود ندارد.
        </div>
      ) : (
        <div className="space-y-4">
          {activeAds.map((ad) => (
            <AdCard
              key={ad.id}
              listing={ad}
              statusBadge={
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold shadow-sm ${badgeStyles[ad.status]}`}>
                  {statusDefs.find((status) => status.id === ad.status)?.label}
                </span>
              }
              footerNote={
                ad.status === "incomplete" ? (
                  <div className="mb-1 flex items-center gap-2">
                    <div className="h-1.5 w-28 overflow-hidden rounded-full bg-stone-100">
                      <div className="h-full rounded-full bg-orange" style={{ width: `${ad.completionPercent ?? 0}%` }} />
                    </div>
                    <span className="text-[11px] text-stone-400">{toPersianDigits(ad.completionPercent ?? 0)}٪ تکمیل شده</span>
                  </div>
                ) : ad.status === "inactive" && ad.inactiveReason ? (
                  <p className="mb-1 text-[11px] text-stone-400">دلیل غیرفعال شدن: {ad.inactiveReason}</p>
                ) : null
              }
              actions={
                ad.status === "incomplete" ? (
                  <button type="button" className="rounded-lg bg-orange px-4 py-1.5 text-xs font-semibold text-white">
                    تکمیل آگهی
                  </button>
                ) : (
                  <>
                    <button type="button" className="rounded-lg border border-stone-200 px-4 py-1.5 text-xs font-semibold text-stone-600 hover:border-orange/30 hover:text-orange">
                      ویرایش
                    </button>
                    {ad.status === "active" && (
                      <button type="button" className="rounded-lg border border-stone-200 px-4 py-1.5 text-xs font-semibold text-stone-600 hover:border-red-200 hover:text-red-500">
                        غیرفعال کردن
                      </button>
                    )}
                  </>
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
