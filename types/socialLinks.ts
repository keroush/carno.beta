export type KnownSocialPlatform =
  | "instagram"
  | "telegram"
  | "whatsapp"
  | "phone"
  | "landline"
  | "website"
  | "twitter"
  | "linkedin"
  | "youtube"
  | "aparat"
  | "other";

/** GET /api/social-links item. `platform` is a plain string because the backend can add platforms without a frontend release. */
export interface SocialLink {
  id: number;
  platform: KnownSocialPlatform | (string & {});
  /** Ready-made Persian label, e.g. «اینستاگرام». */
  platform_label: string;
  /** Heroicon name suggested by the backend — ignored; icons are chosen from `platform`. */
  icon: string;
  /** Admin-entered title (e.g. «پشتیبانی»); null → fall back to platform_label. */
  label: string | null;
  /** Raw username / number / URL. Display only where useful; link with `url`. */
  value: string;
  /** Complete, ready-to-use href (https://…, tel:…). Always link with this, never build one from `value`. */
  url: string;
}
