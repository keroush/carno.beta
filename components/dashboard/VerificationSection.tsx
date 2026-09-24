import { VerificationForm } from "@/components/dashboard/VerificationForm";
import type { AuthUser } from "@/types/auth";

export function VerificationSection({ user }: { user: AuthUser }) {
  return <VerificationForm user={user} />;
}
