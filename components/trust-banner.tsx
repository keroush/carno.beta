import { ShieldCheck } from "lucide-react";

export default function TrustBanner() {
  return (
    <section aria-label="Money-back guarantee" className="px-4 lg:px-8">
      <div className="flex flex-col items-center gap-4 rounded-[var(--radius-card)] bg-[var(--color-text)] p-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left lg:p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--color-orange)]/20 text-[var(--color-orange)]">
            <ShieldCheck size={20} />
          </span>
          <div>
            <p className="font-[family-name:var(--font-display)] text-sm font-bold text-white">
              Money-back guarantee
            </p>
            <p className="mt-0.5 text-[11px] text-white/60">
              If your car isn&apos;t delivered as promised, you get a full refund — no questions asked.
            </p>
          </div>
        </div>
        <a
          href="/get-started"
          className="shrink-0 rounded-2xl bg-[var(--color-orange)] px-5 py-2.5 text-xs font-bold text-white shadow-[0_10px_24px_-10px_rgba(255,159,67,0.7)] transition-transform hover:brightness-105 active:scale-95"
        >
          Start your request
        </a>
      </div>
    </section>
  );
}
