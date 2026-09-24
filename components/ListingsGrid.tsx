import Image from "next/image";
import { getLatestListings } from "@/data/listings";
import { BookmarkButton } from "@/components/BookmarkButton";
import { Reveal } from "@/components/Reveal";
import type { CarListing } from "@/types/listing";

const badgeTone: Record<NonNullable<CarListing["badgeTone"]>, string> = {
  orange: "bg-orange text-white shadow-md",
  sky: "border border-sky/10 bg-sky/15 text-sky-500",
};

export async function ListingsGrid() {
  const listings = await getLatestListings();

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing, index) => (
        <Reveal key={listing.id} delayMs={index * 60}>
          <div className="shadow-card hover:shadow-card-hover group h-full cursor-pointer overflow-hidden rounded-[24px] border border-transparent bg-white transition-all duration-[400ms] hover:border-orange/10">
            <div className="relative h-52 overflow-hidden">
              <Image
                src={listing.image}
                alt={listing.imageAlt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
              />
              {listing.badge && listing.badgeTone && (
                <span className={`absolute top-3 left-3 rounded-full px-3 py-1 text-[10px] font-bold ${badgeTone[listing.badgeTone]}`}>
                  {listing.badge}
                </span>
              )}
              <BookmarkButton label={`ذخیره ${listing.title}`} className="absolute top-3 right-3 h-9 w-9 bg-white/90 shadow-sm" />
            </div>
            <div className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-base font-bold text-stone-800">{listing.title}</h3>
                <span className="text-[11px] text-stone-300">{listing.views}</span>
              </div>
              <div className="mb-4 flex items-center gap-4 text-[11px] text-stone-400">
                <span>{listing.year}</span>
                <span className="h-1 w-1 rounded-full bg-stone-200" />
                <span>{listing.transmission}</span>
                <span className="h-1 w-1 rounded-full bg-stone-200" />
                <span>{listing.city}</span>
              </div>
              <div className="flex items-center justify-between border-t border-stone-50 pt-4">
                <span className="text-sm font-black text-orange">{listing.price}</span>
                <span className="text-[11px] text-stone-300">{listing.postedAt}</span>
              </div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
