import "server-only";
import { cache } from "react";
import { normalizeSocialLinks } from "@/lib/socialLinks";
import type { SocialLink } from "@/types/socialLinks";

const API_BASE_URL = process.env.API_BASE_URL ?? "https://auto-gallery.amlakemoon.com/api";

/**
 * GET /api/social-links — public, rarely changes (only when an admin edits it),
 * so it's cached for an hour per the API doc; revalidate on demand with
 * `revalidateTag("social-links")`.
 *
 * Never throws: contact info is supplementary UI (footer, contact dialog), so an
 * outage degrades to an empty list instead of failing the whole page. Wrapped in
 * React `cache` so the footer and a page asking in the same request share one call.
 */
export const getSocialLinks = cache(async (): Promise<SocialLink[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/social-links`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600, tags: ["social-links"] },
    });
    if (!res.ok) return [];
    return normalizeSocialLinks(await res.json());
  } catch {
    return [];
  }
});
