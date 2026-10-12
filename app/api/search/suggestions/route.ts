import { NextResponse } from "next/server";
import { ApiError } from "@/lib/apiError";
import { getSearchSuggestions } from "@/lib/searchApi";

const MIN_LENGTH = 2;
const MAX_LENGTH = 100;

// Public — no auth needed (suggestions are search *terms*, not listings, so
// there's no is_saved to populate either).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();

  if (q.length < MIN_LENGTH) {
    const message = "حداقل ۲ کاراکتر وارد کنید.";
    return NextResponse.json({ message, errors: { q: [message] } }, { status: 422 });
  }
  if (q.length > MAX_LENGTH) {
    const message = "حداکثر ۱۰۰ کاراکتر مجاز است.";
    return NextResponse.json({ message, errors: { q: [message] } }, { status: 422 });
  }

  try {
    const result = await getSearchSuggestions(q);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(error.payload, { status: error.status });
    }
    return NextResponse.json({ message: "خطای غیرمنتظره رخ داد." }, { status: 500 });
  }
}
