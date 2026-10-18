"use client";

import { useLogout } from "@/app/hooks/useLogout";
import { UserProps } from "@/types";
import { cn } from "@/lib/utils";
import { Loader2, LogOut } from "lucide-react";
import Link from "next/link";
import UserAvatar from "./UserAvatar";

type FooterProps = UserProps & {
  open: boolean;
};

const Footer = ({ user, open }: FooterProps) => {
  const { signOut, isLoggingOut } = useLogout();

  return (
    <footer
      className={cn(
        "shrink-0 border-t border-white/10 pt-4",
        open ? "flex items-center gap-2" : "flex flex-col items-center gap-3"
      )}
    >
      <Link
        href="/settings"
        aria-label="View your settings"
        title="View your settings"
        className={cn(
          "flex min-w-0 items-center rounded-xl transition hover:bg-white/5",
          open ? "flex-1 gap-3 px-2 py-2" : "justify-center p-1"
        )}
      >
        <UserAvatar
          image={user?.image}
          name={user?.name}
          size={40}
          className="shrink-0 bg-gray-600"
          fallbackClassName="text-xl font-bold text-white"
        />

        {open && (
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-semibold text-white">
              {user?.name ?? ""}
            </h1>
            <p className="truncate text-sm font-normal text-gray-400">
              {user?.email ?? ""}
            </p>
          </div>
        )}
      </Link>

      <button
        type="button"
        onClick={signOut}
        disabled={isLoggingOut}
        aria-label={isLoggingOut ? "Signing out" : "Log out"}
        title={isLoggingOut ? "Signing out" : "Log out"}
        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoggingOut ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <LogOut className="h-5 w-5" />
        )}
      </button>
    </footer>
  );
};

export default Footer;
