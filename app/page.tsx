import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { BrandGrid } from "@/components/BrandGrid";
import { BodyTypeSection } from "@/components/BodyTypeSection";
import { FeaturedAdsSection } from "@/components/FeaturedAdsSection";
import { ListingsSection } from "@/components/ListingsSection";
import { CtaSection } from "@/components/CtaSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        <Hero />

        <div className="mx-auto max-w-md px-8">
          <div className="divider-gradient" />
        </div>

        <div className="mx-auto max-w-md px-8">
          <div className="divider-gradient" />
        </div>

        <ListingsSection />

        <BodyTypeSection />

        <FeaturedAdsSection />

        <div className="mx-auto max-w-md px-8">
          <div className="divider-gradient" />
        </div>

        <BrandGrid />

        <div className="mx-auto max-w-md px-8">
          <div className="divider-gradient" />
        </div>

        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
