import { getReviewsByTab } from "@/data/listings";
import { ReviewsCarousel } from "@/components/ReviewsCarousel";
import type { ReviewArticle, ReviewTab } from "@/types/listing";

const tabs: ReviewTab[] = ["new", "popular", "economy", "luxury"];

export async function ReviewsSection() {
  const results = await Promise.all(tabs.map((tab) => getReviewsByTab(tab)));

  const reviewsByTab = tabs.reduce<Record<ReviewTab, ReviewArticle[]>>(
    (acc, tab, index) => {
      acc[tab] = results[index] ?? [];
      return acc;
    },
    { new: [], popular: [], economy: [], luxury: [] },
  );

  return (
    <section id="leasing" className="py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-2xl font-black text-stone-800 sm:text-3xl">بررسی تخصصی خودروها</h2>
          <p className="text-sm text-stone-400">جدیدترین بررسی‌ها و تست‌های رانندگی</p>
        </div>

        <ReviewsCarousel reviewsByTab={reviewsByTab} />
      </div>
    </section>
  );
}
