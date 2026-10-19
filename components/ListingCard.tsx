import Image from "next/image";
import Link from "next/link";
import { BookmarkButton } from "@/components/BookmarkButton";
import {
  CalendarIcon,
  EyeIcon,
  GaugeIcon,
  PinIcon,
} from "@/components/CardMetaIcons";
import { formatKilometers } from "@/lib/persianNumber";
import { USAGE_TYPE_LABEL, USAGE_TYPE_TAG_CLASS } from "@/lib/usageType";
import type { CarListing } from "@/types/listing";

interface ListingCardProps {
  listing: CarListing;
  className?: string;
}

export function ListingCard({ listing, className = "" }: ListingCardProps) {
  return (
    <Link
      href={`/listings/1`}
      draggable={false}
      className={`shadow-card hover:shadow-card-hover group block h-full overflow-hidden rounded-[20px] sm:rounded-[24px] border border-transparent bg-white transition-all duration-[400ms] hover:border-orange/10 ${className}`}
    >
      <div className="relative h-36 overflow-hidden sm:h-52">
        <Image
          src={listing.image}
          alt={listing.imageAlt}
          fill
          draggable={false}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 60vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />
        <span
          className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-bold sm:top-3 sm:left-3 sm:px-3 sm:py-1 ${USAGE_TYPE_TAG_CLASS[listing.usageType]}`}
        >
          {USAGE_TYPE_LABEL[listing.usageType]}
        </span>
        <BookmarkButton
          label={`ذخیره ${listing.title}`}
          className="absolute top-2 right-2 h-8 w-8 bg-white/90 shadow-sm sm:top-3 sm:right-3 sm:h-9 sm:w-9"
        />
      </div>
      <div className="p-3 sm:p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="min-w-0 truncate text-sm font-bold text-stone-800 sm:text-base">
            {listing.title}
          </h3>
          <span className="flex flex-shrink-0 items-center gap-1 text-[11px] text-stone-300">
            <EyeIcon />
            {listing.views}
          </span>
        </div>
        <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-stone-400 sm:mb-4 sm:gap-x-3 sm:gap-y-1.5">
          <span className="flex items-center gap-1">
            <CalendarIcon />
            {listing.year}
          </span>
          {listing.usageType === "used" && listing.mileage !== undefined && (
            <span className="flex items-center gap-1">
              <GaugeIcon />
              {formatKilometers(listing.mileage)}
            </span>
          )}
          <span>{listing.transmission}</span>
          <span className="flex items-center gap-1">
            <PinIcon />
            {listing.city}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-stone-50 pt-3 sm:pt-4">
          <span className="text-xs font-black text-orange sm:text-sm">
            {listing.price}
          </span>
          <span className="flex-shrink-0 text-[11px] text-stone-300">{listing.postedAt}</span>
        </div>
      </div>
    </Link>
  );
}
