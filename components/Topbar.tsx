"use client";

import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const MobileTopbar = () => {
  const [open, setOpen] = useState(false);
  const pathName = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur-xl md:hidden">
      <div className="flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="min-w-0 rounded-xl px-2 py-1 transition hover:bg-white/5"
        >
          <h1 className="font-heading truncate text-xl font-bold tracking-wide text-white">
            TMT&apos;s RaceTracker
          </h1>
        </Link>

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-xl text-white/70 transition hover:bg-white/5 hover:text-white"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-2 border-t border-white/10 px-4 py-4">
          {sidebarLinks.map((link) => {
            const isActive =
              pathName === link.route || pathName.startsWith(`${link.route}/`);
            const Icon = link.icon;

            return (
              <Link
                key={link.label}
                href={link.route}
                onClick={() => setOpen(false)}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "border border-white/10 bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                {Icon && (
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-colors duration-200",
                      isActive
                        ? "text-white"
                        : "text-white/60 group-hover:text-white"
                    )}
                  />
                )}

                <span className="tracking-wide">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
};

export default MobileTopbar;