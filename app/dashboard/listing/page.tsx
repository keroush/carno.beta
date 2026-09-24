import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { ListingWizard } from "@/components/dashboard/listing-wizard/ListingWizard";
import { getMe } from "@/lib/authApi";
import { SESSION_COOKIE_NAME } from "@/lib/sessionCookie";

export const metadata: Metadata = {
  title: "ثبت آگهی جدید — کارنو",
};

export default async function NewListingPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    redirect("/login?next=/dashboard/listing");
  }

  await getMe(token).catch(() => {
    redirect("/login?next=/dashboard/listing");
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-20 pt-[110px] bg-white/10">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 lg:px-10">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-stone-800 sm:text-3xl">
              ثبت آگهی جدید
            </h1>
            <p className="mt-1 text-sm text-stone-400">
              در ۱۰ مرحله ساده، آگهی خودروی خود را ثبت کنید
            </p>
          </div>

          <ListingWizard />
        </div>
      </main>
    </>
  );
}
