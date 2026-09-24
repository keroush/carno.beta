import { getLatestAds } from "@/lib/mock-data";
import SectionHeader from "./ui/section-header";
import SwiperTrack from "./ui/swiper-track";
import CarCard from "./ui/car-card";

export default async function LatestAdsSection() {
  const ads = await getLatestAds();

  return (
    <section aria-label="Latest advertisements">
      <SectionHeader eyebrow="Just listed" title="Latest Advertisements" href="/listings?sort=new" />
      <SwiperTrack ariaLabel="Latest advertisements">
        {ads.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </SwiperTrack>
    </section>
  );
}
