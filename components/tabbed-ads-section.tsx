import { getCarsByType } from "@/lib/mock-data";
import SectionHeader from "./ui/section-header";
import TabbedAdsSwiper from "./tabbed-ads-swiper";

export default async function TabbedAdsSection() {
  const carsByType = await getCarsByType();

  return (
    <section aria-label="Advertisements by type">
      <SectionHeader title="Advertisements by Type" />
      <TabbedAdsSwiper carsByType={carsByType} />
    </section>
  );
}
