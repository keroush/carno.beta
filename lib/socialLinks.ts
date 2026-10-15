import type { SocialLink } from "@/types/socialLinks";

const SAFE_PROTOCOLS = new Set(["https:", "http:", "tel:"]);

/**
 * The API passes `other`-platform values through unchanged (see the social
 * links doc), so `url` is admin-entered text that could in principle be
 * `javascript:…`. Only ever render links whose protocol is on this allowlist.
 */
export function isSafeLinkUrl(url: string): boolean {
  try {
    return SAFE_PROTOCOLS.has(new URL(url).protocol);
  } catch {
    return false;
  }
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/**
 * GET /api/social-links is documented as a bare array (no `data` wrapper), but
 * this project has been bitten by wrapper mismatches before — so accept either,
 * drop malformed entries, and drop anything with an unsafe/unusable url rather
 * than throwing.
 */
export function normalizeSocialLinks(raw: unknown): SocialLink[] {
  const list = Array.isArray(raw)
    ? raw
    : raw && typeof raw === "object" && Array.isArray((raw as { data?: unknown }).data)
      ? (raw as { data: unknown[] }).data
      : [];

  const links: SocialLink[] = [];
  list.forEach((item, index) => {
    if (!item || typeof item !== "object") return;
    const entry = item as Record<string, unknown>;
    const url = asString(entry.url).trim();
    if (!url || !isSafeLinkUrl(url)) return;

    const label = asString(entry.label).trim();
    links.push({
      id: typeof entry.id === "number" ? entry.id : -(index + 1),
      platform: asString(entry.platform) || "other",
      platform_label: asString(entry.platform_label),
      icon: asString(entry.icon),
      label: label.length > 0 ? label : null,
      value: asString(entry.value),
      url,
    });
  });
  return links;
}

/** What to show when the social-links endpoint is down or empty: the site-wide phone from the listing response. */
export function fallbackPhoneLink(contact: { phone: string; tel_link: string }): SocialLink {
  return {
    id: -1000,
    platform: "phone",
    platform_label: "تماس تلفنی",
    icon: "",
    label: null,
    value: contact.phone,
    url: contact.tel_link,
  };
}

export function isTelLink(link: SocialLink): boolean {
  return link.url.startsWith("tel:");
}

/** Admin's custom title wins; otherwise the Persian platform label. */
export function linkTitle(link: SocialLink): string {
  return link.label?.trim() || link.platform_label || link.value;
}
