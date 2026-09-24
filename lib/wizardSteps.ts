/** The 9 steps that are plain `PUT .../{step}` with a JSON body. */
export const SIMPLE_PUT_STEPS = [
  "brand",
  "model",
  "year",
  "trim",
  "usage",
  "body",
  "location",
  "price",
  "description",
] as const;

export type SimplePutStep = (typeof SIMPLE_PUT_STEPS)[number];

export function isSimplePutStep(value: string): value is SimplePutStep {
  return (SIMPLE_PUT_STEPS as readonly string[]).includes(value);
}

/** The 2 steps with a dependent, live-fetched options list. */
export const DRAFT_OPTIONS_STEPS = ["year-options", "trim-options"] as const;

export type DraftOptionsStep = (typeof DRAFT_OPTIONS_STEPS)[number];

export function isDraftOptionsStep(value: string): value is DraftOptionsStep {
  return (DRAFT_OPTIONS_STEPS as readonly string[]).includes(value);
}

export interface WizardStepDef {
  id: number;
  key: SimplePutStep | "images";
  title: string;
  shortLabel: string;
}

/** The 10 form steps in order (images is its own step, handled by a dedicated multipart route). */
export const WIZARD_STEPS: WizardStepDef[] = [
  { id: 1, key: "brand", title: "برند خودرو", shortLabel: "برند" },
  { id: 2, key: "model", title: "مدل خودرو", shortLabel: "مدل" },
  { id: 3, key: "year", title: "سال ساخت", shortLabel: "سال" },
  { id: 4, key: "trim", title: "تیپ", shortLabel: "تیپ" },
  { id: 5, key: "usage", title: "کارکرد", shortLabel: "کارکرد" },
  { id: 6, key: "body", title: "وضعیت بدنه", shortLabel: "بدنه" },
  { id: 7, key: "location", title: "محل بازدید", shortLabel: "محل بازدید" },
  { id: 8, key: "price", title: "قیمت", shortLabel: "قیمت" },
  { id: 9, key: "description", title: "توضیحات", shortLabel: "توضیحات" },
  { id: 10, key: "images", title: "تصاویر", shortLabel: "تصاویر" },
];

export const REVIEW_STEP_ID = 11;

/**
 * Maps a `missing_fields` entry from the submit-time 422 response back to
 * the step the user needs to revisit. Per the doc, `brand_id` never actually
 * shows up in `missing_fields` (only in the earlier per-step 422s), but it's
 * mapped here too just in case a future backend change surfaces it.
 */
export const MISSING_FIELD_TO_STEP: Record<string, number> = {
  brand_id: 1,
  car_model_id: 2,
  year: 3,
  generation_id: 4,
  trim_id: 4,
  usage_type: 5,
  mileage: 5,
  delivery_date: 5,
  body_color_id: 6,
  interior_color_id: 6,
  paintwork_status_id: 6,
  province_id: 7,
  city_id: 7,
  sale_type: 8,
  price: 8,
  description: 9,
};
