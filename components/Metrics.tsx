"use client";

import { getMetrics } from "@/lib/race-actions/metrics";
import { SourceStat, UserStat } from "@/types";
import React, { useEffect, useMemo, useState } from "react";

const Metrics = () => {
  const [stats, setStats] = useState<SourceStat[]>([]);
  const [userStats, setUserStats] = useState<UserStat | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setMessage("");

        const result = await getMetrics();

        if (result.success && result.data) {
          const normalizedSourceStats = result.data.sourceStats.map((stat) => ({
            ...stat,
            totalPicks: Number(stat.totalPicks),
            correctFirstPicks: Number(stat.correctFirstPicks),
            accuracyPercent: Number(stat.accuracyPercent),
          }));

          const normalizedUserStats: UserStat = {
            totalRaces: Number(result.data.userStats?.totalRaces ?? 0),
            wins: Number(result.data.userStats?.wins ?? 0),
            losses: Number(result.data.userStats?.losses ?? 0),
            scratches: Number(result.data.userStats?.scratches ?? 0),
            winPercent: Number(result.data.userStats?.winPercent ?? 0),
          };

          setStats(normalizedSourceStats);
          setUserStats(normalizedUserStats);
        } else {
          setMessage(result.message || "Failed to load metrics.");
        }
      } catch (error) {
        console.error(error);
        setMessage("Failed to load metrics.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const sortedStats = useMemo(() => {
    return [...stats].sort((a, b) => b.accuracyPercent - a.accuracyPercent);
  }, [stats]);

  const topSource = sortedStats[0];

  const averageAccuracy = useMemo(() => {
    if (sortedStats.length === 0) return 0;

    const total = sortedStats.reduce(
      (sum, stat) => sum + stat.accuracyPercent,
      0
    );

    return Number((total / sortedStats.length).toFixed(1));
  }, [sortedStats]);

  const totalTrackedPicks = useMemo(() => {
    return sortedStats.reduce((sum, stat) => sum + stat.totalPicks, 0);
  }, [sortedStats]);

  const winPercent = userStats?.winPercent ?? 0;
  const wins = userStats?.wins ?? 0;
  const losses = userStats?.losses ?? 0;
  const scratches = userStats?.scratches ?? 0;
  const decidedRaces = userStats?.totalRaces ?? 0;

  if (loading) {
    return (
      <section className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.25em] text-white/50">
            Metrics
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white">
            Race Performance
          </h1>

          <p className="mt-3 text-white/70">Loading metrics...</p>
        </div>
      </section>
    );
  }

  if (message) {
    return (
      <section className="space-y-6">
        <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-6 backdrop-blur-xl">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Metrics</h1>
          <p className="mt-2 text-sm text-red-200">{message}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Metrics
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-white/65 md:text-base">
              Track your race results while comparing each source by first-pick
              winner accuracy.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/70">
            {sortedStats.length} source{sortedStats.length === 1 ? "" : "s"}{" "}
            tracked
          </div>
        </div>
      </div>

      {/* User Performance */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-white">My Performance</h2>

          <p className="mt-1 text-sm text-white/50">
            Your win rate is based on races marked as Win or Loss. Scratches are
            tracked but ignored in the percentage.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          <div className="rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.2em] text-white/50">
              Win Rate
            </p>

            <h2 className="mt-3 text-xl sm:text-2xl font-bold text-white">
              {winPercent}%
            </h2>

            <p className="mt-2 text-sm text-white/65">
              Wins divided by wins and losses
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.2em] text-white/50">
              Wins
            </p>

            <h2 className="mt-3 text-xl sm:text-2xl font-bold text-white">{wins}</h2>

            <p className="mt-2 text-sm text-white/65">Marked as Win</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.2em] text-white/50">
              Losses
            </p>

            <h2 className="mt-3 text-xl sm:text-2xl font-bold text-white">{losses}</h2>

            <p className="mt-2 text-sm text-white/65">Marked as Loss</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.2em] text-white/50">
              Scratches
            </p>

            <h2 className="mt-3 text-xl sm:text-2xl font-bold text-white">{scratches}</h2>

            <p className="mt-2 text-sm text-white/65">
              Ignored in win rate
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.2em] text-white/50">
              Record
            </p>

            <h2 className="mt-3 text-xl sm:text-2xl font-bold text-white">
              {wins}-{losses}
            </h2>

            <p className="mt-2 text-sm text-white/65">
              {decidedRaces} decided race{decidedRaces === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-white/60">Win/Loss percentage</span>

            <span className="font-medium text-white">{winPercent}%</span>
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-white/80 transition-all"
              style={{
                width: `${Math.min(Math.max(winPercent, 0), 100)}%`,
              }}
            />
          </div>

          <p className="mt-3 text-xs text-white/45">
            Based on {wins} win{wins === 1 ? "" : "s"} and {losses} loss
            {losses === 1 ? "" : "es"}.
            {scratches > 0
              ? ` ${scratches} scratch${scratches === 1 ? "" : "es"} ignored.`
              : ""}
          </p>
        </div>
      </div>

      {/* Source Performance */}
      {sortedStats.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-black/30 p-8 text-white/70">
          No source metrics available.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-white">
              Source Performance
            </h2>

            <p className="text-sm text-white/50">Sorted by accuracy</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.2em] text-white/50">
                Top Source
              </p>

              <h2 className="mt-3 text-xl sm:text-2xl font-bold text-white">
                {topSource?.sourceName ?? "N/A"}
              </h2>

              <p className="mt-2 text-sm text-white/65">
                {topSource
                  ? `${topSource.accuracyPercent}% accuracy`
                  : "No data"}
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.2em] text-white/50">
                Average Source Accuracy
              </p>

              <h2 className="mt-3 text-xl sm:text-2xl font-bold text-white">
                {averageAccuracy}%
              </h2>

              <p className="mt-2 text-sm text-white/65">
                Across all tracked sources
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.2em] text-white/50">
                Total Source Picks
              </p>

              <h2 className="mt-3 text-xl sm:text-2xl font-bold text-white">
                {totalTrackedPicks}
              </h2>

              <p className="mt-2 text-sm text-white/65">
                First-pick predictions counted
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {sortedStats.map((stat, index) => (
              <div
                key={stat.sourceId}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/[0.08]"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/40 text-sm font-semibold text-white/80">
                      #{index + 1}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {stat.sourceName}
                      </h3>

                      <p className="mt-1 text-sm text-white/55">
                        {stat.correctFirstPicks} correct out of{" "}
                        {stat.totalPicks} picks
                      </p>
                    </div>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-xl sm:text-2xl font-bold text-white">
                      {stat.accuracyPercent}%
                    </p>

                    <p className="text-sm text-white/50">accuracy</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-white/80 transition-all"
                      style={{
                        width: `${Math.min(
                          Math.max(stat.accuracyPercent, 0),
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-4 grid gap-3 text-sm text-white/70 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2">
                    <span className="text-white/45">Total Picks</span>

                    <p className="mt-1 font-medium text-white">
                      {stat.totalPicks}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2">
                    <span className="text-white/45">Correct Picks</span>

                    <p className="mt-1 font-medium text-white">
                      {stat.correctFirstPicks}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2">
                    <span className="text-white/45">Missed Picks</span>

                    <p className="mt-1 font-medium text-white">
                      {stat.totalPicks - stat.correctFirstPicks}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Metrics;
