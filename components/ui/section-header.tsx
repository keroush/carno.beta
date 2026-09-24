import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  href?: string;
}

export default function SectionHeader({ eyebrow, title, href }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between px-4 pb-4 lg:px-8">
      <div>
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-orange-deep)]">
            {eyebrow}
          </p>
        )}
        <h2 className="font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight text-[var(--color-text)] lg:text-2xl">
          {title}
        </h2>
      </div>
      {href && (
        <a
          href={href}
          className="flex shrink-0 items-center gap-1 rounded-full bg-[var(--color-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text-dim)] ring-1 ring-[var(--color-border)] transition-colors hover:text-[var(--color-orange)]"
        >
          See all
          <ChevronRight size={14} />
        </a>
      )}
    </div>
  );
}
