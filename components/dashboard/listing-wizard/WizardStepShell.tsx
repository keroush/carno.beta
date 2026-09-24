"use client";

import type { ReactNode } from "react";

interface WizardStepShellProps {
  title: string;
  subtitle?: string;
  error?: string | null;
  onBack?: () => void;
  children: ReactNode;
}

export function WizardStepShell({
  title,
  subtitle,
  error,
  onBack,
  children,
}: WizardStepShellProps) {
  return (
    <div className="shadow-bento mx-auto w-full max-w-2xl rounded-[28px] border border-transparent bg-white p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-stone-800 sm:text-xl">{title}</h2>
        {subtitle && <p className="mt-1 text-xs text-stone-400">{subtitle}</p>}
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-xs text-red-600">
          {error}
        </div>
      )}

      {children}

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mt-6 block text-xs font-medium text-stone-400 transition-colors hover:text-stone-600"
        >
          → بازگشت به مرحله قبل
        </button>
      )}
    </div>
  );
}
