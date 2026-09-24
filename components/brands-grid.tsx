import { ShieldCheck } from "lucide-react";
import { getHighDemandBrands } from "@/lib/mock-data";
import SectionHeader from "./ui/section-header";

export default async function BrandsGrid() {
  const brands = await getHighDemandBrands();

  return (
    <section aria-label="High-demand brands">
      <SectionHeader eyebrow="Most searched" title="High-Demand Brands" href="/brands" />
      <div className="grid grid-cols-4 gap-3 px-4 lg:grid-cols-8 lg:gap-4 lg:px-8">
        {brands.map((brand) => (
          <button
            key={brand.id}
            type="button"
            className="group flex flex-col items-center gap-2 rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-3 transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-md active:scale-95 lg:p-4"
          >
            <span className="relative">
              <span
                className="grid h-11 w-11 place-items-center rounded-2xl font-[family-name:var(--font-display)] text-sm font-bold text-[var(--color-on-accent)] lg:h-12 lg:w-12"
                style={{ backgroundColor: `var(${brand.accentVar})` }}
              >
                {brand.logoInitial}
              </span>
              <ShieldCheck
                size={13}
                className="absolute -bottom-0.5 -right-0.5 rounded-full bg-[var(--color-surface)] text-[var(--color-sky-deep)]"
              />
            </span>
            <span className="w-full truncate text-center text-[11px] font-semibold text-[var(--color-text-dim)]">
              {brand.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
