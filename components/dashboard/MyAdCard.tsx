import Image from "next/image";
import Link from "next/link";
import { CalendarIcon, EyeIcon, PinIcon } from "@/components/CardMetaIcons";
import { formatPriceToman, formatRelativeTime, toPersianDigits } from "@/lib/persianNumber";
import type { MyAdApiStatus, MyListingSummary } from "@/types/userPanel";

const STATUS_BADGE_CLASS: Record<string, string> = {
  active: "bg-orange text-white",
  pending: "bg-sky-500 text-white",
  rejected: "bg-red-500 text-white",
  sold: "bg-stone-700 text-white",
  draft: "bg-white text-stone-700 border border-stone-200",
};

export function MyAdCard({ listing, tab }: { listing: MyListingSummary; tab: MyAdApiStatus }) {
  const isIncomplete = tab === "incomplete";
  const badgeClass = STATUS_BADGE_CLASS[listing.status] ?? "bg-white text-stone-700 border border-stone-200";

  return (
    <div className="shadow-card flex flex-col overflow-hidden rounded-[20px] border border-transparent bg-white transition-all duration-300 hover:border-orange/10 sm:flex-row">
      <div className="relative h-40 w-full flex-shrink-0 overflow-hidden bg-stone-100 sm:h-auto sm:w-44">
        {listing.cover_image ? (
          <Image src={listing.cover_image} alt={listing.title} fill sizes="(min-width: 640px) 176px, 100vw" className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-stone-300">بدون تصویر</div>
        )}
        <span className={`absolute top-2.5 right-2.5 rounded-full px-2.5 py-1 text-[10px] font-bold shadow-sm ${badgeClass}`}>
          {listing.status_label}
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          <div className="mb-1.5 flex items-start justify-between gap-2">
            <h3 className="text-sm font-bold text-stone-800 sm:text-base">{listing.title}</h3>
            {!isIncomplete && listing.price > 0 && (
              <span className="whitespace-nowrap text-sm font-black text-orange">{formatPriceToman(listing.price)}</span>
            )}
          </div>
          <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-stone-400">
            {listing.year > 0 && (
              <span className="flex items-center gap-1">
                <CalendarIcon />
                {toPersianDigits(listing.year)}
              </span>
            )}
            {listing.city && (
              <span className="flex items-center gap-1">
                <PinIcon />
                {listing.city}
              </span>
            )}
            <span className="flex items-center gap-1">
              <EyeIcon />
              {toPersianDigits(listing.views_count)} بازدید
            </span>
            <span>{formatRelativeTime(listing.created_at)}</span>
          </div>
          {isIncomplete && (
            <p className="mb-1 text-[11px] text-stone-400">
              مرحله {toPersianDigits(listing.current_step)} از ۱۰ تکمیل شده
            </p>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          {isIncomplete ? (
            <Link href="/dashboard/listing" className="rounded-lg bg-orange px-4 py-1.5 text-xs font-semibold text-white">
              ادامه ثبت آگهی
            </Link>
          ) : (
            <Link
              href={`/dashboard/listings/${listing.id}`}
              className="rounded-lg border border-stone-200 px-4 py-1.5 text-xs font-semibold text-stone-600 hover:border-orange/30 hover:text-orange"
            >
              مشاهده جزئیات
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
