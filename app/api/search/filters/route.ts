import { NextResponse } from "next/server";
import { ApiError } from "@/lib/apiError";
import { getSearchFilters } from "@/lib/searchApi";

// Public — no auth per the search API doc.
export async function GET() {
  try {
    const result = await getSearchFilters();
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(error.payload, { status: error.status });
    }
    return NextResponse.json({ message: "خطای غیرمنتظره رخ داد." }, { status: 500 });
  }
}
