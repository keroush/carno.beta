"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { userPanelApi, UserPanelApiError } from "@/lib/userPanelClient";

export function NewTicketForm() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subjectError, setSubjectError] = useState<string | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubjectError(null);
    setMessageError(null);
    setGeneralError(null);

    if (subject.trim().length === 0) {
      setSubjectError("موضوع تیکت الزامی است.");
      return;
    }
    if (message.trim().length === 0) {
      setMessageError("متن پیام الزامی است.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { ticket } = await userPanelApi.createSupportTicket(subject.trim(), message.trim());
      router.push(`/dashboard?tab=support&ticket=${ticket.id}`);
      router.refresh();
    } catch (err) {
      if (err instanceof UserPanelApiError) {
        setSubjectError(err.fieldErrors?.subject?.[0] ?? null);
        setMessageError(err.fieldErrors?.message?.[0] ?? null);
        if (!err.fieldErrors) setGeneralError(err.message);
      } else {
        setGeneralError("خطای غیرمنتظره‌ای رخ داد.");
      }
      setIsSubmitting(false);
    }
  }

  return (
    <div className="shadow-card max-w-xl rounded-[20px] border border-transparent bg-white p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-sm font-bold text-stone-800">تیکت جدید</h2>
        <Link href="/dashboard?tab=support" className="text-xs font-medium text-stone-400 hover:text-stone-600">
          انصراف
        </Link>
      </div>

      {generalError && (
        <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-xs text-red-600">{generalError}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="subject" className="mb-1.5 block text-xs font-medium text-stone-500">
            موضوع
          </label>
          <input
            id="subject"
            value={subject}
            onChange={(event) => {
              setSubject(event.target.value);
              setSubjectError(null);
            }}
            placeholder="مثلاً: مشکل در تایید آگهی"
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-700 outline-none transition-colors placeholder:text-stone-300 focus:border-orange/40"
          />
          {subjectError && <p className="mt-1.5 text-xs text-red-500">{subjectError}</p>}
        </div>

        <div>
          <label htmlFor="message" className="mb-1.5 block text-xs font-medium text-stone-500">
            پیام
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              setMessageError(null);
            }}
            rows={5}
            placeholder="مشکل یا سوال خود را با جزئیات بنویسید..."
            className="font-vazir w-full resize-none rounded-xl border border-stone-200 px-4 py-3 text-sm text-stone-700 outline-none transition-colors placeholder:text-stone-300 focus:border-orange/40"
          />
          {messageError && <p className="mt-1.5 text-xs text-red-500">{messageError}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-orange px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "در حال ارسال..." : "ارسال تیکت"}
        </button>
      </form>
    </div>
  );
}
