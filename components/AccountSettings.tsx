"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Check, KeyRound, Loader2, Mail, ShieldCheck, UserRound, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendUserVerificationEmail } from "@/lib/auth-actions/auth-actions";
import ChangeEmailDialog from "./ChangeEmailDialog";
import ChangePasswordDialog from "./ChangePasswordDialog";

interface AccountSettingsProps {
  user: {
    name: string;
    email: string;
    emailVerified: boolean;
  };
}

interface SettingsRowProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  children?: ReactNode;
}

const SettingsRow = ({ icon: Icon, title, description, action, children }: SettingsRowProps) => (
  <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
    <div className="flex min-w-0 items-start gap-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
        <Icon className="size-5 text-white/80" />
      </div>

      <div className="min-w-0">
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-white/60">{description}</p>
        {children}
      </div>
    </div>

    {action && <div className="shrink-0 sm:ml-4">{action}</div>}
  </div>
);

const AccountSettings = ({ user }: AccountSettingsProps) => {
  const [isSending, setIsSending] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [notice, setNotice] = useState<{ message: string; isError: boolean } | null>(null);

  const handleVerifyEmail = async () => {
    if (isSending || verificationSent) return;

    setIsSending(true);
    setNotice(null);

    try {
      const result = await sendUserVerificationEmail();

      if (!result.success) {
        setNotice({ message: result.message, isError: true });
        return;
      }

      setVerificationSent(true);
      setNotice({ message: result.message, isError: false });
    } catch {
      setNotice({ message: "Unable to send verification email. Please try again.", isError: true });
    } finally {
      setIsSending(false);
    }
  };

  const showSuccess = (message: string) => setNotice({ message, isError: false });

  return (
    <main className="w-full px-4 py-8 text-white sm:px-6 sm:py-10">
      <div className="mx-auto max-w-4xl space-y-8">

        <div>
          <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white">
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>

          <h1 className="text-3xl font-bold text-white md:text-4xl">Account Settings</h1>
          <p className="mt-2 text-sm text-white/60">Manage your account information and security settings.</p>
        </div>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Account Information</h2>
            <p className="mt-1 text-sm text-white/60">Your personal account details.</p>
          </div>

          <div className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg backdrop-blur-sm">
            <SettingsRow
              icon={UserRound}
              title="Name"
              description={user.name}
            />

            <SettingsRow
              icon={Mail}
              title="Email Address"
              description={user.email}
              action={
                <span className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium ${
                  user.emailVerified
                    ? "border-green-400/20 bg-green-400/10 text-green-400"
                    : "border-yellow-400/20 bg-yellow-400/10 text-yellow-400"
                }`}>
                  {user.emailVerified ? <Check className="size-3.5" /> : <Mail className="size-3.5" />}
                  {user.emailVerified ? "Verified" : "Unverified"}
                </span>
              }
            />
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Security</h2>
            <p className="mt-1 text-sm text-white/60">Manage your email verification and password.</p>
          </div>

          {notice && (
            <p role={notice.isError ? "alert" : "status"} className={`text-sm ${notice.isError ? "text-red-400" : "text-green-400"}`}>
              {notice.message}
            </p>
          )}

          <div className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg backdrop-blur-sm">

            <SettingsRow
              icon={ShieldCheck}
              title="Email Verification"
              description={user.emailVerified ? "Your email address is verified." : "Verify your email address to help secure your account."}
              action={
                user.emailVerified ? (
                  <span className="inline-flex items-center gap-2 text-sm text-green-400">
                    <Check className="size-4" />
                    Verified
                  </span>
                ) : (
                  <Button
                    type="button"
                    onClick={handleVerifyEmail}
                    disabled={isSending || verificationSent}
                    className="cursor-pointer bg-white font-medium text-black hover:bg-white/90 disabled:cursor-not-allowed"
                  >
                    {isSending ? (
                      <><Loader2 className="mr-2 size-4 animate-spin" />Sending...</>
                    ) : verificationSent ? "Email Sent" : "Verify Email"}
                  </Button>
                )
              }
            />

            <SettingsRow
              icon={Mail}
              title="Change Email"
              description="Change the email address associated with your account."
              action={
                <ChangeEmailDialog
                  currentEmail={user.email}
                  disabled={!user.emailVerified}
                  onSuccess={showSuccess}
                />
              }
            >
              {!user.emailVerified && (
                <p className="mt-2 text-xs text-yellow-400">Verify your current email before changing it.</p>
              )}
            </SettingsRow>

            <SettingsRow
              icon={KeyRound}
              title="Change Password"
              description="Update your password to keep your account secure."
              action={<ChangePasswordDialog onSuccess={showSuccess} />}
            />

          </div>
        </section>

      </div>
    </main>
  );
};

export default AccountSettings;