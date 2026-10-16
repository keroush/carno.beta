import { ProfileNameForm } from "@/components/dashboard/ProfileNameForm";
import type { AuthUser } from "@/types/auth";

export function VerificationSection({ user }: { user: AuthUser }) {
  return <ProfileNameForm user={user} />;
}
