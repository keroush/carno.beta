import { NextResponse } from "next/server";
import { withAuthProxy } from "@/lib/apiProxy";
import { getMyListings } from "@/lib/userPanelApi";
import { isMyAdApiStatus } from "@/lib/myAdsTabs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tab = searchParams.get("tab");
  const page = Number(searchParams.get("page") ?? "1") || 1;

  if (!tab || !isMyAdApiStatus(tab)) {
    return NextResponse.json(
      { message: "پارامتر tab الزامی و باید یکی از active/incomplete/inactive باشد." },
      { status: 422 },
    );
  }

  return withAuthProxy((token) => getMyListings(token, tab, page));
}
