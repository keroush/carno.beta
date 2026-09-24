import { TrendingUp } from "lucide-react";
import { getHighDemandCars } from "@/lib/mock-data";
import SectionHeader from "./ui/section-header";
import SwiperTrack from "./ui/swiper-track";
import CarCard from "./ui/car-card";

export default async function HighDemandSection() {
  const cars = await getHighDemandCars();

  return (
    <section aria-label="High-demand models">
      <SectionHeader eyebrow="Right now" title="High-Demand Models" href="/listings?sort=demand" />
      <SwiperTrack ariaLabel="High-demand models">
        {cars.map((car, i) => (
          <div key={car.id} className={i === 0 ? "glow-ring rounded-[var(--radius-card)]" : ""}>
            <CarCard car={car} rank={i + 1} />
          </div>
        ))}
      </SwiperTrack>
      <p className="flex items-center gap-1.5 px-4 pt-3 text-[11px] text-[var(--color-text-mute)] lg:px-8">
        <TrendingUp size={12} className="text-[var(--color-orange)]" />
        Ranked by verified lease activity this week
      </p>
    </section>
  );
}
