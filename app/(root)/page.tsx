import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BarChart3, CalendarPlus } from "lucide-react";
import CreateRace from "@/components/CreateRace";
import { Button } from "@/components/ui/button";

const page = () => {
  return (
    <main className="min-h-screen w-full px-6 py-10 text-white md:px-10">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <div className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-2xl backdrop-blur-xl md:p-10">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>

              <h1 className="font-heading text-5xl font-bold tracking-tight text-white md:text-7xl">
                TMT&apos;S
                <span className="block text-white/70">RACETRACKER</span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-white/60 md:text-lg">
                Create race days, enter your picks, compare source selections,
                and track which sources are finding winners over time.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <CreateRace
                  trigger={
                    <Button type="button" className="h-12 cursor-pointer rounded-xl bg-white px-5 font-semibold text-black transition hover:bg-white/80">
                      <CalendarPlus className="h-5 w-5" />
                      Create a Race
                    </Button>
                  }
                />

                <Link
                  href="/metrics"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  <BarChart3 className="h-5 w-5" />
                  View Metrics
                </Link>
              </div>
            </div>

            <div className="relative flex justify-center">
              <div className="absolute inset-0 rounded-full bg-white/10 blur-3xl" />

              <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-black/30 p-6 shadow-2xl">
                <Image
                  src="/assets/Horse.png"
                  alt="RaceTracker horse"
                  width={500}
                  height={300}
                  priority
                  className="h-auto w-full object-contain opacity-95 drop-shadow-2xl rounded"
                />
              </div>
            </div>
          </div>
        </div>

        
      </section>
    </main>
  );
};

export default page;