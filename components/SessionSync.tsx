"use client";

import { useEffect } from "react";
import { useSessionStore } from "@/lib/store";

interface SessionPayload {
  isLoggedIn: boolean;
  displayName: string | null;
}

/**
 * Mounted once near the root. Asks the server whether the HttpOnly
 * session cookie is valid, then mirrors that boolean into Zustand so
 * client components (Navbar, etc.) can react to auth state without
 * ever touching the token itself.
 */
export function SessionSync() {
  const setSession = useSessionStore((state) => state.setSession);

  useEffect(() => {
    let cancelled = false;

    async function syncSession() {
      try {
        const res = await fetch("/api/session", { cache: "no-store" });
        if (!res.ok) throw new Error("Session check failed");
        const data = (await res.json()) as SessionPayload;
        if (!cancelled) setSession(data);
      } catch {
        if (!cancelled) setSession({ isLoggedIn: false, displayName: null });
      }
    }

    void syncSession();

    return () => {
      cancelled = true;
    };
  }, [setSession]);

  return null;
}
