"use client";

import Link from "next/link";
import { useDragCarousel } from "@/components/useDragCarousel";
import {
  ConvertibleIcon,
  CoupeIcon,
  CrossoverIcon,
  PickupIcon,
  VanIcon,
} from "@/components/BodyTypeIcons";

const bodyTypes = [
  { id: "van", label: "ون", Icon: VanIcon },
  { id: "convertible", label: "کروک", Icon: ConvertibleIcon },
  { id: "coupe", label: "کوپه", Icon: CoupeIcon },
  { id: "pickup", label: "وانت", Icon: PickupIcon },
  { id: "crossover", label: "کراس‌اوور", Icon: CrossoverIcon },
  { id: "sedan", label: "سدان", Icon: CoupeIcon },
  { id: "hatchback", label: "هاچبک", Icon: CrossoverIcon },
  { id: "suv", label: "شاسی‌بلند", Icon: CrossoverIcon },
] as const;

type BodyType = (typeof bodyTypes)[number];

/** Same card language as «برندهای محبوب»: white rounded card, tinted tile, bold small label. */
function BodyTypeCard({ id, label, Icon }: BodyType) {
  return (
    <Link
      href={`/listings?bodyType=${id}`}
      draggable={false}
      className="shadow-bento group flex h-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-transparent bg-white p-3 transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.03] hover:border-orange/10 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06),0_0_0_1px_rgba(255,159,67,0.10)]"
    >
      <span className="mb-2 flex h-11 w-full items-center justify-center rounded-xl bg-warm-50 transition-transform duration-300 group-hover:scale-[1.06]">
        <Icon className="h-auto w-4/5 max-w-[76px]" />
      </span>
      <span className="text-center text-xs font-bold leading-4 text-stone-700 transition-colors group-hover:text-orange">
        {label}
      </span>
    </Link>
  );
}

/** Eight per view from lg up, so all of today's body types fit; more than that makes the swiper scroll. */
const SLIDE_BASIS = "min-w-0 shrink-0 grow-0 basis-[12.5%] px-1.5";

function Arrow({ direction, onClick, disabled }: { direction: "prev" | "next"; onClick: () => void; disabled: boolean }) {
  const isPrev = direction === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? "نوع بدنه قبلی" : "نوع بدنه بعدی"}
      disabled={disabled}
      className={`shadow-bento absolute ${
        isPrev ? "-right-4" : "-left-4"
      } top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-stone-100 bg-white text-stone-400 transition-all duration-300 hover:text-orange disabled:opacity-30`}
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d={isPrev ? "m9 5 7 7-7 7" : "m15 19-7-7 7-7"} />
      </svg>
    </button>
  );
}

function BodyTypeCarousel() {
  const { trackProps, canGoPrev, canGoNext, stepBy } = useDragCarousel({ slideCount: bodyTypes.length });
  const scrollable = canGoPrev || canGoNext;

  return (
    <div className="relative">
      {scrollable && <Arrow direction="prev" onClick={() => stepBy(-1)} disabled={!canGoPrev} />}
      {scrollable && <Arrow direction="next" onClick={() => stepBy(1)} disabled={!canGoNext} />}

      <div className="overflow-hidden px-1 py-3">
        <div
          {...trackProps}
          className="flex cursor-grab select-none active:cursor-grabbing [&_a]:[-webkit-user-drag:none] [&_img]:[-webkit-user-drag:none]"
        >
          {bodyTypes.map((type) => (
            <div key={type.id} className={SLIDE_BASIS}>
              <BodyTypeCard {...type} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BodyTypeSwiper() {
  return (
    <>
      {/* Phones and tablets: no swiping — everything is visible, 3 per row (4 from sm). */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:hidden">
        {bodyTypes.map((type) => (
          <BodyTypeCard key={type.id} {...type} />
        ))}
      </div>

      {/* Desktop: the swiper stays (new body types can be added later), sized so all fit today. */}
      <div className="hidden lg:block">
        <BodyTypeCarousel />
      </div>
    </>
  );
}
