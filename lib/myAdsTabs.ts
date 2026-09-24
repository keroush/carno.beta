import type { MyAdApiStatus } from "@/types/userPanel";

export const MY_AD_STATUSES: MyAdApiStatus[] = ["active", "incomplete", "inactive"];

export function isMyAdApiStatus(value: string): value is MyAdApiStatus {
  return (MY_AD_STATUSES as string[]).includes(value);
}

export const MY_AD_STATUS_LABEL: Record<MyAdApiStatus, string> = {
  active: "فعال",
  incomplete: "تکمیل نشده",
  inactive: "غیرفعال",
};
