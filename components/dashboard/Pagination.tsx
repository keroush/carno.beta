import Link from "next/link";
import { toPersianDigits } from "@/lib/persianNumber";

interface PaginationMeta {
  current_page: number;
  last_page: number;
}

interface PaginationProps {
  meta: PaginationMeta;
  /** Base path + existing query params, e.g. "/dashboard?tab=my-ads&status=active" */
  basePath: string;
}

export function Pagination({ meta, basePath }: PaginationProps) {
  if (meta.last_page <= 1) return null;

  const joiner = basePath.includes("?") ? "&" : "?";
  const hrefFor = (page: number) => `${basePath}${joiner}page=${page}`;

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <Link
        href={hrefFor(Math.max(1, meta.current_page - 1))}
        aria-disabled={meta.current_page <= 1}
        className={`flex h-9 w-9 items-center justify-center rounded-lg border text-stone-500 transition-colors ${
          meta.current_page <= 1
            ? "pointer-events-none border-stone-100 text-stone-300"
            : "border-stone-200 hover:border-orange/30 hover:text-orange"
        }`}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
        </svg>
      </Link>

      <span className="px-3 text-xs text-stone-400">
        صفحه {toPersianDigits(meta.current_page)} از {toPersianDigits(meta.last_page)}
      </span>

      <Link
        href={hrefFor(Math.min(meta.last_page, meta.current_page + 1))}
        aria-disabled={meta.current_page >= meta.last_page}
        className={`flex h-9 w-9 items-center justify-center rounded-lg border text-stone-500 transition-colors ${
          meta.current_page >= meta.last_page
            ? "pointer-events-none border-stone-100 text-stone-300"
            : "border-stone-200 hover:border-orange/30 hover:text-orange"
        }`}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m15 19-7-7 7-7" />
        </svg>
      </Link>
    </div>
  );
}
