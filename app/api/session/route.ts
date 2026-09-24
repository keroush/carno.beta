import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AuthApiError, getMe } from "@/lib/authApi";
import { clearSessionCookie, SESSION_COOKIE_NAME } from "@/lib/sessionCookie";

function displayNameFor(user: { first_name: string | null; last_name: string | null; mobile: string }): string {
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");
  return fullName.length > 0 ? fullName : user.mobile;
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ isLoggedIn: false, displayName: null });
  }

  try {
    const { user } = await getMe(token);
    return NextResponse.json({ isLoggedIn: true, displayName: displayNameFor(user) });
  } catch (error) {
    // An invalid/expired token means "not logged in" from the UI's point of view.
    if (error instanceof AuthApiError && error.status === 401) {
      clearSessionCookie(cookieStore);
    }
    return NextResponse.json({ isLoggedIn: false, displayName: null });
  }
}
