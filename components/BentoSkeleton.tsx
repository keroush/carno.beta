function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-[28px] bg-stone-100/70 ${className}`} />;
}

export function BentoSkeleton() {
  return (
    <div className="grid auto-rows-[minmax(160px,auto)] grid-cols-12 gap-3.5" aria-busy="true" aria-label="در حال بارگذاری خودروها">
      <SkeletonBlock className="col-span-12 row-span-2 h-[360px] lg:col-span-7" />
      <SkeletonBlock className="col-span-12 h-[240px] sm:col-span-6 lg:col-span-5" />
      <SkeletonBlock className="col-span-6 h-[160px] sm:col-span-3 lg:col-span-2" />
      <SkeletonBlock className="col-span-6 h-[160px] sm:col-span-3 lg:col-span-3" />
      <SkeletonBlock className="col-span-12 h-[160px] sm:col-span-6 lg:col-span-5" />
      <SkeletonBlock className="col-span-12 h-[280px] sm:col-span-6 lg:col-span-4" />
      <SkeletonBlock className="col-span-12 h-[280px] sm:col-span-6 lg:col-span-3" />
    </div>
  );
}
