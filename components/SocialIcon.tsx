interface SocialIconProps {
  platform: string;
  className?: string;
}

/**
 * Icon per `platform` (the API's own `icon` field is a generic Heroicon name and
 * the doc says to ignore it in favor of per-network icons). Unknown platforms —
 * the backend can add new ones without a frontend release — fall back to a link
 * icon. Pure markup, so it works in both server and client components.
 */
export function SocialIcon({ platform, className = "h-5 w-5" }: SocialIconProps) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (platform) {
    case "instagram":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
        </svg>
      );
    case "telegram":
      return (
        <svg {...common}>
          <path d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...common}>
          <path d="M3 21l1.65-4.9A8.5 8.5 0 1 1 8 19.4L3 21Z" />
          <path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-.8.8c-.9-.4-1.9-1.4-2.3-2.3l.8-.8-1-2L9 8.5Z" />
        </svg>
      );
    case "twitter":
      return (
        <svg {...common}>
          <path d="M4 4l16 16M20 4 4 20" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M7.5 10.5V17M7.5 7.5v.01M11.5 17v-6.5M11.5 13.2c0-1.7 1-2.7 2.5-2.7s2.5 1 2.5 2.9V17" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common}>
          <rect x="2.5" y="6" width="19" height="12" rx="3.5" />
          <path d="M10.5 9.5v5l4.5-2.5-4.5-2.5Z" fill="currentColor" />
        </svg>
      );
    case "aparat":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M10.2 8.8v6.4l5-3.2-5-3.2Z" fill="currentColor" />
        </svg>
      );
    case "phone":
    case "landline":
      return (
        <svg {...common}>
          <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
        </svg>
      );
    case "website":
      return (
        <svg {...common}>
          <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0c2.5-2.4 3.5-5.4 3.5-9S14.5 5.4 12 3m0 18c-2.5-2.4-3.5-5.4-3.5-9S9.5 5.4 12 3M3.6 9h16.8M3.6 15h16.8" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
        </svg>
      );
  }
}

/** Tile colors per platform for the contact dialog. */
export const SOCIAL_ACCENT: Record<string, string> = {
  instagram: "bg-pink-50 text-pink-600",
  telegram: "bg-sky-50 text-sky-600",
  whatsapp: "bg-green-50 text-green-600",
  twitter: "bg-stone-100 text-stone-800",
  linkedin: "bg-blue-50 text-blue-700",
  youtube: "bg-red-50 text-red-600",
  aparat: "bg-rose-50 text-rose-600",
  phone: "bg-orange/10 text-orange",
  landline: "bg-orange/10 text-orange",
  website: "bg-stone-100 text-stone-600",
};

export const DEFAULT_SOCIAL_ACCENT = "bg-stone-100 text-stone-600";
