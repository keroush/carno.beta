"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import { PopularModel } from "@/lib/types";

interface PopularModelsCarouselProps {
  models: PopularModel[];
}

export default function PopularModelsCarousel({
  models,
}: PopularModelsCarouselProps) {
  return (
    <Swiper
      modules={[FreeMode]}
      dir="rtl"
      freeMode
      spaceBetween={12}
      slidesPerView={2.6}
      breakpoints={{
        480: { slidesPerView: 3.6 },
        768: { slidesPerView: 5.2 },
        1024: { slidesPerView: 7.2 },
      }}
      aria-label="مدل‌های محبوب"
    >
      {models.map((model) => (
        <SwiperSlide key={model.id}>
          <Link
            href={`/listings?model=${model.slug}`}
            className="bento-card focus-ring flex flex-col items-center gap-2 p-4 text-center transition-shadow hover:shadow-bento"
          >
            <span className="relative h-14 w-14 overflow-hidden rounded-full bg-orange-100">
              <Image
                src={model.brand.image}
                alt={model.brand.name}
                fill
                sizes="56px"
                className="object-contain p-2"
              />
            </span>
            <span className="line-clamp-1 text-xs font-semibold text-ink-900">
              {model.name}
            </span>
            <span className="text-[11px] text-ink-400">
              {new Intl.NumberFormat("fa-IR").format(model.listings_count)} آگهی
            </span>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
