import Link from "next/link";

interface ShowAllCardProps {
  href: string;
  label?: string;
}

export function ShowAllCard({ href, label = "نمایش همه آگهی‌ها" }: ShowAllCardProps) {
  return (
    <Link
      href={href}
      className="group flex h-full min-h-[280px] flex-col items-center justify-center gap-3 rounded-[24px] border border-dashed border-orange/25 bg-orange/5 p-6 text-center transition-colors duration-300 hover:border-orange/40 hover:bg-orange/8"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-orange shadow-sm transition-transform duration-300 group-hover:-translate-x-1">
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
        </svg>
      </div>
      <span className="text-sm font-bold text-orange">{label}</span>
    </Link>
  );
}
