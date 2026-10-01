import Image from "next/image";
import Link from "next/link";
import { BookmarkButton } from "@/components/BookmarkButton";
import { CalendarIcon, GaugeIcon, PinIcon } from "@/components/CardMetaIcons";
import { formatKilometers, formatPriceToman, formatRelativeTime, toPersianDigits } from "@/lib/persianNumber";
import { USAGE_TYPE_TAG_CLASS, type CarUsageType } from "@/lib/usageType";
import type { RelatedListingSummary } from "@/types/listingDetail";

function isKnownUsageType(value: string): value is CarUsageType {
  return value === "zero" || value === "used" || value === "pre_sale";
}

export function RelatedListingCard({ listing }: { listing: RelatedListingSummary }) {
  const tagClass = isKnownUsageType(listing.usage_type) ? USAGE_TYPE_TAG_CLASS[listing.usage_type] : "bg-white/90 text-stone-700 shadow-sm";

  return (
    <Link
      href={`/listings/${listing.slug ?? listing.id}`}
      className="shadow-card hover:shadow-card-hover group block overflow-hidden rounded-[20px] border border-transparent bg-white transition-all duration-300 hover:border-orange/10"
    >
      <div className="relative h-40 overflow-hidden">
        <Image
          src={listing.cover_image}
          alt={listing.title}
          fill
          sizes="(min-width: 1024px) 25vw, 45vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />
        <span className={`absolute top-2.5 left-2.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${tagClass}`}>
          {listing.usage_type_label}
        </span>
        <BookmarkButton
          label={`ذخیره ${listing.title}`}
          variant="glass"
          className="absolute top-2.5 right-2.5 h-8 w-8 bg-white/90 shadow-sm"
          listingId={listing.id}
          initialSaved={listing.is_saved}
        />
      </div>
      <div className="p-4">
        <h3 className="mb-1.5 text-sm font-bold text-stone-800">{listing.title}</h3>
        <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-stone-400">
          <span className="flex items-center gap-1">
            <CalendarIcon className="h-3 w-3" />
            {toPersianDigits(listing.year)}
          </span>
          {listing.mileage !== null && (
            <span className="flex items-center gap-1">
              <GaugeIcon className="h-3 w-3" />
              {formatKilometers(listing.mileage)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <PinIcon className="h-3 w-3" />
            {listing.city}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-stone-50 pt-2.5">
          <span className="text-xs font-black text-orange">{formatPriceToman(listing.price)}</span>
          <span className="text-[10px] text-stone-300">{formatRelativeTime(listing.created_at)}</span>
        </div>
      </div>
    </Link>
  );
}
