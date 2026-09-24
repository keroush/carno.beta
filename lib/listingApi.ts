import "server-only";
import { ApiError, parseJsonResponse } from "@/lib/apiError";
import type {
  ListingDraft,
  ListingImage,
  TrimOptionsResponse,
  YearOptionsResponse,
} from "@/types/listingDraft";

const API_BASE_URL = process.env.API_BASE_URL ?? "https://auto-gallery.amlakemoon.com/api";

interface CallOptions extends Omit<RequestInit, "body"> {
  token?: string;
  body?: BodyInit;
}

async function callApi<T>(path: string, { token, headers, ...rest }: CallOptions = {}): Promise<T> {
  const isFormData = typeof FormData !== "undefined" && rest.body instanceof FormData;

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: {
        Accept: "application/json",
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      cache: "no-store",
    });
  } catch {
    throw new ApiError(502, { message: "امکان ارتباط با سرور وجود ندارد." });
  }

  const payload = await parseJsonResponse(res);

  if (!res.ok) {
    throw new ApiError(res.status, payload);
  }

  return payload as T;
}

export function startDraft(token: string): Promise<{ listing: ListingDraft }> {
  return callApi("/listings/draft/start", { method: "POST", token });
}

export function getCurrentDraft(token: string): Promise<{ listing: ListingDraft | null }> {
  return callApi("/listings/draft/current", { method: "GET", token });
}

export function putDraftStep(token: string, id: string, step: string, body: unknown): Promise<{ listing: ListingDraft }> {
  return callApi(`/listings/draft/${id}/${step}`, {
    method: "PUT",
    token,
    body: JSON.stringify(body),
  });
}

export function getDraftOptions(
  token: string,
  id: string,
  step: "year-options" | "trim-options",
): Promise<YearOptionsResponse | TrimOptionsResponse> {
  return callApi(`/listings/draft/${id}/${step}`, { method: "GET", token });
}

export function uploadDraftImage(
  token: string,
  id: string,
  form: FormData,
): Promise<{ image: ListingImage; listing: ListingDraft }> {
  return callApi(`/listings/draft/${id}/images`, { method: "POST", token, body: form });
}

export function deleteDraftImage(token: string, id: string, imageId: string): Promise<{ listing: ListingDraft }> {
  return callApi(`/listings/draft/${id}/images/${imageId}`, { method: "DELETE", token });
}

export function submitDraft(token: string, id: string): Promise<{ message: string; listing: ListingDraft }> {
  return callApi(`/listings/draft/${id}/submit`, { method: "POST", token });
}

export function deleteDraft(token: string, id: string): Promise<{ message: string }> {
  return callApi(`/listings/draft/${id}`, { method: "DELETE", token });
}
