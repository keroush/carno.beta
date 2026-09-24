import { getBrands } from "@/data/listings";
import { Reveal } from "@/components/Reveal";
import type { Brand } from "@/types/listing";

const toneClasses: Record<Brand["tone"], string> = {
  orange: "bg-warm-50 text-orange",
  sky: "bg-sky-50 text-sky-400",
  neutral: "bg-stone-50 text-stone-600",
};

export async function BrandGrid() {
  const brands = await getBrands();

  return (
    <section id="brands" className="py-12 bg-white/80">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-2xl font-black text-stone-800 sm:text-2xl">
            برندهای محبوب
          </h2>
          <p className="text-sm text-stone-400">
            از بین بیش از ۴۰ برند خودرویی انتخاب کنید
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3.5 sm:grid-cols-4 lg:grid-cols-6">
          {brands.map((brand, index) => (
            <Reveal key={brand.id} delayMs={index * 30}>
              <div className="shadow-bento flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-transparent bg-white p-5 transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.03] hover:border-orange/10 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06),0_0_0_1px_rgba(255,159,67,0.10)]">
                <div
                  className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-[1.08] ${toneClasses[brand.tone]}`}
                >
                  <span className="text-lg font-black">{brand.initials}</span>
                </div>
                <span className="text-xs font-bold text-stone-700">
                  {brand.name}
                </span>
                <span className="mt-0.5 text-[10px] text-stone-300">
                  {brand.count}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
