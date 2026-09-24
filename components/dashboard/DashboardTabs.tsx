"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { DashboardTab } from "@/types/dashboard-tabs";

const tabs: { id: DashboardTab; label: string }[] = [
  { id: "my-ads", label: "آگهی‌های من" },
  { id: "saved", label: "آگهی‌های ذخیره شده" },
  { id: "verification", label: "احراز هویت" },
  { id: "support", label: "تماس با پشتیبانی" },
];

export function DashboardTabs({ activeTab }: { activeTab: DashboardTab }) {
  const router = useRouter();

  return (
    <div className="flex flex-wrap items-center gap-1 overflow-x-auto border-b border-stone-100 pb-px">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => router.push(`/dashboard?tab=${tab.id}`)}
          className={`relative whitespace-nowrap px-4 py-3 text-sm font-semibold transition-colors ${
            activeTab === tab.id ? "text-orange" : "text-stone-400 hover:text-stone-600"
          }`}
        >
          {tab.label}
          {activeTab === tab.id && <span className="absolute inset-x-3 -bottom-px h-[2px] rounded-full bg-orange" />}
        </button>
      ))}
      <Link
        href="/about"
        className="relative whitespace-nowrap px-4 py-3 text-sm font-semibold text-stone-400 transition-colors hover:text-stone-600"
      >
        درباره ما
      </Link>
    </div>
  );
}
