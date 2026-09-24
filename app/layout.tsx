import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { SessionSync } from "@/components/SessionSync";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "کارنو — بازارگاه خودروی ایران",
  description:
    "بزرگترین بازارگاه خودروی ایران با امکان اجاره بلندمدت، خرید و فروش آسان، و بررسی تخصصی خودروهای روز",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body
        className={`${vazirmatn.variable} ${vazirmatn.className} text-stone-800`}
      >
        <SessionSync />
        {children}
      </body>
    </html>
  );
}
