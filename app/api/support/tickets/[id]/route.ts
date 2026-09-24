import { withAuthProxy } from "@/lib/apiProxy";
import { getSupportTicketDetail } from "@/lib/userPanelApi";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  return withAuthProxy((token) => getSupportTicketDetail(token, id));
}
