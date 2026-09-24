import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AuthApiError, getMe } from "@/lib/authApi";
import { clearSessionCookie, SESSION_COOKIE_NAME } from "@/lib/sessionCookie";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  try {
    const result = await getMe(token);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AuthApiError) {
      if (error.status === 401) {
        clearSessionCookie(cookieStore);
      }
      return NextResponse.json(error.payload, { status: error.status });
    }
    return NextResponse.json({ message: "خطای غیرمنتظره رخ داد." }, { status: 500 });
  }
}
