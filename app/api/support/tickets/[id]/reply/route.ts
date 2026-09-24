import { NextResponse } from "next/server";
import { withAuthProxy } from "@/lib/apiProxy";
import { replySupportTicket } from "@/lib/userPanelApi";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (message.length === 0) {
    return NextResponse.json({ message: "متن پیام الزامی است." }, { status: 422 });
  }

  return withAuthProxy((token) => replySupportTicket(token, id, message));
}
