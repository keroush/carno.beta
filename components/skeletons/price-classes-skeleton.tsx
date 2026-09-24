export default function PriceClassesSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-2.5 px-4 lg:grid-cols-6 lg:gap-4 lg:px-8" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-24 animate-pulse rounded-[var(--radius-card)] border border-[var(--color-border-soft)] bg-[var(--color-surface)]"
        />
      ))}
    </div>
  );
}
