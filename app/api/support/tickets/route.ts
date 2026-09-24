import { NextResponse } from "next/server";
import { withAuthProxy } from "@/lib/apiProxy";
import { createSupportTicket, getSupportTickets } from "@/lib/userPanelApi";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1") || 1;
  return withAuthProxy((token) => getSupportTickets(token, page));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  const errors: Record<string, string[]> = {};
  if (subject.length === 0) errors.subject = ["موضوع تیکت الزامی است."];
  if (message.length === 0) errors.message = ["متن پیام الزامی است."];

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  return withAuthProxy((token) => createSupportTicket(token, subject, message), 201);
}
