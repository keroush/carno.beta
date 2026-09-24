import { getSavedListings } from "@/lib/userPanelApi";
import { SavedAdsList } from "@/components/dashboard/SavedAdsList";
import { Pagination } from "@/components/dashboard/Pagination";

interface SavedAdsSectionProps {
  token: string;
  page: number;
}

export async function SavedAdsSection({ token, page }: SavedAdsSectionProps) {
  const result = await getSavedListings(token, page);

  return (
    <div>
      <SavedAdsList entries={result.data} />
      <Pagination meta={result.meta} basePath="/dashboard?tab=saved" />
    </div>
  );
}
