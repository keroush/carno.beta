import { NextResponse } from "next/server";
import { withAuthProxy } from "@/lib/apiProxy";
import { setNationalCode } from "@/lib/userPanelApi";

export async function PUT(request: Request) {
  const body = await request.json().catch(() => ({}));
  const nationalCode = typeof body.national_code === "string" ? body.national_code : "";

  if (!/^\d{10}$/.test(nationalCode)) {
    return NextResponse.json({ errors: { national_code: ["کد ملی باید ۱۰ رقم باشد."] } }, { status: 422 });
  }

  return withAuthProxy((token) => setNationalCode(token, nationalCode));
}
