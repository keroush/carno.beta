import { getLatestListings } from "@/lib/api";
import ListingCarousel from "./ListingCarousel";

/**
 * Server Component: fetches on the server, streams in behind Suspense.
 * The interactive carousel + bookmark toggle state live in the client child.
 */
export default async function LatestAdvertisements() {
  const listings = await getLatestListings();

  if (listings.length === 0) {
    return (
      <p className="bento-card p-6 text-center text-sm text-ink-400">
        در حال حاضر آگهی جدیدی موجود نیست.
      </p>
    );
  }

  return <ListingCarousel listings={listings} />;
}
