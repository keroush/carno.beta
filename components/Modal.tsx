"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** Pinned below the scrolling body (e.g. a confirm button). */
  footer?: React.ReactNode;
}

/**
 * Centered dialog (bottom sheet on small screens). Closes on a press anywhere
 * outside the panel, on Escape, or via the × button. Rendered in a portal so it
 * isn't clipped by `overflow-hidden` / scroll containers of whatever opened it
 * (the filter sidebar, the mobile filter sheet).
 */
export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);
  // Callers often pass an inline arrow; keeping the latest in a ref means the
  // effect below depends only on `open`. Otherwise it would re-run on every
  // parent re-render (e.g. each checkbox toggle inside the modal) and re-steal focus.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCloseRef.current();
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/40" onMouseDown={() => onCloseRef.current()} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-t-[24px] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.18)] outline-none sm:rounded-[24px]"
      >
        <div className="flex items-center justify-between border-b border-stone-50 px-5 py-4">
          <h2 id={titleId} className="text-sm font-bold text-stone-800">
            {title}
          </h2>
          <button
            type="button"
            onClick={() => onCloseRef.current()}
            aria-label="بستن"
            className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-stone-50 hover:text-stone-600"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        {footer && <div className="border-t border-stone-50 p-4">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
