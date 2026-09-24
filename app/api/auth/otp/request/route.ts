import { NextResponse } from "next/server";
import { AuthApiError, requestOtp } from "@/lib/authApi";

interface RequestBody {
  mobile?: unknown;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as RequestBody;
  const mobile = typeof body.mobile === "string" ? body.mobile : "";

  if (!/^09\d{9}$/.test(mobile)) {
    return NextResponse.json(
      {
        message: "شماره موبایل معتبر نیست. فرمت صحیح: 09xxxxxxxxx",
        errors: { mobile: ["شماره موبایل معتبر نیست. فرمت صحیح: 09xxxxxxxxx"] },
      },
      { status: 422 },
    );
  }

  try {
    const result = await requestOtp(mobile);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AuthApiError) {
      return NextResponse.json(error.payload, { status: error.status });
    }
    return NextResponse.json({ message: "خطای غیرمنتظره رخ داد." }, { status: 500 });
  }
}
