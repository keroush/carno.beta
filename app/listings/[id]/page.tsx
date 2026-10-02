import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BookmarkButton } from "@/components/BookmarkButton";
import {
  CalendarIcon,
  EyeIcon,
  GaugeIcon,
  PinIcon,
  TagIcon,
  SlidersIcon,
  BeakerIcon,
} from "@/components/CardMetaIcons";
import { ListingGallery } from "@/components/listing-detail/ListingGallery";
import { SpecList } from "@/components/listing-detail/SpecList";
import { RelatedListingCard } from "@/components/listing-detail/RelatedListingCard";
import { MobileContactBar } from "@/components/listing-detail/MobileContactBar";
import { ApiError } from "@/lib/apiError";
import { getListingDetail } from "@/lib/publicListingApi";
import { SESSION_COOKIE_NAME } from "@/lib/sessionCookie";
import {
  formatKilometers,
  formatPriceToman,
  formatRelativeTime,
  toPersianDigits,
} from "@/lib/persianNumber";
import { USAGE_TYPE_TAG_CLASS, type CarUsageType } from "@/lib/usageType";

interface ListingDetailPageProps {
  params: Promise<{ id: string }>;
}

function isKnownUsageType(value: string): value is CarUsageType {
  return value === "zero" || value === "used" || value === "pre_sale";
}

export async function generateMetadata({
  params,
}: ListingDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const { listing } = await getListingDetail(id);
    return { title: `${listing.title} — کارنو` };
  } catch {
    return { title: "آگهی — کارنو" };
  }
}

export default async function ListingDetailPage({
  params,
}: ListingDetailPageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  let data;
  try {
    data = await getListingDetail(id, token);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center px-5 pt-[110px]">
          <div className="shadow-bento max-w-md rounded-[24px] bg-white p-8 text-center">
            <p className="mb-1 text-sm font-bold text-stone-700">
              مشکلی در بارگذاری این آگهی پیش آمد
            </p>
            <p className="text-xs text-stone-400">
              لطفاً چند لحظه دیگر دوباره تلاش کنید.
            </p>
          </div>
        </main>
      </>
    );
  }

  const { listing, related_listings } = data;
  const usageTagClass = isKnownUsageType(listing.usage_type)
    ? USAGE_TYPE_TAG_CLASS[listing.usage_type]
    : "bg-white/90 text-stone-700 shadow-sm";

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-20 pt-[110px]">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
          <nav className="mb-5 text-xs text-stone-400">
            <Link href="/listings" className="hover:text-orange">
              همه آگهی‌ها
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-stone-600">{listing.title}</span>
          </nav>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
            {/* Main content */}
            <div className="space-y-6">
              <ListingGallery images={listing.images} title={listing.title} />

              <div className="shadow-card rounded-[20px] border border-transparent bg-white p-6">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <div className="mb-6 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-bold ${usageTagClass}`}
                      >
                        {listing.usage_type_label}
                      </span>
                      {listing.is_exchange && (
                        <span className="rounded-full border border-sky/10 bg-sky/10 px-3 py-1 text-[11px] font-bold text-sky-500">
                          قابل معاوضه
                        </span>
                      )}
                      {listing.status === "sold" && (
                        <span className="rounded-full bg-stone-700 px-3 py-1 text-[11px] font-bold text-white">
                          {listing.status_label}
                        </span>
                      )}
                    </div>
                    <h1 className="text-xl font-black text-stone-800 sm:text-xl">
                      {listing.title}
                    </h1>
                  </div>
                  <BookmarkButton
                    label={`ذخیره ${listing.title}`}
                    className="h-10 w-10 flex-shrink-0"
                    listingId={listing.id}
                    initialSaved={listing.is_saved}
                  />
                </div>

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

                {listing.usage_type === "pre_sale" && listing.delivery_date && (
                  <p className="mb-4 rounded-xl border border-sky/10 bg-sky/5 px-4 py-2.5 text-xs text-sky-600">
                    تاریخ تحویل: {listing.delivery_date}
                  </p>
                )}

                <div className="flex items-center justify-between border-t border-stone-50 pt-4">
                  <span className="text-2xl font-black text-orange">
                    {listing.sale_type === "negotiable"
                      ? "توافقی"
                      : formatPriceToman(listing.price)}
                  </span>
                  <span className="text-xs text-stone-400">
                    {listing.sale_type_label}
                  </span>
                </div>
              </div>

              <MobileContactBar telLink={listing.contact.tel_link} />

              {listing.description && (
                <div className="shadow-card rounded-[20px] border border-transparent bg-white p-6">
                  <h2 className="mb-3 text-sm font-bold text-stone-800">
                    توضیحات فروشنده
                  </h2>
                  <p className="text-sm leading-relaxed text-stone-500">
                    {listing.description}
                  </p>
                </div>
              )}

              <SpecList spec={listing.spec} />
            </div>

            {/* Sidebar */}
            <div className="space-y-4 lg:sticky lg:top-[130px] lg:self-start">
              <div className="shadow-card hidden rounded-[20px] border border-transparent bg-white p-6 text-center lg:block">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange/10">
                  <svg
                    className="h-7 w-7 text-orange"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                </div>
                <p className="mb-1 text-sm font-bold text-stone-700">
                  تماس با کارنو
                </p>
                <p className="mb-4 text-xs text-stone-400">پشتیبانی ۲۴ ساعته</p>
                <a
                  href={listing.contact.tel_link}
                  className="block w-full rounded-xl bg-orange px-5 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5"
                >
                  تماس با فروشنده
                </a>
              </div>

              <div className="shadow-card rounded-[20px] border border-transparent bg-white p-5">
                <dl className="space-y-2.5 text-xs">
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
                    <dd className="font-semibold text-stone-700">
                      {listing.trim.name}
                    </dd>
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
                  {listing.interior_color && (
                    <div className="flex items-center justify-between">
                      <dt className="flex items-center gap-1.5 text-stone-400">
                        <BeakerIcon />
                        رنگ داخل
                      </dt>
                      <dd className="flex items-center gap-1.5 font-semibold text-stone-700">
                        <span
                          className="h-3 w-3 rounded-full border border-stone-200"
                          style={{
                            backgroundColor: listing.interior_color.hex_code,
                          }}
                        />
                        {listing.interior_color.name}
                      </dd>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <dt className="flex items-center gap-1.5 text-stone-400">
                      <BeakerIcon />
                      وضعیت رنگ
                    </dt>
                    <dd className="font-semibold text-stone-700">
                      {listing.paintwork_status.name}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {related_listings.data.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-5 text-lg font-bold text-stone-800">
                آگهی‌های مشابه
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {related_listings.data.map((related) => (
                  <RelatedListingCard key={related.id} listing={related} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
