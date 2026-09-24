function pulse(extra = "") {
  return `animate-pulse rounded-2xl bg-sky-100 ${extra}`;
}

export function ListingCardSkeleton() {
  return (
    <div className="bento-card flex h-full flex-col overflow-hidden">
      <div className={pulse("aspect-[4/3] w-full rounded-none")} />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className={pulse("h-4 w-3/4")} />
        <div className={pulse("h-3 w-1/2")} />
        <div className={pulse("h-5 w-2/3 mt-1")} />
      </div>
    </div>
  );
}

export function CarouselSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="w-[240px] shrink-0 sm:w-[280px]">
          <ListingCardSkeleton />
        </div>
      ))}
    </div>
  );
}

export function PopularModelsSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bento-card flex w-[140px] shrink-0 flex-col items-center gap-2 p-4">
          <div className={pulse("h-14 w-14 rounded-full")} />
          <div className={pulse("h-3 w-16")} />
          <div className={pulse("h-2 w-10")} />
        </div>
      ))}
    </div>
  );
}

export function BrandsGridSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="bento-card flex flex-col items-center gap-2 p-4">
          <div className={pulse("h-12 w-12 rounded-xl")} />
          <div className={pulse("h-3 w-14")} />
        </div>
      ))}
    </div>
  );
}
