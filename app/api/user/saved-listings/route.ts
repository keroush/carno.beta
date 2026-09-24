import { NextResponse } from "next/server";
import { withAuthProxy } from "@/lib/apiProxy";
import { getSavedListings, saveListing } from "@/lib/userPanelApi";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1") || 1;
  return withAuthProxy((token) => getSavedListings(token, page));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const listingId = Number(body.listing_id);

  if (!Number.isFinite(listingId)) {
    return NextResponse.json({ message: "شناسه آگهی نامعتبر است." }, { status: 422 });
  }

  return withAuthProxy((token) => saveListing(token, listingId));
}
