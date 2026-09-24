import "server-only";

/**
 * Wraps a non-2xx response from an upstream Laravel API. `status` and
 * `payload` are relayed as-is by route handlers so the client sees the exact
 * shape (message / errors / retry_after_seconds / missing_fields) the API
 * docs specify.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly payload: unknown;

  constructor(status: number, payload: unknown) {
    super(
      typeof payload === "object" && payload && "message" in payload
        ? String((payload as { message: unknown }).message)
        : "API error",
    );
    this.status = status;
    this.payload = payload;
    this.name = "ApiError";
  }
}

export async function parseJsonResponse(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { message: text };
  }
}
