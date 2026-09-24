"use client";

import { useEffect } from "react";
import { Bell, Menu, Search, ShieldCheck, User } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-store";

const NAV_LINKS = [
  { label: "Browse", href: "/listings" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Price classes", href: "/#price-classes" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const { isAuthenticated, isChecking, userName, checkSession } = useAuthStore();

  useEffect(() => {
    void checkSession();
  }, [checkSession]);

  return (
    <div className="sticky top-0 z-30">
      <div className="hidden items-center justify-center gap-2 bg-[var(--color-sky-deep)] px-4 py-1.5 text-[11px] font-medium tracking-wide text-white/90 sm:flex">
        <ShieldCheck size={12} className="text-[var(--color-sky)]" />
        <span>Verified dealers only</span>
        <span className="text-white/30">•</span>
        <span>Fully insured leases</span>
        <span className="text-white/30">•</span>
        <span>Cancel anytime</span>
      </div>

      <header className="flex items-center justify-between gap-3 border-b border-[var(--color-border-soft)] bg-[var(--color-canvas)]/95 px-4 py-3 backdrop-blur-md lg:px-8">
        <div className="flex items-center gap-6">
          <button
            type="button"
            aria-label="Open menu"
            className="grid h-10 w-10 place-items-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-dim)] transition-colors hover:text-[var(--color-orange)] active:scale-95 lg:hidden"
          >
            <Menu size={18} />
          </button>

          <a href="/" className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--color-orange)] text-white shadow-[0_10px_24px_-10px_rgba(255,159,67,0.7)]">
              <ShieldCheck size={19} />
            </span>
            <span className="leading-tight">
              <span className="block font-[family-name:var(--font-display)] text-lg font-extrabold tracking-tight text-[var(--color-text)]">
                Carlino
              </span>
              <span className="hidden text-[11px] text-[var(--color-text-mute)] sm:block">
                Smart car leasing
              </span>
            </span>
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[var(--color-text-dim)] transition-colors hover:text-[var(--color-orange)]"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Search"
            className="hidden h-10 w-10 place-items-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-dim)] transition-colors hover:text-[var(--color-orange)] active:scale-95 sm:grid"
          >
            <Search size={17} />
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="grid h-10 w-10 place-items-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-dim)] transition-colors hover:text-[var(--color-orange)] active:scale-95"
          >
            <Bell size={18} />
          </button>

          {!isChecking && !isAuthenticated && (
            <a
              href="/get-started"
              className="hidden items-center rounded-2xl bg-[var(--color-text)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-orange)] lg:flex"
            >
              Log in / Sign up
            </a>
          )}

          <button
            type="button"
            aria-label={isAuthenticated ? "Account" : "Log in"}
            className="grid h-10 w-10 place-items-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-dim)] transition-colors hover:text-[var(--color-orange)] active:scale-95"
          >
            {isChecking ? (
              <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-text-mute)]" />
            ) : isAuthenticated ? (
              <span className="text-xs font-semibold text-[var(--color-sky-deep)]">
                {(userName ?? "M").charAt(0)}
              </span>
            ) : (
              <User size={18} />
            )}
          </button>
        </div>
      </header>
    </div>
  );
}
