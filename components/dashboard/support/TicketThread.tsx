"use client";

import { useState } from "react";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/persianNumber";
import { userPanelApi, UserPanelApiError } from "@/lib/userPanelClient";
import type { SupportTicketDetail, TicketStatus } from "@/types/userPanel";

const STATUS_CLASS: Record<TicketStatus, string> = {
  open: "bg-sky/10 text-sky-600 border border-sky/15",
  answered: "bg-orange/10 text-orange border border-orange/15",
  closed: "bg-stone-100 text-stone-500 border border-stone-200",
};

export function TicketThread({ ticket: initialTicket }: { ticket: SupportTicketDetail }) {
  const [ticket, setTicket] = useState(initialTicket);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refreshThread() {
    setIsRefreshing(true);
    try {
      const { ticket: refreshed } = await userPanelApi.getSupportTicketDetail(ticket.id);
      setTicket(refreshed);
    } catch {
      // Silent — this is just a manual "check for a reply" convenience.
    } finally {
      setIsRefreshing(false);
    }
  }

  async function handleReply(event: React.FormEvent) {
    event.preventDefault();
    if (message.trim().length === 0) return;

    setError(null);
    setIsSending(true);
    try {
      await userPanelApi.replySupportTicket(ticket.id, message.trim());
      const { ticket: refreshed } = await userPanelApi.getSupportTicketDetail(ticket.id);
      setTicket(refreshed);
      setMessage("");
    } catch (err) {
      if (err instanceof UserPanelApiError) {
        setError(err.status === 409 ? err.message || "این تیکت بسته شده و قابل پاسخ نیست." : err.message);
      } else {
        setError("ارسال پیام با خطا مواجه شد.");
      }
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="shadow-card mx-auto max-w-2xl rounded-[20px] border border-transparent bg-white p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <Link href="/dashboard?tab=support" className="text-xs font-medium text-stone-400 hover:text-stone-600">
          ← بازگشت به لیست تیکت‌ها
        </Link>
        <button
          type="button"
          onClick={refreshThread}
          disabled={isRefreshing}
          className="text-xs font-medium text-stone-400 transition-colors hover:text-orange disabled:opacity-50"
        >
          {isRefreshing ? "در حال بررسی..." : "بررسی پاسخ جدید"}
        </button>
      </div>

      <div className="mb-5 flex items-start justify-between gap-3 border-b border-stone-50 pb-4">
        <h2 className="text-base font-bold text-stone-800">{ticket.subject}</h2>
        <span className={`flex-shrink-0 rounded-full px-3 py-1 text-[11px] font-bold ${STATUS_CLASS[ticket.status]}`}>
          {ticket.status_label}
        </span>
      </div>

      <div className="mb-5 space-y-3">
        {ticket.messages.map((msg) => {
          const isUser = msg.sender_type === "user";
          return (
            <div key={msg.id} className={`flex ${isUser ? "justify-start" : "justify-end"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  isUser ? "bg-orange/10 text-stone-700" : "bg-stone-100 text-stone-700"
                }`}
              >
                <p>{msg.message}</p>
                <p className="mt-1 text-[10px] text-stone-400">
                  {isUser ? "شما" : "پشتیبانی"} — {formatRelativeTime(msg.created_at)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {ticket.status === "closed" ? (
        <div className="rounded-xl border border-stone-100 bg-stone-50 px-4 py-3 text-center text-xs text-stone-500">
          این تیکت بسته شده است.{" "}
          <Link href="/dashboard?tab=support&new=1" className="font-semibold text-orange hover:text-warm-500">
            برای ادامه، یک تیکت جدید باز کنید
          </Link>
        </div>
      ) : (
        <form onSubmit={handleReply} className="space-y-2.5">
          {error && <p className="text-xs text-red-500">{error}</p>}
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={3}
            placeholder="پاسخ خود را بنویسید..."
            className="font-vazir w-full resize-none rounded-xl border border-stone-200 px-4 py-3 text-sm text-stone-700 outline-none transition-colors placeholder:text-stone-300 focus:border-orange/40"
          />
          <button
            type="submit"
            disabled={isSending || message.trim().length === 0}
            className="rounded-xl bg-orange px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSending ? "در حال ارسال..." : "ارسال پاسخ"}
          </button>
        </form>
      )}
    </div>
  );
}
