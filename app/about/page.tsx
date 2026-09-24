import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "درباره ما — کارنو",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-20 pt-[110px]">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 lg:px-10">
          <h1 className="mb-4 text-2xl font-black text-stone-800 sm:text-3xl">
            درباره کارنو
          </h1>
          <p className="mb-4 text-sm leading-relaxed text-stone-500">
            کارنو بزرگترین بازارگاه خودروی ایران است که با هدف شفاف‌سازی قیمت‌ها
            و تسهیل فرآیند خرید و فروش خودرو راه‌اندازی شده. از ثبت آگهی رایگان
            تا اجاره بلندمدت بدون ضامن و بررسی‌های تخصصی خودرو، همه چیز در یک
            جا.
          </p>
          <p className="text-sm leading-relaxed text-stone-500">
            تیم کارنو متشکل از کارشناسان صنعت خودرو و توسعه‌دهندگان محصول است که
            هر روز روی بهبود تجربه خرید و فروش خودرو در ایران کار می‌کنند.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
