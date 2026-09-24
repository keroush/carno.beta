function CardSkeleton() {
  return (
    <div className="w-full flex-shrink-0 px-2.5 sm:w-1/2 lg:w-1/3">
      <div className="animate-pulse overflow-hidden rounded-[24px] bg-white shadow-card">
        <div className="h-52 bg-stone-100" />
        <div className="space-y-3 p-5">
          <div className="h-4 w-3/4 rounded bg-stone-100" />
          <div className="h-3 w-full rounded bg-stone-100" />
          <div className="h-3 w-2/3 rounded bg-stone-100" />
        </div>
      </div>
    </div>
  );
}

export function ReviewsSkeleton() {
  return (
    <div aria-busy="true" aria-label="در حال بارگذاری بررسی‌ها">
      <div className="mb-10 flex flex-wrap items-center justify-center gap-1">
        {["جدیدترین‌ها", "پربازدیدترین", "اقتصادی", "لوکس"].map((label) => (
          <span key={label} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-stone-300">
            {label}
          </span>
        ))}
      </div>
      <div className="flex overflow-hidden rounded-[28px]">
        <CardSkeleton />
        <div className="hidden sm:block">
          <CardSkeleton />
        </div>
        <div className="hidden lg:block">
          <CardSkeleton />
        </div>
      </div>
    </div>
  );
}
