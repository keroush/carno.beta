import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "ورود — کارنو",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <Navbar />
      <Suspense
        fallback={
          <div className="shadow-bento mx-auto h-[420px] w-full max-w-md animate-pulse rounded-[28px] bg-white" />
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
