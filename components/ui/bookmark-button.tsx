"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";

interface BookmarkButtonProps {
  initialBookmarked: boolean;
  size?: number;
}

export default function BookmarkButton({ initialBookmarked, size = 16 }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);

  return (
    <button
      type="button"
      aria-pressed={bookmarked}
      aria-label={bookmarked ? "Remove bookmark" : "Save listing"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setBookmarked((v) => !v);
      }}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/85 backdrop-blur-sm transition-transform hover:bg-white active:scale-90"
    >
      <Bookmark
        size={size}
        className={`transition-all duration-200 ${
          bookmarked ? "scale-110 fill-[var(--color-orange)] text-[var(--color-orange)]" : "text-[var(--color-text)]"
        }`}
      />
    </button>
  );
}
