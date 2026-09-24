import { withAuthProxy } from "@/lib/apiProxy";
import { startDraft } from "@/lib/listingApi";

export async function POST() {
  return withAuthProxy((token) => startDraft(token));
}
