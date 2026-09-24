import { Navbar } from "@/components/Navbar";

function ResultCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-[20px] bg-white shadow-card">
      <div className="h-40 bg-stone-100" />
      <div className="space-y-2.5 p-4">
        <div className="h-3.5 w-2/3 rounded bg-stone-100" />
        <div className="h-3 w-1/2 rounded bg-stone-100" />
        <div className="h-3 w-1/3 rounded bg-stone-100" />
      </div>
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <div className="hidden animate-pulse rounded-[20px] bg-white p-5 shadow-card lg:block">
      <div className="space-y-6">
        {[0, 1, 2, 3, 4].map((key) => (
          <div key={key} className="space-y-2.5">
            <div className="h-3 w-1/3 rounded bg-stone-100" />
            <div className="h-8 w-full rounded-xl bg-stone-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ListingsLoading() {
  return (
    <>
      <Navbar />
      <div className="fixed inset-x-0 top-[68px] z-40 border-b border-stone-100 bg-white/95 backdrop-blur-sm lg:hidden">
        <div className="flex animate-pulse items-center gap-2 px-4 py-2.5">
          <div className="h-8 w-20 flex-shrink-0 rounded-full bg-stone-200" />
          <div className="h-8 w-16 flex-shrink-0 rounded-full bg-stone-100" />
          <div className="h-8 w-24 flex-shrink-0 rounded-full bg-stone-100" />
          <div className="h-8 w-20 flex-shrink-0 rounded-full bg-stone-100" />
        </div>
      </div>

      <main className="min-h-screen pb-20 pt-[166px] lg:pt-[110px]" aria-busy="true" aria-label="در حال بارگذاری آگهی‌ها">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-8 animate-pulse space-y-2">
            <div className="h-7 w-48 rounded bg-stone-100" />
            <div className="h-4 w-32 rounded bg-stone-100" />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
            <SidebarSkeleton />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((key) => (
                <ResultCardSkeleton key={key} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
