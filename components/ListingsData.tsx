import { getLatestListings } from "@/data/listings";
import { ListingsCarousel } from "@/components/ListingsCarousel";

export async function ListingsData() {
  const listings = await getLatestListings(12);
  return <ListingsCarousel listings={listings} showAllHref="/listings" />;
}
