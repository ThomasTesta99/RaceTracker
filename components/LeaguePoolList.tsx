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
      <section className="min-h-screen px-4 py-8 text-white sm:px-6 sm:py-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            League Pools
          </h1>
          <p className="mt-3 text-white/60">Loading league pools...</p>
        </div>
      </section>
    );
  }

  

  return (
    <section className="min-h-screen px-4 py-8 text-white sm:px-6 sm:py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-white/40">
              Baseball League Pool
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              League Pools
            </h1>

            <p className="mt-3 text-white/60">
              Select a date to open that league pool.
            </p>
          </div>

          <CreateLeaguePool />
        </div>

        {leaguePoolList.length === 0 ? (
          <div className="border-b border-white/10 pb-4 text-white/70">
            No league pools found.
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {leaguePoolList.map((pool) => (
              <Link
                key={pool.id}
                href={`/league-pool/${pool.id}`}
                className="group flex items-center justify-between gap-6 p-5 transition hover:bg-white/[0.02]"
              >
                <div className="min-w-0">
                  <h2 className="text-xl font-semibold tracking-tight text-white transition group-hover:text-white/90 sm:text-2xl">
                    {pool.date}
                  </h2>

                  <p className="mt-1 text-sm text-white/50">
                    Open league pool entries
                  </p>
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

export default LeaguePoolList;