import "server-only";
import type { cookies as nextCookies } from "next/headers";

export const SESSION_COOKIE_NAME = "karno_session";

type CookieStore = Awaited<ReturnType<typeof nextCookies>>;

const isProduction = process.env.NODE_ENV === "production";

/**
 * The Sanctum bearer token is only ever stored here — HttpOnly, so client-side
 * JS can never read it. Route handlers attach it as `Authorization: Bearer …`
 * when calling the Laravel API on the client's behalf.
 */
export function setSessionCookie(cookies: CookieStore, token: string): void {
  cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    // The API doc: "توکن expire نمی‌شه مگر دستی logout بشه" — no server-side TTL,
    // so the cookie itself doesn't need a short maxAge either.
    maxAge: 60 * 60 * 24 * 365,
  });
}

export function clearSessionCookie(cookies: CookieStore): void {
  cookies.delete(SESSION_COOKIE_NAME);
}
