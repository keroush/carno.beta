import { Suspense } from "react";
import Link from "next/link";
import { ListingsData } from "@/components/ListingsData";
import { ListingsSkeleton } from "@/components/ListingsSkeleton";

export function ListingsSection() {
  return (
    <section id="listings" className="pt-10 bg-white/80">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="mb-1 text-2xl font-black text-stone-800 sm:text-2xl">
              جدیدترین آگهی‌ها
            </h2>
            <p className="text-sm text-stone-400">
              آخرین خودروهای ثبت شده در کارنو
            </p>
          </div>
          <Link
            href="/listings"
            className="group hidden items-center gap-1.5 text-sm font-semibold text-orange transition-colors hover:text-warm-500 sm:flex"
          >
            مشاهده همه
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9 5 7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        <Suspense fallback={<ListingsSkeleton />}>
          <ListingsData />
        </Suspense>
      </div>
    </section>
  );
}
