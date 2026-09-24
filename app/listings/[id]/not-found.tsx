import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function ListingNotFound() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen items-center justify-center px-5 pt-[110px]">
        <div className="shadow-bento max-w-md rounded-[24px] bg-white p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange/10">
            <svg className="h-7 w-7 text-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75c0-1.036.84-1.875 1.875-1.875h.75c1.035 0 1.875.84 1.875 1.875v.375c0 .621-.303 1.163-.769 1.5l-.981.7a1.875 1.875 0 0 0-.77 1.5v.175m0 3h.008v.008h-.008v-.008ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-lg font-bold text-stone-800">این آگهی پیدا نشد</h1>
          <p className="mb-6 text-sm text-stone-400">
            این آگهی ممکن است حذف شده، هنوز تایید نشده باشد یا اصلاً وجود نداشته باشد.
          </p>
          <Link href="/listings" className="inline-block rounded-xl bg-orange px-6 py-2.5 text-sm font-semibold text-white shadow-md">
            مشاهده همه آگهی‌ها
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
