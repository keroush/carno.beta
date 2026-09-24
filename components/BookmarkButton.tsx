"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { userPanelApi, UserPanelApiError } from "@/lib/userPanelClient";

interface BookmarkButtonProps {
  label: string;
  variant?: "solid" | "glass";
  className?: string;
  /**
   * When provided, clicking calls the real save/unsave API for this listing
   * id. Omit this for cards backed by mock/demo data (no real listing behind
   * them to persist against) — the button then just toggles a local visual
   * state, as before.
   */
  listingId?: number;
  initialSaved?: boolean;
}

const baseClasses =
  "flex items-center justify-center rounded-xl border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.15] hover:-rotate-[8deg] active:scale-[0.92]";

const variantClasses: Record<NonNullable<BookmarkButtonProps["variant"]>, string> = {
  solid: "border-stone-200 bg-white text-stone-400 hover:border-orange/30 hover:text-orange",
  glass: "glass-badge border-white/50 text-stone-400",
};

export function BookmarkButton({ label, variant = "solid", className = "", listingId, initialSaved = false }: BookmarkButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [saved, setSaved] = useState(initialSaved);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (!listingId) {
      setSaved((prev) => !prev);
      return;
    }

    if (isSubmitting) return;
    const nextSaved = !saved;
    setSaved(nextSaved);
    setIsSubmitting(true);
    try {
      if (nextSaved) {
        await userPanelApi.saveListing(listingId);
      } else {
        await userPanelApi.unsaveListing(listingId);
      }
    } catch (err) {
      setSaved(!nextSaved);
      if (err instanceof UserPanelApiError && err.status === 401) {
        router.push(`/login?next=${encodeURIComponent(pathname)}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={label}
      onClick={handleClick}
      disabled={isSubmitting}
      className={`${baseClasses} ${variantClasses[variant]} ${
        saved ? "!border-orange !bg-orange !text-white" : ""
      } ${isSubmitting ? "opacity-70" : ""} ${className}`}
    >
      <svg
        className="h-[15px] w-[15px]"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        fill={saved ? "currentColor" : "none"}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 11.186 0Z"
        />
      </svg>
    </button>
  );
}
