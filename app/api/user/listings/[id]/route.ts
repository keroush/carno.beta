import { withAuthProxy } from "@/lib/apiProxy";
import { getMyListingDetail } from "@/lib/userPanelApi";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  return withAuthProxy((token) => getMyListingDetail(token, id));
}
