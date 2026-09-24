import { Suspense } from "react";
import { BentoGrid } from "@/components/BentoGrid";
import { BentoSkeleton } from "@/components/BentoSkeleton";

export function CtaSection() {
  return (
    <section id="about" className="py-16">
      <div className="mx-auto max-w-4xl px-5 sm:px-8 lg:px-10">
        <div className="shadow-bento relative overflow-hidden rounded-[32px] border border-transparent bg-white p-8 text-center sm:p-12">
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/4 rounded-full bg-orange/5" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 -translate-x-1/4 translate-y-1/2 rounded-full bg-sky/5" />

          <div className="relative z-10">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange/10">
              <svg
                className="h-8 w-8 text-orange"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
            </div>
            <h2 className="mb-3 text-2xl font-black text-stone-800 sm:text-3xl">
              صاحب خودرو هستید؟
            </h2>
            <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-stone-400">
              خودروی خود را به راحتی در کارنو ثبت کنید و به هزاران خریدار بالقوه
              دسترسی پیدا کنید. ثبت آگهی رایگان است.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                className="rounded-2xl bg-orange px-8 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,159,67,0.28),0_2px_8px_rgba(0,0,0,0.08)]"
              >
                ثبت آگهی رایگان
              </button>
              <button
                type="button"
                className="rounded-2xl border border-stone-200/80 px-6 py-3.5 text-sm font-semibold text-stone-600 transition-colors duration-300 hover:bg-orange/6 hover:text-orange"
              >
                راهنمای قیمت‌گذاری
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 pt-25">
        <Suspense fallback={<BentoSkeleton />}>
          <BentoGrid />
        </Suspense>
      </div>
    </section>
  );
}
