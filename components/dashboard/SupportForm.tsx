"use client";

import { useState } from "react";

export function SupportForm() {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (message.trim().length === 0) return;

    setIsSubmitting(true);
    // No support-ticket endpoint documented yet — this simulates the round trip
    // locally so the flow can be wired to a real one later without UI changes.
    setTimeout(() => {
      setIsSubmitting(false);
      setSent(true);
      setMessage("");
    }, 500);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label htmlFor="support-message" className="block text-xs font-medium text-stone-500">
        پیام شما
      </label>
      <textarea
        id="support-message"
        value={message}
        onChange={(event) => {
          setMessage(event.target.value);
          setSent(false);
        }}
        rows={4}
        placeholder="مشکل یا سوال خود را بنویسید..."
        className="font-vazir w-full resize-none rounded-xl border border-stone-200 px-4 py-3 text-sm text-stone-700 outline-none transition-colors placeholder:text-stone-300 focus:border-orange/40"
      />
      {sent && (
        <div className="rounded-xl border border-orange/15 bg-warm-50/70 px-4 py-2.5 text-xs text-warm-600">
          پیام شما ارسال شد. تیم پشتیبانی به‌زودی با شما تماس می‌گیرد.
        </div>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-xl bg-orange px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "در حال ارسال..." : "ارسال پیام"}
      </button>
    </form>
  );
}
