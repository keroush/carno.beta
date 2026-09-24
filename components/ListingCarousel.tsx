"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import { Listing } from "@/lib/types";
import ListingCard from "./ListingCard";

interface ListingCarouselProps {
  listings: Listing[];
}

export default function ListingCarousel({ listings }: ListingCarouselProps) {
  return (
    <Swiper
      modules={[FreeMode, Navigation]}
      dir="rtl"
      freeMode
      navigation
      spaceBetween={16}
      slidesPerView={1.2}
      breakpoints={{
        480: { slidesPerView: 2.2 },
        768: { slidesPerView: 3.2 },
        1024: { slidesPerView: 4.2 },
      }}
      className="!pb-2 [--swiper-navigation-color:#ff9f43] [--swiper-navigation-size:20px]"
      aria-label="آگهی‌های خودرو"
    >
      {listings.map((listing) => (
        <SwiperSlide key={listing.id} className="h-auto">
          <ListingCard listing={listing} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
