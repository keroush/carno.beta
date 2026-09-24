import { create } from "zustand";

interface SessionState {
  /** Whether the server confirmed an HttpOnly login token is present. `null` = not checked yet. */
  isLoggedIn: boolean | null;
  displayName: string | null;
  setSession: (session: { isLoggedIn: boolean; displayName: string | null }) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  isLoggedIn: null,
  displayName: null,
  setSession: ({ isLoggedIn, displayName }) => set({ isLoggedIn, displayName }),
  clearSession: () => set({ isLoggedIn: false, displayName: null }),
}));
