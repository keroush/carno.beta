"use client";

import { useState } from "react";
import { ContactLinksModal } from "@/components/listing-detail/ContactLinksModal";
import type { SocialLink } from "@/types/socialLinks";

export function ContactSellerButton({ links }: { links: SocialLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="block w-full rounded-xl bg-orange px-5 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5"
      >
        تماس با فروشنده
      </button>
      <ContactLinksModal open={open} onClose={() => setOpen(false)} links={links} />
    </>
  );
}
