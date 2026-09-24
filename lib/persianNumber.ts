const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toPersianDigits(value: string | number): string {
  return String(value)
    .split("")
    .map((char) => PERSIAN_DIGITS[Number(char)] ?? char)
    .join("");
}

export function formatKilometers(km: number): string {
  return `${toPersianDigits(km.toLocaleString("en-US"))} کیلومتر`;
}

/**
 * Matches the site's existing price convention (e.g. "۲.۸۵۰ میلیون تومان" for
 * 2,850,000,000 Toman) — raw Toman divided into millions, grouped with "."
 * instead of ",", Persian digits.
 */
export function formatPriceToman(rawToman: number): string {
  const millions = Math.round(rawToman / 1_000_000);
  const grouped = millions.toLocaleString("en-US").replace(/,/g, ".");
  return `${toPersianDigits(grouped)} میلیون تومان`;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Coarse relative-time label in Farsi, matching the "امروز"/"دیروز"/"X روز پیش" style used throughout the mock data. */
export function formatRelativeTime(isoDate: string): string {
  const then = new Date(isoDate).getTime();
  if (Number.isNaN(then)) return "";

  const diffDays = Math.max(0, Math.floor((Date.now() - then) / DAY_MS));

  if (diffDays === 0) return "امروز";
  if (diffDays === 1) return "دیروز";
  if (diffDays < 7) return `${toPersianDigits(diffDays)} روز پیش`;
  if (diffDays < 30) return `${toPersianDigits(Math.floor(diffDays / 7))} هفته پیش`;
  if (diffDays < 365) return `${toPersianDigits(Math.floor(diffDays / 30))} ماه پیش`;
  return `${toPersianDigits(Math.floor(diffDays / 365))} سال پیش`;
}
