import { withAuthProxy } from "@/lib/apiProxy";
import { unsaveListing } from "@/lib/userPanelApi";

interface RouteParams {
  params: Promise<{ listingId: string }>;
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { listingId } = await params;
  return withAuthProxy((token) => unsaveListing(token, Number(listingId)));
}
