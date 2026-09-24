import type {
  NationalCodeUser,
  Paginated,
  SavedListingEntry,
  SupportTicketDetail,
  SupportTicketSummary,
} from "@/types/userPanel";

export class UserPanelApiError extends Error {
  readonly status: number;
  readonly payload: unknown;

  constructor(status: number, payload: unknown) {
    super(
      typeof payload === "object" && payload && "message" in payload
        ? String((payload as { message: unknown }).message)
        : "User panel API error",
    );
    this.status = status;
    this.payload = payload;
    this.name = "UserPanelApiError";
  }

  get fieldErrors(): Record<string, string[]> | undefined {
    if (typeof this.payload === "object" && this.payload && "errors" in this.payload) {
      return (this.payload as { errors?: Record<string, string[]> }).errors;
    }
    return undefined;
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { Accept: "application/json", "Content-Type": "application/json", ...init?.headers },
  });
  const text = await res.text();
  const data = text ? (JSON.parse(text) as unknown) : {};
  if (!res.ok) throw new UserPanelApiError(res.status, data);
  return data as T;
}

export const userPanelApi = {
  saveListing: (listingId: number) =>
    request<{ message: string; saved_id: number }>("/api/user/saved-listings", {
      method: "POST",
      body: JSON.stringify({ listing_id: listingId }),
    }),
  unsaveListing: (listingId: number) =>
    request<{ message: string }>(`/api/user/saved-listings/${listingId}`, { method: "DELETE" }),
  getSavedListings: (page = 1) => request<Paginated<SavedListingEntry>>(`/api/user/saved-listings?page=${page}`),

  setNationalCode: (nationalCode: string) =>
    request<{ message: string; user: NationalCodeUser }>("/api/user/profile/national-code", {
      method: "PUT",
      body: JSON.stringify({ national_code: nationalCode }),
    }),

  getSupportTickets: (page = 1) => request<Paginated<SupportTicketSummary>>(`/api/support/tickets?page=${page}`),
  createSupportTicket: (subject: string, message: string) =>
    request<{ message: string; ticket: SupportTicketDetail }>("/api/support/tickets", {
      method: "POST",
      body: JSON.stringify({ subject, message }),
    }),
  getSupportTicketDetail: (id: number) => request<{ ticket: SupportTicketDetail }>(`/api/support/tickets/${id}`),
  replySupportTicket: (id: number, message: string) =>
    request<unknown>(`/api/support/tickets/${id}/reply`, {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
};
