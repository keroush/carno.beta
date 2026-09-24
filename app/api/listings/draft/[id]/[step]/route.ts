import { NextResponse } from "next/server";
import { withAuthProxy } from "@/lib/apiProxy";
import { getDraftOptions, putDraftStep } from "@/lib/listingApi";
import { isDraftOptionsStep, isSimplePutStep } from "@/lib/wizardSteps";

interface RouteParams {
  params: Promise<{ id: string; step: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { id, step } = await params;
  if (!isDraftOptionsStep(step)) {
    return NextResponse.json({ message: "این مرحله گزینه‌ی وابسته ندارد." }, { status: 404 });
  }
  return withAuthProxy((token) => getDraftOptions(token, id, step));
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { id, step } = await params;
  if (!isSimplePutStep(step)) {
    return NextResponse.json({ message: "مرحله‌ی نامعتبر است." }, { status: 404 });
  }
  const body = await request.json().catch(() => ({}));
  return withAuthProxy((token) => putDraftStep(token, id, step, body));
}
