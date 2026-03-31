"use client";

import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const pathName = usePathname();

  return (
    <section
      className={cn(
        "h-screen overflow-hidden border-r border-white/10 bg-black/40 backdrop-blur-xl transition-all duration-300",
        open ? "w-[280px]" : "w-[80px]"
      )}
    >
      <div className="flex h-full flex-col p-4">
        <div className="mb-6 flex items-center justify-between overflow-hidden">
          {open && (
            <Link
              href="/"
              className="min-w-0 rounded-xl px-2 py-1 transition hover:bg-white/5"
            >
              <h1 className="font-heading whitespace-nowrap text-2xl font-bold tracking-wide text-white">
                TMT&apos;s RaceTracker
              </h1>
            </Link>
          )}

          <button
            onClick={() => setOpen((prev) => !prev)}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white/70 transition hover:bg-white/5 hover:text-white",
              !open && "mx-auto"
            )}
          >
            {open ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <PanelLeftOpen className="h-5 w-5" />
            )}
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-2 overflow-hidden">
          {sidebarLinks.map((link) => {
            const isActive =
              pathName === link.route || pathName.startsWith(`${link.route}/`);
            const Icon = link.icon;

            return (
              <Link
                href={link.route}
                key={link.label}
                className={cn(
                  "group flex items-center rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 overflow-hidden",
                  open ? "justify-start gap-3" : "justify-center",
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

                {open && (
                  <span className="whitespace-nowrap tracking-wide">
                    {link.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </section>
  );
};

export default Sidebar;