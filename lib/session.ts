import "server-only";
import { cookies } from "next/headers";

export interface SessionInfo {
  hasSession: boolean;
  userLabel: string | null;
}

const SESSION_COOKIE_NAME = "session_token";

/**
 * Server-only: reads presence of the HttpOnly session cookie. The token
 * value itself is never returned or sent to the client — only a boolean and
 * an optional display label, which is all the UI is allowed to know.
 */
export async function getSessionInfo(): Promise<SessionInfo> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME);

  return {
    hasSession: Boolean(token?.value),
    userLabel: token?.value ? "کاربر" : null,
  };
}
