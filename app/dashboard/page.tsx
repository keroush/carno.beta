import type { Metadata } from "next";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { MyAdsSection } from "@/components/dashboard/MyAdsSection";
import { MyAdsSkeleton } from "@/components/dashboard/MyAdsSkeleton";
import { SavedAdsSection } from "@/components/dashboard/SavedAdsSection";
import { SavedAdsSkeleton } from "@/components/dashboard/SavedAdsSkeleton";
import { VerificationSection } from "@/components/dashboard/VerificationSection";
import { SupportSection } from "@/components/dashboard/SupportSection";
import { getMe } from "@/lib/authApi";
import { SESSION_COOKIE_NAME } from "@/lib/sessionCookie";
import { isMyAdApiStatus } from "@/lib/myAdsTabs";
import { DASHBOARD_TABS, type DashboardTab } from "@/types/dashboard-tabs";

export const metadata: Metadata = {
  title: "حساب کاربری — کارنو",
};

interface DashboardPageProps {
  searchParams: Promise<{ tab?: string; status?: string; page?: string; ticket?: string; new?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    redirect("/login?next=/dashboard");
  }

  const { user } = await getMe(token).catch(() => {
    redirect("/login?next=/dashboard");
  });

  const { tab, status, page, ticket, new: isNewTicket } = await searchParams;
  const activeTab: DashboardTab = DASHBOARD_TABS.includes(tab as DashboardTab) ? (tab as DashboardTab) : "my-ads";
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");

  const myAdsStatus = status && isMyAdApiStatus(status) ? status : "active";
  const myAdsPage = Number(page) > 0 ? Number(page) : 1;
  const savedPage = Number(page) > 0 ? Number(page) : 1;
  const supportPage = Number(page) > 0 ? Number(page) : 1;
  const ticketId = ticket && /^\d+$/.test(ticket) ? Number(ticket) : undefined;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-20 pt-[110px]">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-stone-800 sm:text-3xl">حساب کاربری</h1>
            <p className="mt-1 text-sm text-stone-400">
              خوش آمدید، {fullName.length > 0 ? fullName : user.mobile}
            </p>
          </div>

          <DashboardTabs activeTab={activeTab} />

          <div className="mt-8">
            {activeTab === "my-ads" && (
              <Suspense key={`${myAdsStatus}-${myAdsPage}`} fallback={<MyAdsSkeleton />}>
                <MyAdsSection token={token} status={myAdsStatus} page={myAdsPage} />
              </Suspense>
            )}
            {activeTab === "saved" && (
              <Suspense key={savedPage} fallback={<SavedAdsSkeleton />}>
                <SavedAdsSection token={token} page={savedPage} />
              </Suspense>
            )}
            {activeTab === "verification" && <VerificationSection user={user} />}
            {activeTab === "support" && (
              <SupportSection token={token} ticketId={ticketId} isNewTicket={isNewTicket === "1"} page={supportPage} />
            )}
          </div>
        </div>
      </main>
    </>
  );
}
