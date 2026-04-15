"use client";

import { GetRaceDaysResponse, RaceDay } from "@/types";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import CreateRace from "./CreateRace";

const RaceDayList = () => {
  const [raceDayList, setRaceDayList] = useState<RaceDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchRaceDays = async () => {
      try {
        const res = await fetch("/api/race-days");
        const result: GetRaceDaysResponse = await res.json();

        if (result.success) {
          setRaceDayList(result.raceList ?? []);
        } else {
          setMessage(result.message ?? "Something went wrong.");
        }
      } catch (error) {
        console.error(error);
        setMessage("Failed to load race days.");
      } finally {
        setLoading(false);
      }
    };

    fetchRaceDays();
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen px-6 py-10 text-white">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight">Race Schedule</h1>
          <p className="mt-3 text-white/60">Loading race days...</p>
        </div>
      </section>
    );
  }

  if (message) {
    return (
      <section className="min-h-screen px-6 py-10 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 flex flex-row items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-white/40">
                Horse Racing Tracker
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight">Races</h1>
              <p className="mt-3 text-white/60">{message}</p>
            </div>

            <CreateRace />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 flex flex-row justify-between items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-white/40">
              Horse Racing Tracker
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">
              Races
            </h1>
            <p className="mt-3 text-white/60">
              Select a date to open that race page.
            </p>
          </div>
          <CreateRace />
        </div>

        {raceDayList.length === 0 ? (
          <div className="border-b border-white/10 pb-4 text-white/70">
            No race days found.
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {raceDayList.map((race) => (
              <Link
                key={race.id}
                href={`/race-sheet/${race.id}`}
                className="group flex items-center justify-between gap-6 p-5 transition hover:bg-white/[0.02]"
              >
                <div className="min-w-0">
                  <h2 className="text-2xl font-semibold tracking-tight text-white transition group-hover:text-white/90">
                    {race.date}
                  </h2>
                  <p className="mt-1 text-sm text-white/50">{race.track}</p>
                </div>

                <div className="shrink-0 text-white/30 transition-all duration-200 group-hover:translate-x-1 group-hover:text-white">
                  →
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RaceDayList;