import Image from "next/image";
import { Eye, MapPin, Play, ShieldCheck } from "lucide-react";
import type { Car } from "@/lib/types";
import { formatMileage, formatPrice, formatViews, USAGE_LABEL } from "@/lib/format";
import BookmarkButton from "./bookmark-button";

const USAGE_STYLE: Record<Car["usageType"], string> = {
  new: "bg-[var(--color-sky)] text-[var(--color-sky-deep)]",
  used: "bg-[var(--color-sand)] text-[var(--color-on-accent)]",
  pre_sale: "bg-[var(--color-orange)] text-white",
};

interface CarCardProps {
  car: Car;
  className?: string;
  rank?: number;
  verified?: boolean;
}

export default function CarCard({ car, className = "", rank, verified = true }: CarCardProps) {
  return (
    <article
      className={`group relative flex w-[248px] shrink-0 flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border-soft)] bg-[var(--color-surface)] card-soft transition-transform hover:-translate-y-0.5 lg:w-[264px] ${className}`}
    >
      <div className="relative h-36 w-full overflow-hidden bg-[var(--color-canvas-2)] lg:h-40">
        <Image
          src={car.image}
          alt={`${car.brand} ${car.model}`}
          fill
          sizes="(min-width: 1024px) 264px, 248px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2.5">
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${USAGE_STYLE[car.usageType]}`}>
            {USAGE_LABEL[car.usageType]}
          </span>
          <BookmarkButton initialBookmarked={car.isBookmarked} />
        </div>

        {typeof rank === "number" && (
          <span className="absolute bottom-2.5 left-2.5 grid h-6 w-6 place-items-center rounded-full bg-[var(--color-text)] font-[family-name:var(--font-display)] text-[11px] font-bold text-[var(--color-orange)] shadow-sm">
            {rank}
          </span>
        )}

        {car.hasVideo && (
          <span className="absolute bottom-2.5 right-2.5 grid h-6 w-6 place-items-center rounded-full bg-black/55 backdrop-blur-sm">
            <Play size={11} className="fill-white text-white" />
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <div className="flex items-center justify-between gap-1">
          <h3 className="truncate font-[family-name:var(--font-display)] text-[15px] font-bold text-[var(--color-text)]">
            {car.brand} {car.model}
          </h3>
          {verified && (
            <ShieldCheck size={14} className="shrink-0 text-[var(--color-sky-deep)]" aria-label="Verified dealer" />
          )}
        </div>

        <div className="flex items-center gap-1 text-xs text-[var(--color-text-mute)]">
          <MapPin size={12} className="shrink-0" />
          <span className="truncate">{car.location}</span>
        </div>

        <div className="mt-1 rounded-2xl bg-[var(--color-canvas-2)] px-3 py-2">
          <p className="text-[10px] text-[var(--color-text-mute)]">Lease from</p>
          <div className="flex items-baseline gap-1">
            <span className="font-[family-name:var(--font-display)] text-lg font-extrabold text-[var(--color-orange-deep)]">
              {formatPrice(car.price, car.currency)}
            </span>
            <span className="text-[11px] text-[var(--color-text-mute)]">/mo</span>
          </div>
        </div>

        <div className="mt-1 flex items-center justify-between text-[11px] text-[var(--color-text-mute)]">
          <span>{car.mileageKm === 0 ? "Brand new" : formatMileage(car.mileageKm)}</span>
          <span className="flex items-center gap-1">
            <Eye size={12} />
            {formatViews(car.views)}
          </span>
        </div>
      </div>
    </article>
  );
}
