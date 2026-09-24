export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface Paginated<T> {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

/** The three tabs the "my ads" UI shows — matches the `tab` query param exactly. */
export type MyAdApiStatus = "active" | "incomplete" | "inactive";

export interface MyListingSummary {
  id: number;
  slug: string;
  title: string;
  year: number;
  price: number;
  status: string;
  status_label: string;
  current_step: number;
  city: string;
  cover_image: string;
  views_count: number;
  expires_at: string | null;
  created_at: string;
}

export interface SavedListingRef {
  id: number;
  title: string;
  year: number;
  price: number;
  city: string;
  cover_image: string;
  status: string;
}

export interface SavedListingEntry {
  saved_id: number;
  saved_at: string;
  note: string | null;
  listing: SavedListingRef;
}

export interface NationalCodeUser {
  id: number;
  mobile: string;
  national_code: string;
  first_name: string | null;
  last_name: string | null;
  city: { id: number; name: string } | null;
  is_verified: boolean;
}

export type TicketStatus = "open" | "answered" | "closed";

export interface SupportTicketSummary {
  id: number;
  subject: string;
  status: TicketStatus;
  status_label: string;
  created_at: string;
  last_message_at: string;
}

export interface SupportTicketMessage {
  id: number;
  sender_type: "user" | "admin";
  message: string;
  created_at: string;
}

export interface SupportTicketDetail {
  id: number;
  subject: string;
  status: TicketStatus;
  status_label: string;
  created_at: string;
  messages: SupportTicketMessage[];
}
