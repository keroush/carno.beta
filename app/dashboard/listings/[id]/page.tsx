import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { CalendarIcon, EyeIcon, GaugeIcon, PinIcon, TagIcon, SlidersIcon, BeakerIcon } from "@/components/CardMetaIcons";
import { ListingGallery } from "@/components/listing-detail/ListingGallery";
import { SpecList } from "@/components/listing-detail/SpecList";
import { ApiError } from "@/lib/apiError";
import { getMe } from "@/lib/authApi";
import { getMyListingDetail } from "@/lib/userPanelApi";
import { SESSION_COOKIE_NAME } from "@/lib/sessionCookie";
import { formatKilometers, formatPriceToman, formatRelativeTime, toPersianDigits } from "@/lib/persianNumber";
import { USAGE_TYPE_TAG_CLASS, type CarUsageType } from "@/lib/usageType";

export const metadata: Metadata = {
  title: "جزئیات آگهی من — کارنو",
};

interface MyListingDetailPageProps {
  params: Promise<{ id: string }>;
}

function isKnownUsageType(value: string): value is CarUsageType {
  return value === "zero" || value === "used" || value === "pre_sale";
}

const STATUS_BANNER_CLASS: Record<string, string> = {
  pending: "border-sky/15 bg-sky/5 text-sky-600",
  rejected: "border-red-100 bg-red-50 text-red-600",
  sold: "border-stone-200 bg-stone-50 text-stone-600",
  draft: "border-orange/15 bg-warm-50 text-warm-600",
};

export default async function MyListingDetailPage({ params }: MyListingDetailPageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    redirect(`/login?next=/dashboard/listings/${id}`);
  }

  await getMe(token).catch(() => {
    redirect(`/login?next=/dashboard/listings/${id}`);
  });

  let listing;
  try {
    const result = await getMyListingDetail(token, id);
    listing = result.listing;
  } catch (error) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center px-5 pt-[110px]">
          <div className="shadow-bento max-w-md rounded-[24px] bg-white p-8 text-center">
            <p className="mb-1 text-sm font-bold text-stone-700">
              {error instanceof ApiError && error.status === 403
                ? "این آگهی متعلق به شما نیست."
                : "این آگهی یافت نشد."}
            </p>
            <Link href="/dashboard?tab=my-ads" className="mt-4 inline-block text-xs font-semibold text-orange hover:text-warm-500">
              بازگشت به آگهی‌های من
            </Link>
          </div>
        </main>
      </>
    );
  }

  const usageTagClass = isKnownUsageType(listing.usage_type)
    ? USAGE_TYPE_TAG_CLASS[listing.usage_type]
    : "bg-white/90 text-stone-700 shadow-sm";
  const bannerClass = STATUS_BANNER_CLASS[listing.status];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-20 pt-[110px]">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 lg:px-10">
          <Link href="/dashboard?tab=my-ads" className="mb-5 inline-block text-xs font-medium text-stone-400 hover:text-stone-600">
            ← بازگشت به آگهی‌های من
          </Link>

          {bannerClass && (
            <div className={`mb-5 rounded-xl border px-4 py-2.5 text-xs font-semibold ${bannerClass}`}>{listing.status_label}</div>
          )}

          <div className="space-y-6">
            <ListingGallery images={listing.images} title={listing.title} />

            <div className="shadow-card rounded-[20px] border border-transparent bg-white p-6">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${usageTagClass}`}>{listing.usage_type_label}</span>
                {listing.is_exchange && (
                  <span className="rounded-full border border-sky/10 bg-sky/10 px-3 py-1 text-[11px] font-bold text-sky-500">
                    قابل معاوضه
                  </span>
                )}
              </div>
              <h1 className="mb-3 text-xl font-black text-stone-800 sm:text-2xl">{listing.title}</h1>

              <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-stone-400">
                <span className="flex items-center gap-1.5">
                  <CalendarIcon />
                  {toPersianDigits(listing.year)}
                </span>
                {listing.mileage !== null && (
                  <span className="flex items-center gap-1.5">
                    <GaugeIcon />
                    {formatKilometers(listing.mileage)}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <PinIcon />
                  {listing.city.name} — {listing.city.province}
                </span>
                <span className="flex items-center gap-1.5">
                  <EyeIcon />
                  {toPersianDigits(listing.views_count)} بازدید
                </span>
                <span>{formatRelativeTime(listing.created_at)}</span>
              </div>

              <div className="flex items-center justify-between border-t border-stone-50 pt-4">
                <span className="text-2xl font-black text-orange">
                  {listing.sale_type === "negotiable" ? "توافقی" : formatPriceToman(listing.price)}
                </span>
                <span className="text-xs text-stone-400">{listing.sale_type_label}</span>
              </div>
            </div>

            <div className="shadow-card rounded-[20px] border border-transparent bg-white p-5">
              <dl className="grid grid-cols-1 gap-x-6 gap-y-2.5 text-xs sm:grid-cols-2">
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1.5 text-stone-400">
                    <TagIcon />
                    برند و مدل
                  </dt>
                  <dd className="font-semibold text-stone-700">
                    {listing.brand.name} {listing.car_model.name}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1.5 text-stone-400">
                    <SlidersIcon />
                    تیپ
                  </dt>
                  <dd className="font-semibold text-stone-700">{listing.trim.name}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1.5 text-stone-400">
                    <BeakerIcon />
                    رنگ بدنه
                  </dt>
                  <dd className="flex items-center gap-1.5 font-semibold text-stone-700">
                    <span
                      className="h-3 w-3 rounded-full border border-stone-200"
                      style={{ backgroundColor: listing.body_color.hex_code }}
                    />
                    {listing.body_color.name}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1.5 text-stone-400">
                    <BeakerIcon />
                    وضعیت رنگ
                  </dt>
                  <dd className="font-semibold text-stone-700">{listing.paintwork_status.name}</dd>
                </div>
              </dl>
            </div>

            {listing.description && (
              <div className="shadow-card rounded-[20px] border border-transparent bg-white p-6">
                <h2 className="mb-3 text-sm font-bold text-stone-800">توضیحات</h2>
                <p className="text-sm leading-relaxed text-stone-500">{listing.description}</p>
              </div>
            )}

            <SpecList spec={listing.spec} />
          </div>
        </div>
      </main>
    </>
  );
}
