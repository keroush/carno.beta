import type { CarListing } from "@/types/listing";

export type MyAdStatus = "active" | "incomplete" | "inactive";

export interface MyAdListing extends CarListing {
  status: MyAdStatus;
  /** Only meaningful for "incomplete" ads — how much of the listing form is filled in. */
  completionPercent?: number;
  /** Only meaningful for "inactive" ads — why it's off the market. */
  inactiveReason?: string;
}

export interface SavedAdListing extends CarListing {
  savedAt: string;
}
