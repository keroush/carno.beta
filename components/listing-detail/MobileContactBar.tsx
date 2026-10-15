"use client";

import { useState } from "react";
import { PhoneIcon } from "@/components/CardMetaIcons";
import { ContactLinksModal } from "@/components/listing-detail/ContactLinksModal";
import type { SocialLink } from "@/types/socialLinks";

export function MobileContactBar({ links }: { links: SocialLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="shadow-card flex w-full items-center justify-between gap-4 rounded-[24px] border border-stone-100 bg-white p-4 text-right transition-colors hover:border-orange/20 lg:hidden"
      >
        <div>
          <p className="text-sm font-bold text-stone-800">تماس با کارنو</p>
          <p className="text-xs text-stone-400">پشتیبانی ۲۴ ساعته</p>
        </div>
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-orange text-white">
          <PhoneIcon />
        </div>
      </button>
      <ContactLinksModal open={open} onClose={() => setOpen(false)} links={links} />
    </>
  );
}
