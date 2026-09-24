export function formatPrice(price: number, currency = "$"): string {
  return `${currency}${price.toLocaleString("en-US")}`;
}

export function formatMileage(km: number): string {
  if (km === 0) return "0 mi";
  const miles = Math.round(km * 0.621371);
  return `${miles.toLocaleString("en-US")} mi`;
}

export function formatViews(views: number): string {
  if (views >= 1000) return `${(views / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(views);
}

export const USAGE_LABEL: Record<"new" | "used" | "pre_sale", string> = {
  new: "New",
  used: "Used",
  pre_sale: "Pre-Sale",
};
