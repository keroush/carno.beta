import { withAuthProxy } from "@/lib/apiProxy";
import { deleteDraftImage } from "@/lib/listingApi";

interface RouteParams {
  params: Promise<{ id: string; imageId: string }>;
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id, imageId } = await params;
  return withAuthProxy((token) => deleteDraftImage(token, id, imageId));
}
