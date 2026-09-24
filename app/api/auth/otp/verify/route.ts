import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AuthApiError, verifyOtp } from "@/lib/authApi";
import { setSessionCookie } from "@/lib/sessionCookie";

interface RequestBody {
  mobile?: unknown;
  code?: unknown;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as RequestBody;
  const mobile = typeof body.mobile === "string" ? body.mobile : "";
  const code = typeof body.code === "string" ? body.code : "";

  if (!/^09\d{9}$/.test(mobile) || !/^\d{5}$/.test(code)) {
    return NextResponse.json({ message: "کد تایید نامعتبر یا منقضی شده است." }, { status: 422 });
  }

  try {
    const result = await verifyOtp(mobile, code);

    // The token never leaves the server: it's written to an HttpOnly cookie here,
    // and only { message, user } is handed back to client-side JS.
    const cookieStore = await cookies();
    setSessionCookie(cookieStore, result.token);

    return NextResponse.json({ message: result.message, user: result.user });
  } catch (error) {
    if (error instanceof AuthApiError) {
      return NextResponse.json(error.payload, { status: error.status });
    }
    return NextResponse.json({ message: "خطای غیرمنتظره رخ داد." }, { status: 500 });
  }
}
