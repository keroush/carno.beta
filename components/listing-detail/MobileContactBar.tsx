import { PhoneIcon } from "@/components/CardMetaIcons";

interface MobileContactBarProps {
  telLink: string;
}

export function MobileContactBar({ telLink }: MobileContactBarProps) {
  return (
    <a
      href={telLink}
      className="shadow-card flex items-center justify-between gap-4 rounded-[24px] border border-stone-100 bg-white p-4 transition-colors hover:border-orange/20 lg:hidden"
    >
      <div>
        <p className="text-sm font-bold text-stone-800">تماس با کارنو</p>
        <p className="text-xs text-stone-400">پشتیبانی ۲۴ ساعته</p>
      </div>
      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-orange text-white">
        <PhoneIcon />
      </div>
    </a>
  );
}
