export type CarUsageType = "zero" | "used" | "pre_sale";

export const USAGE_TYPE_LABEL: Record<CarUsageType, string> = {
  zero: "صفر",
  used: "کارکرده",
  pre_sale: "پیش‌فروش / حواله",
};

export const USAGE_TYPE_TAG_CLASS: Record<CarUsageType, string> = {
  zero: "bg-orange text-white shadow-md",
  used: "bg-white/90 text-stone-700 shadow-md border border-stone-100",
  pre_sale: "border border-sky/15 bg-sky/90 text-white shadow-md",
};
