import { NextResponse } from "next/server";
import { withAuthProxy } from "@/lib/apiProxy";
import { uploadDraftImage } from "@/lib/listingApi";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request, { params }: RouteParams) {
  const { id } = await params;

  const incomingForm = await request.formData().catch(() => null);
  const file = incomingForm?.get("image");

  if (!(file instanceof File)) {
    return NextResponse.json({ errors: { image: ["فایل تصویر ارسال نشده است."] } }, { status: 422 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { errors: { image: ["فرمت تصویر مجاز نیست. فقط jpg، jpeg، png و webp پذیرفته می‌شود."] } },
      { status: 422 },
    );
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ errors: { image: ["حجم تصویر نباید بیشتر از ۱۰ مگابایت باشد."] } }, { status: 422 });
  }

  const forwardForm = new FormData();
  forwardForm.set("image", file, file.name);

  return withAuthProxy((token) => uploadDraftImage(token, id, forwardForm), 201);
}
