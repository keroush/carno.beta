import Image from "next/image";
import Link from "next/link";
import { getPopularBrands } from "@/lib/api";

export default async function BrandsGrid() {
  const brands = await getPopularBrands();

  if (brands.length === 0) {
    return (
      <p className="bento-card p-6 text-center text-sm text-ink-400">
        برندی برای نمایش موجود نیست.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
      {brands.map((brand) => (
        <Link
          key={brand.id}
          href={`/listings?brand=${brand.slug}`}
          className="bento-card focus-ring flex flex-col items-center gap-2 p-4 text-center transition-shadow hover:shadow-bento"
        >
          <span className="relative h-12 w-12 overflow-hidden rounded-xl bg-sky-100">
            <Image
              src={brand.image}
              alt={brand.name}
              fill
              sizes="48px"
              className="object-contain p-1.5"
            />
          </span>
          <span className="line-clamp-1 text-xs font-semibold text-ink-900">
            {brand.name}
          </span>
          <span className="text-[11px] text-ink-400">
            {new Intl.NumberFormat("fa-IR").format(brand.listings_count)} آگهی
          </span>
        </Link>
      ))}
    </div>
  );
}
