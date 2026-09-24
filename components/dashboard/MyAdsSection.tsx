import Link from "next/link";
import { getMyListings } from "@/lib/userPanelApi";
import { MY_AD_STATUSES, MY_AD_STATUS_LABEL } from "@/lib/myAdsTabs";
import { toPersianDigits } from "@/lib/persianNumber";
import { MyAdCard } from "@/components/dashboard/MyAdCard";
import { Pagination } from "@/components/dashboard/Pagination";
import type { MyAdApiStatus } from "@/types/userPanel";

interface MyAdsSectionProps {
  token: string;
  status: MyAdApiStatus;
  page: number;
}

export async function MyAdsSection({ token, status, page }: MyAdsSectionProps) {
  const otherStatuses = MY_AD_STATUSES.filter((id) => id !== status);

  const [activeResult, ...otherResults] = await Promise.all([
    getMyListings(token, status, page),
    ...otherStatuses.map((id) => getMyListings(token, id, 1)),
  ]);

  const counts: Record<MyAdApiStatus, number> = { active: 0, incomplete: 0, inactive: 0 };
  counts[status] = activeResult.meta.total;
  otherStatuses.forEach((id, index) => {
    counts[id] = otherResults[index]?.meta.total ?? 0;
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {MY_AD_STATUSES.map((id) => {
            const isActive = id === status;
            return (
              <Link
                key={id}
                href={`/dashboard?tab=my-ads&status=${id}`}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "border-orange/20 bg-orange/10 text-orange"
                    : "border-stone-200 text-stone-500 hover:border-orange/20 hover:text-orange"
                }`}
              >
                {MY_AD_STATUS_LABEL[id]}
                <span
                  className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
                    isActive ? "bg-orange text-white" : "bg-stone-100 text-stone-500"
                  }`}
                >
                  {toPersianDigits(counts[id])}
                </span>
              </Link>
            );
          })}
        </div>
        <Link
          href="/dashboard/listing"
          className="rounded-xl bg-orange px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5"
        >
          + ثبت آگهی جدید
        </Link>
      </div>

      {activeResult.data.length === 0 ? (
        <div className="shadow-card rounded-[20px] border border-dashed border-stone-200 bg-white/60 p-10 text-center text-sm text-stone-400">
          آگهی‌ای در این بخش وجود ندارد.
        </div>
      ) : (
        <div className="space-y-4">
          {activeResult.data.map((listing) => (
            <MyAdCard key={listing.id} listing={listing} tab={status} />
          ))}
        </div>
      )}

      <Pagination meta={activeResult.meta} basePath={`/dashboard?tab=my-ads&status=${status}`} />
    </div>
  );
}
