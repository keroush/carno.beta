import { toPersianDigits } from "@/lib/persianNumber";

/** Limits from the auth API doc: first/last name are 2–80 characters. */
export const NAME_MIN = 2;
export const NAME_MAX = 80;

type NameLabel = "نام" | "نام خانوادگی";

/** Same wording as the API's own messages, so client- and server-side errors read identically. */
export function validateName(value: string, label: NameLabel): string | null {
  if (value.length === 0) return `وارد کردن ${label} الزامی است.`;
  if (value.length < NAME_MIN || value.length > NAME_MAX) {
    return `${label} باید بین ${toPersianDigits(NAME_MIN)} تا ${toPersianDigits(NAME_MAX)} کاراکتر باشد.`;
  }
  return null;
}

/** Validation errors in the API's `{ field: [messages] }` shape, or null when both names are fine. Expects trimmed input. */
export function validateNames(firstName: string, lastName: string): Record<string, string[]> | null {
  const errors: Record<string, string[]> = {};
  const first = validateName(firstName, "نام");
  const last = validateName(lastName, "نام خانوادگی");
  if (first) errors.first_name = [first];
  if (last) errors.last_name = [last];
  return Object.keys(errors).length > 0 ? errors : null;
}
