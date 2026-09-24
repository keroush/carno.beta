"use client";

import { useState } from "react";
import { SavedAdCard } from "@/components/dashboard/SavedAdCard";
import { userPanelApi, UserPanelApiError } from "@/lib/userPanelClient";
import type { SavedListingEntry } from "@/types/userPanel";

export function SavedAdsList({ entries }: { entries: SavedListingEntry[] }) {
  const [savedEntries, setSavedEntries] = useState(entries);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRemove(listingId: number) {
    setError(null);
    setRemovingId(listingId);
    try {
      await userPanelApi.unsaveListing(listingId);
      setSavedEntries((prev) => prev.filter((entry) => entry.listing.id !== listingId));
    } catch (err) {
      setError(err instanceof UserPanelApiError ? err.message : "حذف آگهی با خطا مواجه شد.");
    } finally {
      setRemovingId(null);
    }
  }

  if (savedEntries.length === 0) {
    return (
      <div className="shadow-card rounded-[20px] border border-dashed border-stone-200 bg-white/60 p-10 text-center text-sm text-stone-400">
        هنوز آگهی‌ای ذخیره نکرده‌اید.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-xs text-red-600">{error}</div>
      )}
      {savedEntries.map((entry) => (
        <SavedAdCard
          key={entry.saved_id}
          entry={entry}
          onRemove={handleRemove}
          isRemoving={removingId === entry.listing.id}
        />
      ))}
    </div>
  );
}
