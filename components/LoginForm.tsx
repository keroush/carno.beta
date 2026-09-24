"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSessionStore } from "@/lib/store";

type Step = "mobile" | "otp";

interface OtpRequestResponse {
  message: string;
  expires_in_seconds?: number;
  retry_after_seconds?: number;
  debug_code?: string;
  errors?: Record<string, string[]>;
}

interface OtpVerifyResponse {
  message: string;
  user?: {
    id: number;
    mobile: string;
    first_name: string | null;
    last_name: string | null;
  };
}

const MOBILE_PATTERN = /^09\d{9}$/;
const CODE_PATTERN = /^\d{5}$/;

function useCountdown(initialSeconds: number) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(
      () => setSecondsLeft((prev) => Math.max(0, prev - 1)),
      1000,
    );
    return () => clearInterval(timer);
  }, [secondsLeft > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  return [secondsLeft, setSecondsLeft] as const;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useSessionStore((state) => state.setSession);

  const [step, setStep] = useState<Step>("mobile");
  const [mobile, setMobile] = useState("");
  const [code, setCode] = useState("");
  const [debugCode, setDebugCode] = useState<string | null>(null);
  const [expiresIn, setExpiresIn] = useCountdown(0);
  const [resendCooldown, setResendCooldown] = useCountdown(0);
  const [mobileError, setMobileError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const codeInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (step === "otp") codeInputRef.current?.focus();
  }, [step]);

  async function submitMobile(mobileValue: string) {
    if (!MOBILE_PATTERN.test(mobileValue)) {
      setMobileError("شماره موبایل معتبر نیست. فرمت صحیح: 09xxxxxxxxx");
      return;
    }

    setMobileError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: mobileValue }),
      });
      const data = (await res.json()) as OtpRequestResponse;

      if (res.status === 429) {
        setResendCooldown(data.retry_after_seconds ?? 60);
        setMobileError(data.message);
        return;
      }
      if (res.status === 422) {
        setMobileError(data.errors?.mobile?.[0] ?? data.message);
        return;
      }
      if (!res.ok) {
        setMobileError(data.message ?? "خطای غیرمنتظره‌ای رخ داد.");
        return;
      }

      setDebugCode(data.debug_code ?? null);
      setExpiresIn(data.expires_in_seconds ?? 120);
      setResendCooldown(data.expires_in_seconds ?? 120);
      setCode("");
      setCodeError(null);
      setStep("otp");
    } catch {
      setMobileError(
        "امکان ارتباط با سرور وجود ندارد. اتصال اینترنت را بررسی کنید.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleMobileSubmit(event: React.FormEvent) {
    event.preventDefault();
    await submitMobile(mobile);
  }

  async function handleResend() {
    if (resendCooldown > 0) return;
    await submitMobile(mobile);
  }

  async function handleVerify(event: React.FormEvent) {
    event.preventDefault();

    if (!CODE_PATTERN.test(code)) {
      setCodeError("کد تایید باید دقیقاً ۵ رقم باشد.");
      return;
    }

    setCodeError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, code }),
      });
      const data = (await res.json()) as OtpVerifyResponse;

      if (!res.ok) {
        setCodeError(data.message ?? "کد تایید نامعتبر یا منقضی شده است.");
        return;
      }

      const user = data.user;
      const displayName = user
        ? [user.first_name, user.last_name].filter(Boolean).join(" ") ||
          user.mobile
        : mobile;

      setSession({ isLoggedIn: true, displayName });
      const rawNext = searchParams.get("next");
      const isSafeInternalPath =
        rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//");
      const destination = isSafeInternalPath ? rawNext : "/dashboard";
      router.push(destination);
      router.refresh();
    } catch {
      setCodeError(
        "امکان ارتباط با سرور وجود ندارد. اتصال اینترنت را بررسی کنید.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleChangeMobile() {
    setStep("mobile");
    setCode("");
    setCodeError(null);
    setDebugCode(null);
  }

  return (
    <div className="shadow-bento mx-auto w-full max-w-md rounded-[28px] border border-transparent bg-white p-8">
      <div className="mb-7 text-center">
        <div className="shadow-glow mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange">
          <svg
            className="h-6 w-6 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
            />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-stone-800">
          {step === "mobile" ? "ورود به کارنو" : "کد تایید را وارد کنید"}
        </h1>
        <p className="mt-1.5 text-xs text-stone-400">
          {step === "mobile"
            ? "شماره موبایل خود را وارد کنید تا کد تایید برایتان ارسال شود"
            : `کد ۵ رقمی ارسال شده به ${mobile}`}
        </p>
      </div>

      {step === "mobile" ? (
        <form onSubmit={handleMobileSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="mobile"
              className="mb-1.5 block text-xs font-medium text-stone-500"
            >
              شماره موبایل
            </label>
            <input
              id="mobile"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              dir="ltr"
              placeholder="09121234567"
              value={mobile}
              onChange={(event) => {
                setMobile(event.target.value.replace(/[^\d]/g, ""));
                setMobileError(null);
              }}
              className="font-vazir w-full rounded-xl border border-stone-200 px-4 py-3 text-center text-sm text-stone-700 outline-none transition-colors placeholder:text-stone-300 focus:border-orange/40"
            />
            {mobileError && (
              <p className="mt-1.5 text-xs text-red-500">{mobileError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-orange px-5 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "در حال ارسال..." : "ارسال کد تایید"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label
              htmlFor="otp"
              className="mb-1.5 block text-xs font-medium text-stone-500"
            >
              کد تایید
            </label>
            <input
              id="otp"
              ref={codeInputRef}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={5}
              dir="ltr"
              placeholder="۴۸۲۱۳"
              value={code}
              onChange={(event) => {
                setCode(event.target.value.replace(/[^\d]/g, "").slice(0, 5));
                setCodeError(null);
              }}
              className="w-full rounded-xl border border-stone-200 px-4 py-3 text-center text-lg tracking-[0.5em] text-stone-700 outline-none transition-colors placeholder:tracking-normal placeholder:text-stone-300 focus:border-orange/40"
            />
            {codeError && (
              <p className="mt-1.5 text-xs text-red-500">{codeError}</p>
            )}
            {expiresIn > 0 && !codeError && (
              <p className="mt-1.5 text-xs text-stone-300">
                این کد تا {Math.floor(expiresIn)} ثانیه دیگر معتبر است
              </p>
            )}
          </div>

          {debugCode && (
            <div className="rounded-xl border border-dashed border-orange/30 bg-warm-50/60 px-4 py-2.5 text-center text-xs text-warm-600">
              کد تست (فقط محیط توسعه):{" "}
              <span className="font-bold" dir="ltr">
                {debugCode}
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-orange px-5 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "در حال بررسی..." : "تایید و ورود"}
          </button>

          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleChangeMobile}
              className="font-medium text-stone-400 hover:text-stone-600 cursor-pointer"
            >
              تغییر شماره موبایل
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0 || isSubmitting}
              className="font-medium text-orange transition-opacity disabled:cursor-not-allowed disabled:text-stone-300 cursor-pointer"
            >
              {resendCooldown > 0
                ? `ارسال مجدد کد (${Math.floor(resendCooldown)})`
                : "ارسال مجدد کد"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
