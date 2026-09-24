import { withAuthProxy } from "@/lib/apiProxy";
import { submitDraft } from "@/lib/listingApi";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  return withAuthProxy((token) => submitDraft(token, id));
}
