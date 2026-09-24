import Image from "next/image";
import {
  getFeaturedListing,
  getMarketStats,
  getSecondaryListings,
} from "@/data/listings";
import { BookmarkButton } from "@/components/BookmarkButton";
import { Reveal } from "@/components/Reveal";
import {
  CalendarIcon,
  EyeIcon,
  GaugeIcon,
  PinIcon,
} from "@/components/CardMetaIcons";
import { formatKilometers } from "@/lib/persianNumber";
import { USAGE_TYPE_LABEL, USAGE_TYPE_TAG_CLASS } from "@/lib/usageType";
import type { MarketStat } from "@/types/listing";

const statTone: Record<MarketStat["tone"], string> = {
  orange: "bg-warm-50/50 border-warm-100/40 text-orange",
  sky: "bg-sky-50/50 border-sky-100/40 text-sky-400",
  neutral: "bg-paleblue/30 border-sky-100/30 text-stone-700",
  peach: "bg-peach/30 border-warm-100/30 text-stone-700",
};

export async function BentoGrid() {
  const [featured, stats, secondary] = await Promise.all([
    getFeaturedListing(),
    getMarketStats(),
    getSecondaryListings(),
  ]);
  const [bmw, porsche] = secondary;

  return (
    <div className="grid auto-rows-[minmax(160px,auto)] grid-cols-12 gap-3.5">
      {/* Large feature card */}
      <Reveal className="shadow-bento group relative col-span-12 row-span-2 cursor-pointer overflow-hidden rounded-[28px] border border-transparent bg-white transition-all hover:-translate-y-1 hover:border-orange/10 lg:col-span-7">
        <div className="absolute inset-0 bg-gradient-to-bl from-warm-50/60 via-transparent to-transparent" />
        <div className="relative flex h-full flex-col sm:flex-row">
          <div className="z-10 flex flex-col justify-center p-7 sm:w-1/2 sm:p-9">
            <div className="mb-4 flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-bold ${USAGE_TYPE_TAG_CLASS[featured.usageType]}`}
              >
                {USAGE_TYPE_LABEL[featured.usageType]}
              </span>
              {/* <span className="rounded-full border border-sky/10 bg-sky/10 px-3 py-1 text-[11px] font-bold text-sky-400">
                اجاره بلندمدت
              </span> */}
            </div>
            <h3 className="mb-2 text-[1.6rem] font-bold leading-snug text-stone-800 sm:text-[1.9rem]">
              {featured.title}
            </h3>
            <p className="mb-5 text-sm leading-relaxed text-stone-400">
              موتور ۲.۵ لیتری، توربوشارژر، صفحه نمایش ۱۲.۳ اینچی با گارانتی ۵
              ساله
            </p>
            <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-stone-400">
              <span className="flex items-center gap-1">
                <CalendarIcon />
                {featured.year}
              </span>
              {featured.usageType === "used" &&
                featured.mileage !== undefined && (
                  <span className="flex items-center gap-1">
                    <GaugeIcon />
                    {formatKilometers(featured.mileage)}
                  </span>
                )}
              <span className="flex items-center gap-1">
                <PinIcon />
                {featured.city}
              </span>
              <span className="flex items-center gap-1">
                <EyeIcon />
                {featured.views} بازدید
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-gradient-to-br from-orange to-warm-500 px-5 py-2.5 text-sm font-bold text-white shadow-md">
                {featured.price}
              </span>
              <BookmarkButton
                label="ذخیره هیوندای سانتافه"
                className="h-10 w-10"
              />
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[20px] sm:w-1/2">
            <Image
              src={featured.image}
              alt={featured.imageAlt}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="min-h-[220px] object-cover transition-transform duration-700 group-hover:scale-[1.06] sm:min-h-0"
            />
          </div>
        </div>
      </Reveal>

      {/* Market stats */}
      <Reveal
        delayMs={50}
        className="shadow-bento col-span-12 flex flex-col justify-between rounded-[28px] border border-transparent bg-white p-7 hover:border-orange/10 sm:col-span-6 lg:col-span-5"
      >
        <div>
          <div className="mb-5 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-warm-50">
              <svg
                className="h-[18px] w-[18px] text-orange"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5"
                />
              </svg>
            </div>
            <span className="text-sm font-bold text-stone-700">آمار بازار</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className={`rounded-2xl border p-3.5 text-center ${statTone[stat.tone]}`}
              >
                <div className="mb-1 text-[1.5rem] font-black leading-none [font-variant-numeric:tabular-nums]">
                  {stat.value}
                </div>
                <div className="text-[11px] font-medium text-stone-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Quick filter: budget */}
      <Reveal
        delayMs={100}
        className="shadow-bento group col-span-6 flex cursor-pointer flex-col items-center justify-center rounded-[28px] border border-transparent bg-white p-6 text-center hover:border-orange/10 sm:col-span-3 lg:col-span-2"
      >
        <div className="shadow-glow mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-warm-50 transition-colors duration-300 group-hover:bg-orange">
          <svg
            className="h-6 w-6 text-orange transition-colors duration-300 group-hover:text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.171-.879-1.171-2.303 0-3.182.553-.44 1.278-.659 2.003-.659.725 0 1.45.22 2.003.659"
            />
          </svg>
        </div>
        <span className="text-sm font-bold text-stone-700">زیر ۵۰۰ میلیون</span>
        <span className="mt-1 text-[11px] text-stone-400">۳,۲۰۰ خودرو</span>
      </Reveal>

      {/* Quick filter: installment */}
      <Reveal
        delayMs={150}
        className="shadow-bento group col-span-6 flex cursor-pointer flex-col items-center justify-center rounded-[28px] border border-transparent bg-white p-6 text-center hover:border-orange/10 sm:col-span-3 lg:col-span-3"
      >
        <div className="shadow-soft mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 transition-colors duration-300 group-hover:bg-sky-300">
          <svg
            className="h-6 w-6 text-sky-400 transition-colors duration-300 group-hover:text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
            />
          </svg>
        </div>
        <span className="text-sm font-bold text-stone-700">شرایط اقساطی</span>
        <span className="mt-1 text-[11px] text-stone-400">بدون ضامن</span>
      </Reveal>

      {/* Leasing promo */}
      <Reveal
        delayMs={200}
        className="shadow-bento group relative col-span-12 overflow-hidden rounded-[28px] border border-transparent bg-white hover:border-orange/10 sm:col-span-6 lg:col-span-5"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-paleblue/40 via-transparent to-warm-50/30" />
        <div className="relative flex h-full flex-row-reverse items-center gap-5 p-7">
          <div className="flex-1">
            <span className="mb-3 inline-block rounded-lg border border-sky/10 bg-sky/10 px-2.5 py-0.5 text-[10px] font-bold text-sky-500">
              جدید
            </span>
            {/* <h3 className="mb-1.5 text-lg font-bold text-stone-800">اجاره بلندمدت خودرو</h3> */}
            <p className="mb-4 text-xs leading-relaxed text-stone-400">
              از ۶ ماه تا ۳ سال با بهترین شرایط و بدون نیاز به ضامن
            </p>
            <button
              type="button"
              className="rounded-xl bg-orange px-5 py-2 text-xs font-bold text-white transition-transform duration-300 hover:-translate-y-0.5"
            >
              مشاهده شرایط
            </button>
          </div>
          <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl">
            <Image
              src="https://images.unsplash.com/photo-1549317661-bd32c7ce0dbb?w=300&h=300&fit=crop"
              alt="اجاره خودرو"
              fill
              sizes="112px"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            />
          </div>
        </div>
      </Reveal>

      {/* Sedan card */}
      {bmw && (
        <Reveal
          delayMs={250}
          className="shadow-bento group col-span-12 cursor-pointer overflow-hidden rounded-[28px] border border-transparent bg-white hover:border-orange/10 sm:col-span-6 lg:col-span-4"
        >
          <div className="relative h-44 overflow-hidden">
            <Image
              src={bmw.image}
              alt={bmw.imageAlt}
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            />
            <span
              className={`absolute top-3 left-3 rounded-full px-3 py-1 text-[10px] font-bold ${USAGE_TYPE_TAG_CLASS[bmw.usageType]}`}
            >
              {USAGE_TYPE_LABEL[bmw.usageType]}
            </span>
            <BookmarkButton
              label={`ذخیره ${bmw.title}`}
              variant="glass"
              className="absolute top-3 right-3 h-9 w-9 bg-white/90 shadow-sm"
            />
          </div>
          <div className="p-5">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-base font-bold text-stone-800">
                {bmw.title}
              </h3>
              <span className="flex items-center gap-1 text-[11px] text-stone-300">
                <EyeIcon />
                {bmw.views}
              </span>
            </div>
            <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-stone-400">
              <span className="flex items-center gap-1">
                <CalendarIcon />
                {bmw.year}
              </span>
              {bmw.usageType === "used" && bmw.mileage !== undefined && (
                <span className="flex items-center gap-1">
                  <GaugeIcon />
                  {formatKilometers(bmw.mileage)}
                </span>
              )}
              <span>{bmw.transmission}</span>
              <span className="flex items-center gap-1">
                <PinIcon />
                {bmw.city}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-orange">
                {bmw.price}
              </span>
              <span className="text-[11px] text-stone-300">
                {bmw.priceLabel}
              </span>
            </div>
          </div>
        </Reveal>
      )}

      {/* Compact card */}
      {porsche && (
        <Reveal
          delayMs={300}
          className="shadow-bento group col-span-12 cursor-pointer overflow-hidden rounded-[28px] border border-transparent bg-white hover:border-orange/10 sm:col-span-6 lg:col-span-3"
        >
          <div className="relative h-36 overflow-hidden">
            <Image
              src={porsche.image}
              alt={porsche.imageAlt}
              fill
              sizes="(min-width: 1024px) 25vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            />
            <span
              className={`absolute top-3 left-3 rounded-full px-3 py-1 text-[10px] font-bold ${USAGE_TYPE_TAG_CLASS[porsche.usageType]}`}
            >
              {USAGE_TYPE_LABEL[porsche.usageType]}
            </span>
            <BookmarkButton
              label={`ذخیره ${porsche.title}`}
              variant="glass"
              className="absolute top-3 right-3 h-9 w-9 bg-white/90 shadow-sm"
            />
          </div>
          <div className="p-5">
            <h3 className="mb-1 text-sm font-bold text-stone-800">
              {porsche.title}
            </h3>
            <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-stone-300">
              <span className="flex items-center gap-1">
                <EyeIcon />
                {porsche.views}
              </span>
              {porsche.usageType === "used" &&
                porsche.mileage !== undefined && (
                  <span className="flex items-center gap-1">
                    <GaugeIcon />
                    {formatKilometers(porsche.mileage)}
                  </span>
                )}
            </div>
            <span className="text-sm font-black text-orange">
              {porsche.price}
            </span>
          </div>
        </Reveal>
      )}
    </div>
  );
}
