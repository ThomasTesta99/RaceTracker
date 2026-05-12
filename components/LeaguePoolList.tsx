"use client";

import { GetLeaguePoolsResponse, LeaguePool } from "@/types";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import CreateLeaguePool from "./CreateLeaguePool";

const LeaguePoolList = () => {
  const [leaguePoolList, setLeaguePoolList] = useState<LeaguePool[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchLeaguePools = async () => {
      try {
        const res = await fetch("/api/league-pool");
        const result: GetLeaguePoolsResponse = await res.json();

        if (result.success) {
          setLeaguePoolList(result.leaguePools ?? []);
        } else {
          setMessage(result.message ?? "Something went wrong.");
        }
      } catch (error) {
        console.error(error);
        setMessage("Failed to load league pools.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaguePools();
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="bg-black/40 p-5 shadow-2xl backdrop-blur-xl sm:p-6 lg:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40 sm:text-sm sm:tracking-[0.25em]">
              Baseball League Pool
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              League Pools
            </h1>

            <p className="mt-3 text-sm text-white/60 sm:text-base">
              Loading league pools...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto w-full max-w-6xl space-y-6 sm:space-y-8">
        <div>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40 sm:text-sm sm:tracking-[0.25em]">
                Baseball League Pool
              </p>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                League Pools
              </h1>

              <p className="mt-3 max-w-2xl text-sm text-white/60 sm:text-base">
                Select a date to open that league pool.
              </p>
            </div>

            <div className="w-full lg:w-auto">
              <CreateLeaguePool />
            </div>
          </div>
        </div>

        {message && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200 sm:p-5 sm:text-base">
            {message}
          </div>
        )}

        {leaguePoolList.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-black/40 p-5 text-sm text-white/60 shadow-2xl backdrop-blur-xl sm:p-6 sm:text-base">
            No league pools found.
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
            {leaguePoolList.map((pool) => (
              <Link
                key={pool.id}
                href={`/league-pool/${pool.id}`}
                className="group rounded-3xl border border-white/10 bg-black/40 p-5 shadow-2xl backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.04] sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                      Pool Date
                    </p>

                    <h2 className="mt-2 truncate text-xl font-semibold tracking-tight text-white transition group-hover:text-white/90 sm:text-2xl">
                      {pool.date}
                    </h2>

                    <p className="mt-2 text-sm text-white/50">
                      Open league pool entries
                    </p>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg text-white/40 transition-all duration-200 group-hover:translate-x-1 group-hover:border-white/20 group-hover:text-white">
                    →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LeaguePoolList;