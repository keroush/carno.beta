import Image from "next/image";
import Link from "next/link";
import { CalendarIcon, PinIcon } from "@/components/CardMetaIcons";
import { formatPriceToman, formatRelativeTime, toPersianDigits } from "@/lib/persianNumber";
import type { SavedListingEntry } from "@/types/userPanel";

interface SavedAdCardProps {
  entry: SavedListingEntry;
  onRemove: (listingId: number) => void;
  isRemoving: boolean;
}

export function SavedAdCard({ entry, onRemove, isRemoving }: SavedAdCardProps) {
  const { listing } = entry;
  const isAvailable = listing.status === "active";

  return (
    <div
      className={`shadow-card flex flex-col overflow-hidden rounded-[20px] border border-transparent bg-white transition-all duration-300 sm:flex-row ${
        isAvailable ? "hover:border-orange/10" : "opacity-70"
      }`}
    >
      <div className="relative h-40 w-full flex-shrink-0 overflow-hidden bg-stone-100 sm:h-auto sm:w-44">
        <Image src={listing.cover_image} alt={listing.title} fill sizes="(min-width: 640px) 176px, 100vw" className="object-cover" />
        {!isAvailable && (
          <span className="absolute top-2.5 right-2.5 rounded-full bg-stone-700 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
            دیگر در دسترس نیست
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          <div className="mb-1.5 flex items-start justify-between gap-2">
            <h3 className="text-sm font-bold text-stone-800 sm:text-base">{listing.title}</h3>
            <span className="whitespace-nowrap text-sm font-black text-orange">{formatPriceToman(listing.price)}</span>
          </div>
          <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-stone-400">
            <span className="flex items-center gap-1">
              <CalendarIcon />
              {toPersianDigits(listing.year)}
            </span>
            <span className="flex items-center gap-1">
              <PinIcon />
              {listing.city}
            </span>
          </div>
          <p className="mb-1 text-[11px] text-stone-400">ذخیره شده: {formatRelativeTime(entry.saved_at)}</p>
        </div>
        <div className="mt-3 flex items-center gap-2">
          {isAvailable && (
            <Link
              href={`/listings/${listing.id}`}
              className="rounded-lg border border-stone-200 px-4 py-1.5 text-xs font-semibold text-stone-600 hover:border-orange/30 hover:text-orange"
            >
              مشاهده آگهی
            </Link>
          )}
          <button
            type="button"
            onClick={() => onRemove(listing.id)}
            disabled={isRemoving}
            className="rounded-lg border border-stone-200 px-4 py-1.5 text-xs font-semibold text-stone-600 transition-colors hover:border-red-200 hover:text-red-500 disabled:opacity-50"
          >
            {isRemoving ? "در حال حذف..." : "حذف از ذخیره‌شده‌ها"}
          </button>
        </div>
      </div>
    </div>
  );
}
