export default function TabbedSectionSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="mb-4 flex gap-2 px-4 lg:px-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-[var(--color-surface)]" />
        ))}
      </div>
      <div className="flex gap-4 overflow-hidden px-4 lg:px-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-[250px] w-[260px] shrink-0 animate-pulse rounded-[var(--radius-card)] border border-[var(--color-border-soft)] bg-[var(--color-surface)]"
          />
        ))}
      </div>
    </div>
  );
}
