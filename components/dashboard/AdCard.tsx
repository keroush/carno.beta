import Image from "next/image";
import type { ReactNode } from "react";
import { CalendarIcon, EyeIcon, GaugeIcon, PinIcon } from "@/components/CardMetaIcons";
import { formatKilometers } from "@/lib/persianNumber";
import type { CarListing } from "@/types/listing";

interface AdCardProps {
  listing: CarListing;
  statusBadge?: ReactNode;
  footerNote?: ReactNode;
  actions?: ReactNode;
}

export function AdCard({ listing, statusBadge, footerNote, actions }: AdCardProps) {
  return (
    <div className="shadow-card flex flex-col overflow-hidden rounded-[20px] border border-transparent bg-white transition-all duration-300 hover:border-orange/10 sm:flex-row">
      <div className="relative h-40 w-full flex-shrink-0 overflow-hidden sm:h-auto sm:w-44">
        <Image src={listing.image} alt={listing.imageAlt} fill sizes="(min-width: 640px) 176px, 100vw" className="object-cover" />
        {statusBadge && <div className="absolute top-2.5 right-2.5">{statusBadge}</div>}
      </div>
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          <div className="mb-1.5 flex items-start justify-between gap-2">
            <h3 className="text-sm font-bold text-stone-800 sm:text-base">{listing.title}</h3>
            <span className="whitespace-nowrap text-sm font-black text-orange">{listing.price}</span>
          </div>
          <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-stone-400">
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
            <span className="flex items-center gap-1">
              <EyeIcon />
              {listing.views} بازدید
            </span>
          </div>
          {footerNote}
        </div>
        {actions && <div className="mt-3 flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
