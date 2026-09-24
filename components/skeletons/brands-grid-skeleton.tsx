export default function BrandsGridSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-3 px-4 lg:grid-cols-8 lg:gap-4 lg:px-8" aria-hidden="true">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="aspect-square animate-pulse rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface)]"
        />
      ))}
    </div>
  );
}
