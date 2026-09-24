import { withAuthProxy } from "@/lib/apiProxy";
import { getCurrentDraft } from "@/lib/listingApi";

export async function GET() {
  return withAuthProxy((token) => getCurrentDraft(token));
}
