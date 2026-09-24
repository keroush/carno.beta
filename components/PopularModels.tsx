import { getPopularModels } from "@/lib/api";
import PopularModelsCarousel from "./PopularModelsCarousel";

export default async function PopularModels() {
  const models = await getPopularModels();

  if (models.length === 0) {
    return (
      <p className="bento-card p-6 text-center text-sm text-ink-400">
        مدلی برای نمایش موجود نیست.
      </p>
    );
  }

  return <PopularModelsCarousel models={models} />;
}
