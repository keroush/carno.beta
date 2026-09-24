import { BodyTypeSwiper } from "@/components/BodyTypeSwiper";

export function BodyTypeSection() {
  return (
    <section className="py-8 bg-white/80">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-2xl font-black text-stone-800 sm:text-2xl">
            جستجو بر اساس نوع بدنه
          </h2>
          <p className="text-sm text-stone-400">
            خودروی مورد نظرتان را بر اساس شکل بدنه پیدا کنید
          </p>
        </div>

        <BodyTypeSwiper />
      </div>
    </section>
  );
}
