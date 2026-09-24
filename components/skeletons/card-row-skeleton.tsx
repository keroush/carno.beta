interface CardRowSkeletonProps {
  count?: number;
  cardWidth?: number;
  cardHeight?: number;
}

export default function CardRowSkeleton({
  count = 3,
  cardWidth = 260,
  cardHeight = 250,
}: CardRowSkeletonProps) {
  return (
    <div className="flex gap-4 overflow-hidden px-4 pb-1 lg:px-8" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{ width: cardWidth, height: cardHeight }}
          className="shrink-0 animate-pulse rounded-[var(--radius-card)] border border-[var(--color-border-soft)] bg-[var(--color-surface)]"
        />
      ))}
    </div>
  );
}
