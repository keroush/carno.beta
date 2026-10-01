import { NextResponse } from "next/server";
import { ApiError } from "@/lib/apiError";
import { getSearchListings } from "@/lib/searchApi";
import { getSessionToken } from "@/lib/requireSession";
import type { SearchListingsQuery, SearchUsageType, SortOptionValue } from "@/types/search";

function getIntArray(searchParams: URLSearchParams, key: string): number[] | undefined {
  const values = searchParams.getAll(`${key}[]`);
  if (values.length === 0) return undefined;
  const parsed = values.map(Number).filter((n) => Number.isFinite(n));
  return parsed.length > 0 ? parsed : undefined;
}

function getInt(searchParams: URLSearchParams, key: string): number | undefined {
  const value = searchParams.get(key);
  if (value === null) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query: SearchListingsQuery = {
    brands: getIntArray(searchParams, "brands"),
    models: getIntArray(searchParams, "models"),
    province_id: getInt(searchParams, "province_id"),
    city_id: getInt(searchParams, "city_id"),
    usage_type: searchParams.getAll("usage_type[]") as SearchUsageType[] | undefined,
    price_min: getInt(searchParams, "price_min"),
    price_max: getInt(searchParams, "price_max"),
    year_min: getInt(searchParams, "year_min"),
    year_max: getInt(searchParams, "year_max"),
    mileage_max: getInt(searchParams, "mileage_max"),
    colors: getIntArray(searchParams, "colors"),
    fuel_types: getIntArray(searchParams, "fuel_types"),
    body_types: getIntArray(searchParams, "body_types"),
    sort: (searchParams.get("sort") as SortOptionValue | null) ?? undefined,
    page: getInt(searchParams, "page"),
    per_page: getInt(searchParams, "per_page"),
  };

  if (query.usage_type?.length === 0) query.usage_type = undefined;

  // Optional — populates is_saved correctly for a logged-in caller, but this
  // endpoint works fine without it too (is_saved just comes back false).
  const token = await getSessionToken();

  try {
    const result = await getSearchListings(query, token ?? undefined);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(error.payload, { status: error.status });
    }
    return NextResponse.json({ message: "خطای غیرمنتظره رخ داد." }, { status: 500 });
  }
}
