import { withAuthProxy } from "@/lib/apiProxy";
import { deleteDraft } from "@/lib/listingApi";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  return withAuthProxy((token) => deleteDraft(token, id));
}
