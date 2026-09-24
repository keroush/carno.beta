import Link from "next/link";
import { formatRelativeTime } from "@/lib/persianNumber";
import type { SupportTicketSummary, TicketStatus } from "@/types/userPanel";

const STATUS_CLASS: Record<TicketStatus, string> = {
  open: "bg-sky/10 text-sky-600 border border-sky/15",
  answered: "bg-orange/10 text-orange border border-orange/15",
  closed: "bg-stone-100 text-stone-500 border border-stone-200",
};

export function TicketList({ tickets }: { tickets: SupportTicketSummary[] }) {
  if (tickets.length === 0) {
    return (
      <div className="shadow-card rounded-[20px] border border-dashed border-stone-200 bg-white/60 p-10 text-center text-sm text-stone-400">
        هنوز تیکتی ثبت نکرده‌اید.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tickets.map((ticket) => (
        <Link
          key={ticket.id}
          href={`/dashboard?tab=support&ticket=${ticket.id}`}
          className="shadow-card hover:shadow-card-hover flex items-center justify-between gap-3 rounded-[16px] border border-transparent bg-white p-4 transition-all duration-300 hover:border-orange/10"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-stone-800">{ticket.subject}</p>
            <p className="mt-1 text-[11px] text-stone-400">آخرین بروزرسانی: {formatRelativeTime(ticket.last_message_at)}</p>
          </div>
          <span className={`flex-shrink-0 rounded-full px-3 py-1 text-[11px] font-bold ${STATUS_CLASS[ticket.status]}`}>
            {ticket.status_label}
          </span>
        </Link>
      ))}
    </div>
  );
}
