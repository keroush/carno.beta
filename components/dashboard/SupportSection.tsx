import Link from "next/link";
import { ApiError } from "@/lib/apiError";
import { getSupportTicketDetail, getSupportTickets } from "@/lib/userPanelApi";
import { TicketList } from "@/components/dashboard/support/TicketList";
import { NewTicketForm } from "@/components/dashboard/support/NewTicketForm";
import { TicketThread } from "@/components/dashboard/support/TicketThread";
import { Pagination } from "@/components/dashboard/Pagination";

const contactChannels = [
  { label: "تلفن پشتیبانی", value: "۰۲۱-۴۵۶۷۸۹۰۰", dir: "ltr" as const },
  { label: "ایمیل", value: "support@karno.ir", dir: "ltr" as const },
  { label: "ساعات پاسخگویی", value: "همه روزه، ۹ صبح تا ۹ شب" },
];

interface SupportSectionProps {
  token: string;
  ticketId?: number;
  isNewTicket: boolean;
  page: number;
}

export async function SupportSection({ token, ticketId, isNewTicket, page }: SupportSectionProps) {
  if (ticketId) {
    try {
      const { ticket } = await getSupportTicketDetail(token, String(ticketId));
      return <TicketThread ticket={ticket} />;
    } catch (error) {
      const notFound = error instanceof ApiError && (error.status === 404 || error.status === 403);
      return (
        <div className="shadow-card rounded-[20px] border border-transparent bg-white p-8 text-center">
          <p className="mb-4 text-sm text-stone-500">
            {notFound ? "این تیکت یافت نشد یا متعلق به شما نیست." : "بارگذاری تیکت با خطا مواجه شد."}
          </p>
          <Link href="/dashboard?tab=support" className="text-sm font-semibold text-orange hover:text-warm-500">
            بازگشت به لیست تیکت‌ها
          </Link>
        </div>
      );
    }
  }

  if (isNewTicket) {
    return <NewTicketForm />;
  }

  const result = await getSupportTickets(token, page);

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="order-2 lg:order-1">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-stone-800">تیکت‌های من</h2>
          <Link
            href="/dashboard?tab=support&new=1"
            className="rounded-lg bg-orange px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5"
          >
            + تیکت جدید
          </Link>
        </div>
        <TicketList tickets={result.data} />
        <Pagination meta={result.meta} basePath="/dashboard?tab=support" />
      </div>

      <div className="shadow-card order-1 h-fit rounded-[20px] border border-transparent bg-white p-6 lg:order-2">
        <h2 className="mb-4 text-sm font-bold text-stone-800">راه‌های ارتباطی</h2>
        <ul className="space-y-4">
          {contactChannels.map((channel) => (
            <li key={channel.label}>
              <p className="text-[11px] text-stone-400">{channel.label}</p>
              <p className="text-sm font-semibold text-stone-700" dir={channel.dir}>
                {channel.value}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
