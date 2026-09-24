"use client";

import { useEffect } from "react";
import { useSessionStore } from "@/lib/store";

interface SessionHydratorProps {
  hasSession: boolean;
  userLabel: string | null;
}

/**
 * Bridges server -> client: a Server Component checks for the HttpOnly
 * session cookie (never readable by client JS) and passes the resulting
 * boolean here. This component's only job is to push that into the store
 * once on mount so <Header /> can react to it.
 */
export default function SessionHydrator({
  hasSession,
  userLabel,
}: SessionHydratorProps) {
  const setSession = useSessionStore((s) => s.setSession);

  useEffect(() => {
    setSession(hasSession, userLabel);
  }, [hasSession, userLabel, setSession]);

  return null;
}
