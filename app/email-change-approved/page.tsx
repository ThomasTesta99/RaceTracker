import Link from "next/link";
import { ArrowRight, MailCheck, XCircle } from "lucide-react";
import { getUserSession } from "@/lib/auth-actions/auth-helpers";
import AuthPageShell from "@/components/Auth/AuthPageShell";

type EmailChangeApprovedPageProps = {
  searchParams: Promise<{ error?: string | string[] }>;
};

export default async function EmailChangeApprovedPage({ searchParams }: EmailChangeApprovedPageProps) {
  const { error } = await searchParams;
  const session = await getUserSession();
  const hasError = Boolean(error);

  return (
    <AuthPageShell
      icon={hasError ? XCircle : MailCheck}
      tone={hasError ? "red" : "blue"}
      title={hasError ? "Email change failed" : "Check your new email"}
      description={hasError
        ? "The approval link may be invalid or expired. Sign in and request the email change again."
        : "If you approved the change from your current email address, check your new inbox for a verification link. Your email address won't update until the new address is verified."}
    >
      <Link href={session?.user ? "/" : "/sign-in"} className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500">
        {session?.user ? "Continue to RaceTracker" : "Go to sign in"} <ArrowRight className="size-4" />
      </Link>
    </AuthPageShell>
  );
}