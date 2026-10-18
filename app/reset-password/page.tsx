import Link from "next/link";
import { ArrowRight, KeyRound, Link2Off } from "lucide-react";
import AuthPageShell from "@/components/Auth/AuthPageShell";
import ResetPasswordForm from "@/components/Auth/ResetPasswordForm";

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string | string[];
    error?: string | string[];
  }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";
  const hasError = Boolean(params.error);

  if (hasError || !token) {
    return (
      <AuthPageShell
        icon={Link2Off}
        tone="red"
        title="Reset link unavailable"
        description="This password reset link is invalid, expired, or missing. Request a new link to try again."
      >
        <Link href="/forgot-password" className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500">
          Request a new link <ArrowRight className="size-4" />
        </Link>
      </AuthPageShell>
    );
  }

  return (
    <AuthPageShell
      icon={KeyRound}
      title="Reset your password"
      description="Choose a new password for your RaceTracker account."
    >
      <ResetPasswordForm token={token} />
    </AuthPageShell>
  );
}