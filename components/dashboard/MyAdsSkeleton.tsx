function CardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-[20px] bg-white shadow-card sm:flex-row">
      <div className="h-40 w-full bg-stone-100 sm:h-auto sm:w-44" />
      <div className="flex-1 space-y-3 p-5">
        <div className="h-4 w-1/2 rounded bg-stone-100" />
        <div className="h-3 w-3/4 rounded bg-stone-100" />
        <div className="h-3 w-1/3 rounded bg-stone-100" />
      </div>
    </div>
  );
}

export function MyAdsSkeleton() {
  return (
    <div aria-busy="true" aria-label="در حال بارگذاری آگهی‌های من">
      <div className="mb-6 flex gap-2">
        {[0, 1, 2].map((key) => (
          <span key={key} className="h-9 w-28 animate-pulse rounded-xl bg-stone-100" />
        ))}
      </div>
      <div className="space-y-4">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}
