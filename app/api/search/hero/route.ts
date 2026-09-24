import { NextResponse } from "next/server";
import { ApiError } from "@/lib/apiError";
import { getSearchHero } from "@/lib/searchApi";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const page = Number(searchParams.get("page") ?? "1") || 1;
  const perPage = Number(searchParams.get("per_page") ?? "20") || 20;

  if (q.trim().length < 2) {
    return NextResponse.json(
      { message: "حداقل ۲ کاراکتر وارد کنید.", errors: { q: ["حداقل ۲ کاراکتر وارد کنید."] } },
      { status: 422 },
    );
  }

  try {
    const result = await getSearchHero(q.trim(), page, perPage);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(error.payload, { status: error.status });
    }
    return NextResponse.json({ message: "خطای غیرمنتظره رخ داد." }, { status: 500 });
  }
}
