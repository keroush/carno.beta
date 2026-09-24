import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { logout } from "@/lib/authApi";
import { clearSessionCookie, SESSION_COOKIE_NAME } from "@/lib/sessionCookie";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    // Best-effort: even if the upstream call fails (token already invalid,
    // network hiccup, etc.) we still want to drop the local cookie.
    await logout(token).catch(() => undefined);
  }

  clearSessionCookie(cookieStore);
  return NextResponse.json({ message: "خروج با موفقیت انجام شد." });
}
