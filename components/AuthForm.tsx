"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Eye, EyeOff, Loader2, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { Label } from "./ui/label";
import { signInUser } from "@/lib/auth-actions/auth-actions";
import Image from "next/image";
import Link from "next/link";

const AuthForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await signInUser({ email, password });

      if (!result.success) {
        setError(result.message);
        return;
      }

      router.replace("/");
      router.refresh();
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] text-white">
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex w-full items-center justify-center mb-4">
          <Image
            src="/assets/Horse.png"
            alt="RaceTracker horse"
            width={500}
            height={300}
            priority
            className=" object-contain drop-shadow-2xl"
          />
        </div>
      


        <div className="text-center w-full ">
          <h1 className="text-4xl font-bold tracking-tight">TMT&apos;S RACETRACKER</h1>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl shadow-black/30 sm:p-8">
        <div className="mb-7">
          <h2 className="text-2xl font-semibold tracking-tight text-center">Sign In</h2>
          <p className="mt-2 text-sm text-slate-400">Sign in to access your race tracking dashboard.</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-200">Email address</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-500" />
              <Input
                id="email"
                type="email"
                autoComplete="username"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="h-11 border-white/10 bg-slate-950/50 pl-10 text-white placeholder:text-slate-500 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-200">Password</Label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-500" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="h-11 border-white/10 bg-slate-950/50 pr-11 pl-10 text-white placeholder:text-slate-500 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-400 transition-colors hover:text-white"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
            >
              Forgot password?
            </Link>
          </div>

          {error && (
            <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm text-red-400">
              {error}
            </p>
          )}

          <Button type="submit" disabled={isLoading} className="h-11 w-full cursor-pointer bg-blue-600 font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed">
            {isLoading ? (
              <><Loader2 className="mr-2 size-4 animate-spin" />Signing in...</>
            ) : (
              <>Sign in <ArrowRight className="ml-2 size-4" /></>
            )}
          </Button>
        </form>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="size-4" />
        <span>Private access only</span>
      </div>
    </div>
  );
}

export default AuthForm;