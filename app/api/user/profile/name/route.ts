import { NextResponse } from "next/server";
import { withAuthProxy } from "@/lib/apiProxy";
import { validateNames } from "@/lib/nameValidation";
import { updateProfileName } from "@/lib/userPanelApi";

export async function PUT(request: Request) {
  const body = await request.json().catch(() => ({}));
  const firstName = typeof body.first_name === "string" ? body.first_name.trim() : "";
  const lastName = typeof body.last_name === "string" ? body.last_name.trim() : "";

  const errors = validateNames(firstName, lastName);
  if (errors) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  return withAuthProxy((token) => updateProfileName(token, firstName, lastName));
}
