"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendResetPasswordEmail } from "@/lib/auth-actions/auth-actions";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await sendResetPasswordEmail({ email });
      if (!result.success) {
        setError(result.message);
        return;
      }
      setSent(true);
    } catch {
      setError("Unable to process your request right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="space-y-5 text-center">
        <CheckCircle2 className="mx-auto size-10 text-emerald-400" aria-hidden="true" />
        <p role="status" className="text-sm leading-relaxed text-slate-300">
          If an eligible account exists for <span className="font-medium text-white">{email.trim()}</span>, you&apos;ll receive a password reset link. Check your inbox and spam folder.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => { setSent(false); setError(""); }}
          className="h-11 w-full cursor-pointer border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
        >
          Try another email
        </Button>
        <Link href="/sign-in" className="flex items-center justify-center gap-2 text-sm text-slate-400 transition-colors hover:text-white">
          <ArrowLeft className="size-4" /> Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-200">Email address</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              required
              disabled={isLoading}
              className="h-11 border-white/10 bg-slate-950/50 pl-10 text-white placeholder:text-slate-500 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
            />
          </div>
        </div>

        {error && (
          <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm text-red-400">
            {error}
          </p>
        )}

        <Button type="submit" disabled={isLoading} className="h-11 w-full cursor-pointer bg-blue-600 font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed">
          {isLoading ? (
            <><Loader2 className="mr-2 size-4 animate-spin" />Sending link...</>
          ) : (
            <>Send reset link <ArrowRight className="ml-2 size-4" /></>
          )}
        </Button>
      </form>
      <Link href="/sign-in" className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-400 transition-colors hover:text-white">
        <ArrowLeft className="size-4" /> Back to sign in
      </Link>
    </div>
  );
}