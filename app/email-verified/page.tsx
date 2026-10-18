import Link from "next/link";
import { ArrowRight, CheckCircle2, MailWarning, XCircle } from "lucide-react";
import { getUserSession } from "@/lib/auth-actions/auth-helpers";
import AuthPageShell from "@/components/Auth/AuthPageShell";

type EmailVerifiedPageProps = {
  searchParams: Promise<{ error?: string | string[] }>;
};

export default async function EmailVerifiedPage({ searchParams }: EmailVerifiedPageProps) {
  const { error } = await searchParams;
  const session = await getUserSession();
  const hasError = Boolean(error);
  const isVerified = session?.user.emailVerified === true;

  const title = hasError ? "Verification failed" : isVerified ? "Email verified" : "Verification not confirmed";
  const description = hasError
    ? "This verification link may be invalid or expired. Request a new verification link and try again."
    : isVerified
      ? "Your account currently has a verified email address. You can continue to your dashboard."
      : "We couldn't confirm that your email is verified. Sign in to check your account, or request a new verification email.";

  const href = session?.user ? "/" : "/sign-in";
  const label = session?.user ? "Continue to RaceTracker" : "Go to sign in";

  return (
    <AuthPageShell
      icon={hasError ? XCircle : isVerified ? CheckCircle2 : MailWarning}
      tone={hasError ? "red" : isVerified ? "green" : "blue"}
      title={title}
      description={description}
    >
      <Link href={href} className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500">
        {label} <ArrowRight className="size-4" />
      </Link>
    </AuthPageShell>
  );
}