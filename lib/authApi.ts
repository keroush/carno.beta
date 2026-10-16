import "server-only";
import type { MeSuccess, OtpRequestSuccess, OtpVerifySuccess } from "@/types/auth";
import { ApiError, parseJsonResponse } from "@/lib/apiError";

const AUTH_API_BASE_URL = process.env.AUTH_API_BASE_URL ?? "https://auto-gallery.amlakemoon.com/api/auth";

// Kept as a named alias so existing call sites (`instanceof AuthApiError`) still work.
export { ApiError as AuthApiError };

async function callAuthApi<T>(path: string, init: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${AUTH_API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...init.headers,
      },
      cache: "no-store",
    });
  } catch {
    throw new ApiError(502, { message: "امکان ارتباط با سرور احراز هویت وجود ندارد." });
  }

  const payload = await parseJsonResponse(res);

  if (!res.ok) {
    throw new ApiError(res.status, payload);
  }

  return payload as T;
}

export function requestOtp(mobile: string): Promise<OtpRequestSuccess> {
  return callAuthApi<OtpRequestSuccess>("/otp/request", {
    method: "POST",
    body: JSON.stringify({ mobile }),
  });
}

/** Only needed for a number that has no account yet — the server ignores it for returning users. */
export interface NewUserName {
  firstName: string;
  lastName: string;
}

export function verifyOtp(mobile: string, code: string, name?: NewUserName): Promise<OtpVerifySuccess> {
  return callAuthApi<OtpVerifySuccess>("/otp/verify", {
    method: "POST",
    body: JSON.stringify({
      mobile,
      code,
      ...(name ? { first_name: name.firstName, last_name: name.lastName } : {}),
    }),
  });
}

export function getMe(token: string): Promise<MeSuccess> {
  return callAuthApi<MeSuccess>("/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function logout(token: string): Promise<void> {
  return callAuthApi<void>("/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}
