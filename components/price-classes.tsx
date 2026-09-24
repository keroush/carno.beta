import { getPriceClasses } from "@/lib/mock-data";
import SectionHeader from "./ui/section-header";

export default async function PriceClasses() {
  const tiers = await getPriceClasses();

  return (
    <section id="price-classes" aria-label="Price classes">
      <SectionHeader eyebrow="Browse by budget" title="Price Classes" />

      {/* Signature: one continuous, muted-to-rich progression bar ties
          all six tiers to a single scale — restraint over spectacle. */}
      <div className="mx-4 mb-4 h-1 overflow-hidden rounded-full lg:mx-8">
        <div
          className="h-full w-full"
          style={{
            background:
              "linear-gradient(to right, var(--color-sand), var(--color-sky), var(--color-amber), var(--color-orange), var(--color-plum), var(--color-rust))",
          }}
        />
      </div>

      <div className="grid grid-cols-3 gap-2.5 px-4 lg:grid-cols-6 lg:gap-4 lg:px-8">
        {tiers.map((tier) => (
          <button
            key={tier.id}
            type="button"
            className="card-soft flex flex-col items-start gap-1.5 rounded-[var(--radius-card)] border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-3.5 text-left transition-transform hover:-translate-y-0.5 active:scale-[0.97]"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: `var(${tier.colorVar})` }}
            />
            <span className="font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--color-text)]">
              {tier.label}
            </span>
            <span className="text-[11px] leading-tight text-[var(--color-text-mute)]">
              {tier.rangeLabel}
            </span>
            <span className="text-[10px] font-medium text-[var(--color-text-mute)]">
              {tier.listingCount} listings
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
