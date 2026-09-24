import "server-only";
import { ApiError, parseJsonResponse } from "@/lib/apiError";
import type { ListingDetail } from "@/types/listingDetail";
import type {
  MyAdApiStatus,
  MyListingSummary,
  NationalCodeUser,
  Paginated,
  SavedListingEntry,
  SupportTicketDetail,
  SupportTicketSummary,
} from "@/types/userPanel";

const API_BASE_URL = process.env.API_BASE_URL ?? "https://auto-gallery.amlakemoon.com/api";

interface CallOptions extends Omit<RequestInit, "body"> {
  token: string;
  body?: BodyInit;
}

async function callApi<T>(path: string, { token, headers, ...rest }: CallOptions): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...headers,
      },
      cache: "no-store",
    });
  } catch {
    throw new ApiError(502, { message: "امکان ارتباط با سرور وجود ندارد." });
  }

  const payload = await parseJsonResponse(res);
  if (!res.ok) throw new ApiError(res.status, payload);
  return payload as T;
}

export function getMyListings(token: string, tab: MyAdApiStatus, page = 1): Promise<Paginated<MyListingSummary>> {
  return callApi(`/user/listings?tab=${tab}&page=${page}`, { method: "GET", token });
}

export function getMyListingDetail(token: string, id: string): Promise<{ listing: ListingDetail }> {
  return callApi(`/user/listings/${id}`, { method: "GET", token });
}

export function getSavedListings(token: string, page = 1): Promise<Paginated<SavedListingEntry>> {
  return callApi(`/user/saved-listings?page=${page}`, { method: "GET", token });
}

export function saveListing(token: string, listingId: number): Promise<{ message: string; saved_id: number }> {
  return callApi("/user/saved-listings", {
    method: "POST",
    token,
    body: JSON.stringify({ listing_id: listingId }),
  });
}

export function unsaveListing(token: string, listingId: number): Promise<{ message: string }> {
  return callApi(`/user/saved-listings/${listingId}`, { method: "DELETE", token });
}

export function setNationalCode(token: string, nationalCode: string): Promise<{ message: string; user: NationalCodeUser }> {
  return callApi("/user/profile/national-code", {
    method: "PUT",
    token,
    body: JSON.stringify({ national_code: nationalCode }),
  });
}

export function getSupportTickets(token: string, page = 1): Promise<Paginated<SupportTicketSummary>> {
  return callApi(`/support/tickets?page=${page}`, { method: "GET", token });
}

export function createSupportTicket(
  token: string,
  subject: string,
  message: string,
): Promise<{ message: string; ticket: SupportTicketDetail }> {
  return callApi("/support/tickets", {
    method: "POST",
    token,
    body: JSON.stringify({ subject, message }),
  });
}

export function getSupportTicketDetail(token: string, id: string): Promise<{ ticket: SupportTicketDetail }> {
  return callApi(`/support/tickets/${id}`, { method: "GET", token });
}

/**
 * The doc doesn't show a response sample for this one. Rather than guess its
 * shape and risk depending on something wrong, callers should treat this as
 * fire-and-forget and re-fetch the ticket detail afterward for the canonical
 * updated thread.
 */
export function replySupportTicket(token: string, id: string, message: string): Promise<unknown> {
  return callApi(`/support/tickets/${id}/reply`, {
    method: "POST",
    token,
    body: JSON.stringify({ message }),
  });
}
