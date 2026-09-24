import { getAdsByCategory } from "@/data/listings";
import { FeaturedAdsCarousel } from "@/components/FeaturedAdsCarousel";
import type { AdCategoryTab, CarListing } from "@/types/listing";

const tabs: AdCategoryTab[] = ["new", "popular", "economy", "luxury"];

export async function FeaturedAdsSection() {
  const results = await Promise.all(tabs.map((tab) => getAdsByCategory(tab)));

  const adsByTab = tabs.reduce<Record<AdCategoryTab, CarListing[]>>(
    (acc, tab, index) => {
      acc[tab] = results[index] ?? [];
      return acc;
    },
    { new: [], popular: [], economy: [], luxury: [] },
  );

  return (
    <section id="leasing" className="py-12 bg-white/40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-2xl font-black text-stone-800 sm:text-2xl">
            آگهی‌های پیشنهادی
          </h2>
          <p className="text-sm text-stone-400">
            بر اساس دسته‌بندی‌های محبوب کاربران
          </p>
        </div>

        <FeaturedAdsCarousel adsByTab={adsByTab} />
      </div>
    </section>
  );
}
