import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";

interface AuthPageShellProps {
  title: string;
  description: string;
  icon: LucideIcon;
  tone?: "blue" | "green" | "red";
  children: ReactNode;
}

const tones = {
  blue: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
  green: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
  red: "bg-red-500/10 text-red-400 ring-red-500/20",
};

export default function AuthPageShell({
  title, description, icon: Icon, tone = "blue", children
}: AuthPageShellProps) {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-12 text-white">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Image
            src="/assets/Horse.png"
            alt="RaceTracker horse"
            width={500}
            height={300}
            priority
            className="max-h-44 w-auto max-w-full object-contain drop-shadow-2xl"
          />
          <p className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            TMT&apos;S RACETRACKER
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl shadow-black/30 sm:p-8">
          <div className="mb-7 text-center">
            <div className={`mx-auto mb-5 flex size-14 items-center justify-center rounded-full ring-1 ${tones[tone]}`}>
              <Icon className="size-7" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{description}</p>
          </div>
          {children}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <span>Secure account access</span>
        </div>
      </div>
    </main>
  );
}