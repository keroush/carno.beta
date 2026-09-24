function ListingCardSkeleton() {
  return (
    <div className="w-56 flex-shrink-0 animate-pulse overflow-hidden rounded-[24px] bg-white shadow-card sm:w-64">
      <div className="h-52 bg-stone-100" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-2/3 rounded bg-stone-100" />
        <div className="h-3 w-1/2 rounded bg-stone-100" />
        <div className="h-3 w-1/3 rounded bg-stone-100" />
      </div>
    </div>
  );
}

export function ListingsSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden" aria-busy="true" aria-label="در حال بارگذاری آگهی‌ها">
      <ListingCardSkeleton />
      <ListingCardSkeleton />
      <ListingCardSkeleton />
      <ListingCardSkeleton />
    </div>
  );
}
