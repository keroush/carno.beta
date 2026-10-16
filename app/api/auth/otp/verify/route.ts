import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AuthApiError, verifyOtp } from "@/lib/authApi";
import { setSessionCookie } from "@/lib/sessionCookie";

interface RequestBody {
  mobile?: unknown;
  code?: unknown;
  first_name?: unknown;
  last_name?: unknown;
}

const NAME_MIN = 2;
const NAME_MAX = 80;

function readName(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as RequestBody;
  const mobile = typeof body.mobile === "string" ? body.mobile : "";
  const code = typeof body.code === "string" ? body.code : "";

  if (!/^09\d{9}$/.test(mobile) || !/^\d{5}$/.test(code)) {
    return NextResponse.json({ message: "کد تایید نامعتبر یا منقضی شده است." }, { status: 422 });
  }

  // Names are only for sign-up (a number with no account yet). The client leaves
  // them out for a normal login and only adds them after the API answers that
  // they're required — so "absent" is valid here, and the API itself is the
  // authority on whether this number needs them. If they *are* sent, check them
  // with the API's own limits so an obviously bad value never costs a round trip.
  const firstName = readName(body.first_name);
  const lastName = readName(body.last_name);
  const hasName = firstName.length > 0 || lastName.length > 0;

  if (hasName) {
    const errors: Record<string, string[]> = {};
    if (firstName.length === 0) errors.first_name = ["وارد کردن نام الزامی است."];
    else if (firstName.length < NAME_MIN || firstName.length > NAME_MAX) {
      errors.first_name = [`نام باید بین ${NAME_MIN} تا ${NAME_MAX} کاراکتر باشد.`];
    }
    if (lastName.length === 0) errors.last_name = ["وارد کردن نام خانوادگی الزامی است."];
    else if (lastName.length < NAME_MIN || lastName.length > NAME_MAX) {
      errors.last_name = [`نام خانوادگی باید بین ${NAME_MIN} تا ${NAME_MAX} کاراکتر باشد.`];
    }
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ message: "نام یا نام خانوادگی نامعتبر است.", errors }, { status: 422 });
    }
  }

  try {
    const result = await verifyOtp(mobile, code, hasName ? { firstName, lastName } : undefined);

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
