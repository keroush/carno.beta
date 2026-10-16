"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NAME_MAX, validateNames } from "@/lib/nameValidation";
import { useSessionStore } from "@/lib/store";
import { userPanelApi, UserPanelApiError } from "@/lib/userPanelClient";
import type { AuthUser } from "@/types/auth";

export function ProfileNameForm({ user }: { user: AuthUser }) {
  const router = useRouter();
  const setSession = useSessionStore((state) => state.setSession);

  // What the server currently has — the form is "dirty" only when it differs from this.
  const [saved, setSaved] = useState({ first: user.first_name ?? "", last: user.last_name ?? "" });
  const [firstName, setFirstName] = useState(saved.first);
  const [lastName, setLastName] = useState(saved.last);
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trimmedFirst = firstName.trim();
  const trimmedLast = lastName.trim();
  const isDirty = trimmedFirst !== saved.first || trimmedLast !== saved.last;

  function clearFeedback() {
    setSuccess(null);
    setGeneralError(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    clearFeedback();

    const errors = validateNames(trimmedFirst, trimmedLast);
    setFirstNameError(errors?.first_name?.[0] ?? null);
    setLastNameError(errors?.last_name?.[0] ?? null);
    if (errors) return;

    setIsSubmitting(true);
    try {
      const { message, user: updated } = await userPanelApi.updateProfileName(trimmedFirst, trimmedLast);
      const first = updated.first_name ?? trimmedFirst;
      const last = updated.last_name ?? trimmedLast;
      setSaved({ first, last });
      setFirstName(first);
      setLastName(last);
      setSuccess(message || "نام و نام‌خانوادگی با موفقیت ثبت شد.");
      // Keep the navbar's name and the server-rendered greeting in step with the change.
      setSession({ isLoggedIn: true, displayName: [first, last].filter(Boolean).join(" ") || user.mobile });
      router.refresh();
    } catch (err) {
      if (err instanceof UserPanelApiError) {
        const fieldErrors = err.fieldErrors;
        setFirstNameError(fieldErrors?.first_name?.[0] ?? null);
        setLastNameError(fieldErrors?.last_name?.[0] ?? null);
        if (!fieldErrors) {
          setGeneralError(err.status === 401 ? "نشست شما منقضی شده است. دوباره وارد شوید." : err.message);
        }
      } else {
        setGeneralError("خطای غیرمنتظره‌ای رخ داد.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="shadow-card max-w-xl rounded-[20px] border border-transparent bg-white p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange/10">
          <svg className="h-5 w-5 text-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
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

      <form onSubmit={handleSubmit} className="space-y-4 border-t border-stone-50 pt-5">
        <p className="text-xs leading-relaxed text-stone-400">
          نام و نام خانوادگی شما در آگهی‌ها و حساب کاربری نمایش داده می‌شود و هر زمان قابل ویرایش است.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="profileFirstName" className="mb-1.5 block text-xs font-medium text-stone-500">
              نام
            </label>
            <input
              id="profileFirstName"
              type="text"
              autoComplete="given-name"
              maxLength={NAME_MAX}
              value={firstName}
              onChange={(event) => {
                setFirstName(event.target.value);
                setFirstNameError(null);
                clearFeedback();
              }}
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-700 outline-none transition-colors focus:border-orange/40"
            />
            {firstNameError && <p className="mt-1.5 text-xs text-red-500">{firstNameError}</p>}
          </div>
          <div>
            <label htmlFor="profileLastName" className="mb-1.5 block text-xs font-medium text-stone-500">
              نام خانوادگی
            </label>
            <input
              id="profileLastName"
              type="text"
              autoComplete="family-name"
              maxLength={NAME_MAX}
              value={lastName}
              onChange={(event) => {
                setLastName(event.target.value);
                setLastNameError(null);
                clearFeedback();
              }}
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-700 outline-none transition-colors focus:border-orange/40"
            />
            {lastNameError && <p className="mt-1.5 text-xs text-red-500">{lastNameError}</p>}
          </div>
        </div>

        {generalError && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-xs text-red-600">{generalError}</div>
        )}
        {success && (
          <div role="status" className="rounded-xl border border-orange/15 bg-warm-50/70 px-4 py-2.5 text-xs font-medium text-warm-600">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="rounded-xl bg-orange px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {isSubmitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </button>
      </form>
    </div>
  );
}
