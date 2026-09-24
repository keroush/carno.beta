import "server-only";
import { NextResponse } from "next/server";
import { ApiError } from "@/lib/apiError";
import { getSessionToken } from "@/lib/requireSession";

/**
 * Runs `handler` with the caller's session token, relaying upstream errors
 * (422/403/409/etc.) verbatim so the client sees the exact shape the API
 * docs specify. Returns 401 up front if there's no session at all.
 */
export async function withAuthProxy<T>(
  handler: (token: string) => Promise<T>,
  successStatus = 200,
): Promise<NextResponse> {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  try {
    const result = await handler(token);
    return NextResponse.json(result, { status: successStatus });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(error.payload, { status: error.status });
    }
    return NextResponse.json({ message: "خطای غیرمنتظره رخ داد." }, { status: 500 });
  }
}
