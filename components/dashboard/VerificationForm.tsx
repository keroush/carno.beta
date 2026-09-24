"use client";

import { useState } from "react";
import { userPanelApi, UserPanelApiError } from "@/lib/userPanelClient";
import type { AuthUser } from "@/types/auth";
import type { NationalCodeUser } from "@/types/userPanel";

interface VerificationFormProps {
  user: AuthUser;
}

export function VerificationForm({ user }: VerificationFormProps) {
  const [nationalCode, setNationalCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedUser, setConfirmedUser] = useState<NationalCodeUser | null>(null);

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!/^\d{10}$/.test(nationalCode)) {
      setError("کد ملی باید دقیقاً ۱۰ رقم باشد.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      const { user: updatedUser } = await userPanelApi.setNationalCode(nationalCode);
      setConfirmedUser(updatedUser);
    } catch (err) {
      if (err instanceof UserPanelApiError) {
        setError(err.fieldErrors?.national_code?.[0] ?? err.message);
      } else {
        setError("خطای غیرمنتظره‌ای رخ داد.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="shadow-card max-w-xl rounded-[20px] border border-transparent bg-white p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange/10">
          <svg className="h-5 w-5 text-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-stone-700">شماره موبایل تایید شده است</p>
          <p className="text-xs text-stone-400" dir="ltr">
            {user.mobile}
          </p>
        </div>
      </div>

      {fullName.length > 0 && (
        <p className="mb-5 text-xs text-stone-400">
          نام ثبت‌شده: <span className="font-semibold text-stone-600">{fullName}</span>
          {user.city && <> — {user.city.name}</>}
        </p>
      )}

      <div className="border-t border-stone-50 pt-5">
        <p className="mb-4 text-xs leading-relaxed text-stone-400">
          برای ثبت آگهی، تکمیل کد ملی الزامی است. نام، نام خانوادگی و شهر از طریق فرم دیگری تکمیل می‌شوند.
        </p>

        {confirmedUser ? (
          <div className="rounded-xl border border-orange/15 bg-warm-50/70 px-4 py-3 text-xs text-warm-600">
            <p className="mb-1 font-bold">کد ملی با موفقیت ثبت شد.</p>
            <p dir="ltr" className="font-mono">
              {confirmedUser.national_code}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label htmlFor="nationalCode" className="mb-1.5 block text-xs font-medium text-stone-500">
                کد ملی
              </label>
              <input
                id="nationalCode"
                dir="ltr"
                inputMode="numeric"
                value={nationalCode}
                onChange={(event) => {
                  setNationalCode(event.target.value.replace(/[^\d]/g, "").slice(0, 10));
                  setError(null);
                }}
                placeholder="0012345678"
                className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-center text-sm text-stone-700 outline-none transition-colors placeholder:text-stone-300 focus:border-orange/40"
              />
              {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-orange px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "در حال ثبت..." : "ثبت کد ملی"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
