"use client";

import { Modal } from "@/components/Modal";
import { DEFAULT_SOCIAL_ACCENT, SOCIAL_ACCENT, SocialIcon } from "@/components/SocialIcon";
import { isTelLink, linkTitle } from "@/lib/socialLinks";
import { toPersianDigits } from "@/lib/persianNumber";
import type { SocialLink } from "@/types/socialLinks";

interface ContactLinksModalProps {
  open: boolean;
  onClose: () => void;
  links: SocialLink[];
}

export function ContactLinksModal({ open, onClose, links }: ContactLinksModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="تماس با کارنو">
      {links.length === 0 ? (
        <p className="py-6 text-center text-sm text-stone-400">در حال حاضر راه ارتباطی ثبت نشده است.</p>
      ) : (
        <ul className="space-y-2.5">
          {links.map((link) => {
            const isTel = isTelLink(link);
            const subtitle = isTel ? toPersianDigits(link.value) : link.label ? link.platform_label : null;
            return (
              <li key={`${link.id}-${link.url}`}>
                <a
                  href={link.url}
                  {...(isTel ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                  className="flex items-center gap-3 rounded-2xl border border-stone-100 p-3 transition-colors hover:border-orange/30 hover:bg-warm-50/50"
                >
                  <span
                    className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${
                      SOCIAL_ACCENT[link.platform] ?? DEFAULT_SOCIAL_ACCENT
                    }`}
                  >
                    <SocialIcon platform={link.platform} className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-stone-800">{linkTitle(link)}</span>
                    {subtitle && (
                      <span dir={isTel ? "ltr" : undefined} className="block truncate text-right text-xs text-stone-400">
                        {subtitle}
                      </span>
                    )}
                  </span>
                  <svg className="h-4 w-4 flex-shrink-0 text-stone-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m15 19-7-7 7-7" />
                  </svg>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </Modal>
  );
}
