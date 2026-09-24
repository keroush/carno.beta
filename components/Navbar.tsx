"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/lib/store";

const navLinks = [
  { href: "../listings", label: "همه خودروها" },
  { href: "#brands", label: "برندها" },
  { href: "../about", label: "درباره کارنو" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const isLoggedIn = useSessionStore((state) => state.isLoggedIn);
  const displayName = useSessionStore((state) => state.displayName);
  const clearSession = useSessionStore((state) => state.clearSession);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 60);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function handleLogout() {
    clearSession();
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.refresh();
    }
  }

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-sky-50/60 shadow-[0_1px_20px_rgba(0,0,0,0.04)] backdrop-blur-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex h-[68px] items-center justify-between">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="shadow-glow flex h-10 w-10 items-center justify-center rounded-xl bg-orange transition-transform duration-300 group-hover:scale-105">
              <svg
                className="h-5 w-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold leading-tight tracking-tight text-stone-800">
                کارنو
              </span>
              <span className="-mt-0.5 text-[10px] font-medium leading-none text-stone-400">
                بازارگاه خودرو
              </span>
            </div>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-sm font-medium text-stone-500 transition-colors after:absolute after:-bottom-1 after:right-0 after:h-[2px] after:w-0 after:rounded-full after:bg-orange after:transition-all after:duration-300 hover:text-stone-800 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  href="/dashboard"
                  className="rounded-xl border border-black/5 px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:border-orange/30 hover:text-orange"
                >
                  {displayName}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl px-3 py-2 text-xs font-medium text-stone-400 transition-colors hover:text-orange"
                >
                  خروج
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden rounded-xl border border-stone-200/80 px-4 py-2 text-sm font-medium text-stone-600 transition-all duration-300 hover:bg-orange/6 hover:text-orange sm:block"
              >
                ورود
              </Link>
            )}
            <Link
              href="/dashboard/listing"
              className="rounded-xl bg-orange px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,159,67,0.28),0_2px_8px_rgba(0,0,0,0.08)] active:translate-y-0 active:scale-[0.98]"
            >
              ثبت آگهی رایگان
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
