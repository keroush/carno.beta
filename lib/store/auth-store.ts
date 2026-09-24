import { create } from "zustand";

/**
 * Tracks whether a server-managed HttpOnly session token exists.
 * The token itself is never readable from the client — this store
 * only mirrors the boolean result of GET /api/session, which checks
 * the incoming cookie server-side.
 */
interface AuthState {
  isAuthenticated: boolean;
  isChecking: boolean;
  userName: string | null;
  setSession: (payload: { authenticated: boolean; userName?: string | null }) => void;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isChecking: true,
  userName: null,
  setSession: ({ authenticated, userName }) =>
    set({ isAuthenticated: authenticated, userName: userName ?? null, isChecking: false }),
  checkSession: async () => {
    try {
      const res = await fetch("/api/session", { cache: "no-store" });
      const data = (await res.json()) as { authenticated: boolean; userName?: string | null };
      set({ isAuthenticated: data.authenticated, userName: data.userName ?? null, isChecking: false });
    } catch {
      set({ isAuthenticated: false, userName: null, isChecking: false });
    }
  },
}));
