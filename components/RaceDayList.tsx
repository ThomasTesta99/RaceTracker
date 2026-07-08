"use client";

import { GetRaceDaysResponse, RaceDay } from "@/types";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import CreateRace from "./CreateRace";

const RACE_DAYS_PER_PAGE = 10;

const RaceDayList = () => {
  const [raceDayList, setRaceDayList] = useState<RaceDay[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<
    GetRaceDaysResponse["pagination"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

     useEffect(() => {
    const controller = new AbortController();

     const fetchRaceDays = async () => {
       try {
         setLoading(true);
         setMessage("");

         const res = await fetch(
          `/api/race-days?page=${page}&limit=${RACE_DAYS_PER_PAGE}`,
          { signal: controller.signal }
         );

         const result: GetRaceDaysResponse = await res.json();

         if (result.success) {
           setRaceDayList(result.raceList ?? []);
           setPagination(result.pagination);
         } else {
           setRaceDayList([]);
           setPagination(result.pagination);
           setMessage(result.message ?? "Something went wrong.");
         }
       } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
         console.error(error);
         setRaceDayList([]);
         setMessage("Failed to load race days.");
       } finally {
        if (!controller.signal.aborted) {
           setLoading(false);
        }
       }
     };

     fetchRaceDays();

    return () => controller.abort();
   }, [page]);

  return (
    <section className="min-h-screen px-4 py-8 text-white sm:px-6 sm:py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-white/40">
              Horse Racing Tracker
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Races
            </h1>

            <p className="mt-3 text-white/60">
              Select a date to open that race page.
            </p>
          </div>

          <CreateRace />
        </div>

        {loading ? (
          <p className="text-white/60">Loading race days...</p>
        ) : message ? (
          <div className="border-b border-white/10 pb-4 text-white/70">
            {message}
          </div>
        ) : raceDayList.length === 0 ? (
          <div className="border-b border-white/10 pb-4 text-white/70">
            No race days found.
          </div>
        ) : (
          <>
            <div className="divide-y divide-white/10">
              {raceDayList.map((race) => (
                <Link
                  key={race.id}
                  href={`/race-sheet/${race.id}`}
                  className="group flex items-center justify-between gap-6 p-5 transition hover:bg-white/[0.02]"
                >
                  <div className="min-w-0">
                    <h2 className="text-xl font-semibold tracking-tight text-white transition group-hover:text-white/90 sm:text-2xl">
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

            {pagination ? (
              <div className="mt-8 flex items-center justify-between gap-4">
                <button
                  type="button"
                  disabled={!pagination.hasPreviousPage || loading}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className="flex flex-row gap-2 cursor-pointer rounded-xl border border-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <div className="shrink-0 text-white/30 transition-all duration-200 group-hover:translate-x-1 group-hover:text-white">
                    ←
                  </div>
                  Previous
                </button>

                <p className="text-sm text-white/50">
                  Page {pagination.page} of {pagination.totalPages || 1}
                </p>

                <button
                  type="button"
                  disabled={!pagination.hasNextPage || loading}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="flex flex-row gap-2 cursor-pointer rounded-xl border border-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <div className="shrink-0 text-white/30 transition-all duration-200 group-hover:translate-x-1 group-hover:text-white">
                    →
                  </div>
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
};

export default RaceDayList;