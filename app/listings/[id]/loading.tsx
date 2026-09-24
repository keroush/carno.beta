import { Navbar } from "@/components/Navbar";

export default function ListingDetailLoading() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-20 pt-[110px]" aria-busy="true" aria-label="در حال بارگذاری آگهی">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
          <div className="mb-5 h-3 w-40 animate-pulse rounded bg-stone-100" />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
            <div className="animate-pulse space-y-6">
              <div className="h-72 rounded-[24px] bg-stone-100 sm:h-96" />

              <div className="space-y-4 rounded-[20px] bg-white p-6 shadow-card">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-16 rounded-full bg-stone-100" />
                  <div className="h-6 w-20 rounded-full bg-stone-100" />
                </div>
                <div className="h-6 w-2/3 rounded bg-stone-100" />
                <div className="flex flex-wrap gap-4">
                  <div className="h-3 w-16 rounded bg-stone-100" />
                  <div className="h-3 w-16 rounded bg-stone-100" />
                  <div className="h-3 w-24 rounded bg-stone-100" />
                </div>
                <div className="h-8 w-40 rounded bg-stone-100" />
              </div>

              <div className="space-y-3 rounded-[20px] bg-white p-6 shadow-card">
                <div className="h-4 w-24 rounded bg-stone-100" />
                <div className="h-3 w-full rounded bg-stone-100" />
                <div className="h-3 w-5/6 rounded bg-stone-100" />
              </div>

              <div className="space-y-3 rounded-[20px] bg-white p-6 shadow-card">
                <div className="h-4 w-28 rounded bg-stone-100" />
                <div className="grid grid-cols-2 gap-3">
                  {[0, 1, 2, 3].map((key) => (
                    <div key={key} className="h-3 rounded bg-stone-100" />
                  ))}
                </div>
              </div>
            </div>

            <div className="animate-pulse space-y-4">
              <div className="space-y-3 rounded-[20px] bg-white p-6 text-center shadow-card">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-stone-100" />
                <div className="mx-auto h-3 w-24 rounded bg-stone-100" />
                <div className="h-10 w-full rounded-xl bg-stone-100" />
              </div>
              <div className="space-y-2.5 rounded-[20px] bg-white p-5 shadow-card">
                {[0, 1, 2, 3].map((key) => (
                  <div key={key} className="h-3 rounded bg-stone-100" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
