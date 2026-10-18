"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MIN_PASSWORD_LENGTH } from "@/constants";
import { resetUserPassword } from "@/lib/auth-actions/auth-actions";
import { setPasswordSchema } from "@/lib/validations/password";

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;

    setError("");
    const parsed = setPasswordSchema.safeParse({ newPassword, confirmPassword });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter a valid password.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await resetUserPassword({
        token,
        newPassword: parsed.data.newPassword,
        confirmPassword: parsed.data.confirmPassword
      });

      if (!result.success) {
        setError(result.message);
        return;
      }

      setNewPassword("");
      setConfirmPassword("");
      setIsComplete(true);
    } catch {
      setError("Unable to reset your password right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isComplete) {
    return (
      <div className="space-y-5 text-center">
        <CheckCircle2 className="mx-auto size-10 text-emerald-400" aria-hidden="true" />
        <p role="status" className="text-sm leading-relaxed text-slate-300">
          Your password has been updated successfully. Sign in with your new password to continue.
        </p>
        <Link href="/sign-in" className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500">
          Go to sign in <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="new-password" className="text-slate-200">New password</Label>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
          <Input
            id="new-password"
            type={showNew ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={event => setNewPassword(event.target.value)}
            required
            disabled={isLoading}
            className="h-11 border-white/10 bg-slate-950/50 pl-10 pr-11 text-white placeholder:text-slate-500 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
          />
          <button type="button" aria-label={showNew ? "Hide new password" : "Show new password"} aria-pressed={showNew} onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-white">
            {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        <p className="text-xs text-slate-400">At least {MIN_PASSWORD_LENGTH} characters.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password" className="text-slate-200">Confirm new password</Label>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
          <Input
            id="confirm-password"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={event => setConfirmPassword(event.target.value)}
            required
            disabled={isLoading}
            className="h-11 border-white/10 bg-slate-950/50 pl-10 pr-11 text-white placeholder:text-slate-500 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
          />
          <button type="button" aria-label={showConfirm ? "Hide confirmation password" : "Show confirmation password"} aria-pressed={showConfirm} onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-white">
            {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm text-red-400">
          {error}
        </p>
      )}

      <Button type="submit" disabled={isLoading} className="h-11 w-full cursor-pointer bg-blue-600 font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed">
        {isLoading ? (
          <><Loader2 className="mr-2 size-4 animate-spin" />Updating password...</>
        ) : (
          <>Reset password <ArrowRight className="ml-2 size-4" /></>
        )}
      </Button>
    </form>
  );
}