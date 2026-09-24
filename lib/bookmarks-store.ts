"use client";

import { create } from "zustand";

interface BookmarksState {
  bookmarkedIds: Set<number>;
  toggle: (listingId: number) => void;
  isBookmarked: (listingId: number) => boolean;
}

/**
 * Session-scoped, client-only. Not persisted to storage on purpose — the
 * brief doesn't ask for cross-session persistence, and wiring it to the
 * real account system belongs with the login token, not local storage.
 */
export const useBookmarksStore = create<BookmarksState>((set, get) => ({
  bookmarkedIds: new Set<number>(),
  toggle: (listingId) =>
    set((state) => {
      const next = new Set(state.bookmarkedIds);
      if (next.has(listingId)) {
        next.delete(listingId);
      } else {
        next.add(listingId);
      }
      return { bookmarkedIds: next };
    }),
  isBookmarked: (listingId) => get().bookmarkedIds.has(listingId),
}));
