import { SearchBar } from "@/components/SearchBar";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative pt-[110px] pb-1 bg-white/100">
      <Image
        alt={"new"}
        width={2000}
        height={2000}
        src={
          "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop"
        }
        className="absolute inset-0 w-full h-full object-cover opacity-3"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h1 className="mb-5 text-[2.6rem] font-black leading-[1.15] tracking-tight text-stone-800 sm:text-[3.4rem] lg:text-[2.5rem]">
            خودروی ایده‌آلتان را{" "}
            <span className="relative inline-block text-orange">
              پیدا کنید
              <svg
                className="absolute -bottom-1 left-0 right-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 8C40 2 80 2 100 5C120 8 160 8 198 3"
                  stroke="#ff9f43"
                  strokeWidth={3}
                  strokeLinecap="round"
                  opacity={0.35}
                />
              </svg>
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-stone-500 sm:text-l">
            بزرگترین بازارگاه خودروی ایران با امکان اجاره بلندمدت، خرید و فروش
            آسان، و بررسی تخصصی خودروهای روز
          </p>

          <SearchBar />
        </div>
      </div>
    </section>
  );
}
