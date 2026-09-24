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
      className={`shadow-card hover:shadow-card-hover group block h-full overflow-hidden rounded-[24px] border border-transparent bg-white transition-all duration-[400ms] hover:border-orange/10 ${className}`}
    >
      <div className="relative h-52 overflow-hidden">
        <Image
          src={listing.image}
          alt={listing.imageAlt}
          fill
          draggable={false}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 85vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />
        <span
          className={`absolute top-3 left-3 rounded-full px-3 py-1 text-[10px] font-bold ${USAGE_TYPE_TAG_CLASS[listing.usageType]}`}
        >
          {USAGE_TYPE_LABEL[listing.usageType]}
        </span>
        <BookmarkButton
          label={`ذخیره ${listing.title}`}
          className="absolute top-3 right-3 h-9 w-9 bg-white/90 shadow-sm"
        />
      </div>
      <div className="p-5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-base font-bold text-stone-800">
            {listing.title}
          </h3>
          <span className="flex items-center gap-1 text-[11px] text-stone-300">
            <EyeIcon />
            {listing.views}
          </span>
        </div>
        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-stone-400">
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
        <div className="flex items-center justify-between border-t border-stone-50 pt-4">
          <span className="text-sm font-black text-orange">
            {listing.price}
          </span>
          <span className="text-[11px] text-stone-300">{listing.postedAt}</span>
        </div>
      </div>
    </Link>
  );
}
