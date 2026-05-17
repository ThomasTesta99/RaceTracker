"use client";

import { getMetrics } from "@/lib/race-actions/metrics";
import { SourceStat, UserStat } from "@/types";
import React, { useEffect, useMemo, useState } from "react";

const clampPercent = (value: number) => {
  return Math.min(Math.max(value, 0), 100);
};

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
          const normalizedSourceStats: SourceStat[] =
            result.data.sourceStats.map((stat) => ({
              ...stat,
              totalPicks: Number(stat.totalPicks ?? 0),
              correctFirstPicks: Number(stat.correctFirstPicks ?? 0),
              accuracyPercent: Number(stat.accuracyPercent ?? 0),

              itmHits: Number(stat.itmHits ?? 0),
              itmTotalNumbers: Number(stat.itmTotalNumbers ?? 0),
              itmPercent: Number(stat.itmPercent ?? 0),
            }));

          const normalizedUserStats: UserStat = {
            totalRaces: Number(result.data.userStats?.totalRaces ?? 0),
            wins: Number(result.data.userStats?.wins ?? 0),
            losses: Number(result.data.userStats?.losses ?? 0),
            scratches: Number(result.data.userStats?.scratches ?? 0),
            winPercent: Number(result.data.userStats?.winPercent ?? 0),

            userItmHits: Number(result.data.userStats?.userItmHits ?? 0),
            userItmTotalNumbers: Number(
              result.data.userStats?.userItmTotalNumbers ?? 0
            ),
            userItmPercent: Number(result.data.userStats?.userItmPercent ?? 0),
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
    return [...stats].sort((a, b) => {
      if (b.itmPercent !== a.itmPercent) {
        return b.itmPercent - a.itmPercent;
      }

      return b.accuracyPercent - a.accuracyPercent;
    });
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

  const averageItm = useMemo(() => {
    if (sortedStats.length === 0) return 0;

    const total = sortedStats.reduce((sum, stat) => sum + stat.itmPercent, 0);

    return Number((total / sortedStats.length).toFixed(1));
  }, [sortedStats]);

  const totalTrackedFirstPicks = useMemo(() => {
    return sortedStats.reduce((sum, stat) => sum + stat.totalPicks, 0);
  }, [sortedStats]);

  const totalItmHits = useMemo(() => {
    return sortedStats.reduce((sum, stat) => sum + stat.itmHits, 0);
  }, [sortedStats]);

  const totalItmNumbers = useMemo(() => {
    return sortedStats.reduce((sum, stat) => sum + stat.itmTotalNumbers, 0);
  }, [sortedStats]);

  const winPercent = userStats?.winPercent ?? 0;
  const wins = userStats?.wins ?? 0;
  const losses = userStats?.losses ?? 0;
  const scratches = userStats?.scratches ?? 0;
  const decidedRaces = userStats?.totalRaces ?? 0;

  const userItmHits = userStats?.userItmHits ?? 0;
  const userItmTotalNumbers = userStats?.userItmTotalNumbers ?? 0;
  const userItmMisses = userItmTotalNumbers - userItmHits;
  const userItmPercent = userStats?.userItmPercent ?? 0;

  

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
          <h1 className="text-xl font-bold text-white sm:text-2xl">
            Metrics
          </h1>

          <p className="mt-2 text-sm text-red-200">{message}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      {/* Page Header */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-white/45">
              RaceTracker
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Metrics
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/65 md:text-base">
              Track your personal win/loss record, compare source first-pick
              accuracy, and measure In The Money rate across all 1st, 2nd, and
              3rd pick numbers.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/70">
            {sortedStats.length} source{sortedStats.length === 1 ? "" : "s"}{" "}
            tracked
          </div>
        </div>
      </div>

      {/* My Performance */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-white">My Performance</h2>

          <p className="mt-1 text-sm text-white/50">
            Your win rate is based only on races marked as Win or Loss.
            Scratches are counted separately and ignored in the percentage.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <MetricCard
            label="Win Rate"
            value={`${winPercent}%`}
            description="Wins divided by wins and losses"
          />

          <MetricCard
            label="My ITM Rate"
            value={`${userItmPercent}%`}
            description={`${userItmHits} hits out of ${userItmTotalNumbers} numbers`}
          />

          <MetricCard label="Wins" value={wins} description="Marked as Win" />

          <MetricCard
            label="Losses"
            value={losses}
            description="Marked as Loss"
          />

          <MetricCard
            label="Scratches"
            value={scratches}
            description="Ignored in win rate"
          />

          <MetricCard
            label="Record"
            value={`${wins}-${losses}`}
            description={`${decidedRaces} decided race${
              decidedRaces === 1 ? "" : "s"
            }`}
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-white/60">Win/Loss percentage</span>
            <span className="font-medium text-white">{winPercent}%</span>
          </div>

          <ProgressBar value={winPercent} />

          <p className="mt-3 text-xs text-white/45">
            Based on {wins} win{wins === 1 ? "" : "s"} and {losses} loss
            {losses === 1 ? "" : "es"}.
            {scratches > 0
              ? ` ${scratches} scratch${scratches === 1 ? "" : "es"} ignored.`
              : ""}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-white/60">My In The Money percentage</span>
            <span className="font-medium text-white">{userItmPercent}%</span>
          </div>

          <ProgressBar value={userItmPercent} />

          <p className="mt-3 text-xs text-white/45">
            Based on {userItmHits} ITM hit{userItmHits === 1 ? "" : "s"} and{" "}
            {userItmMisses} miss{userItmMisses === 1 ? "" : "es"} across{" "}
            {userItmTotalNumbers} total pick number
            {userItmTotalNumbers === 1 ? "" : "s"}.
          </p>
        </div>
      </div>

      {/* Source Overview */}
      {sortedStats.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-black/30 p-8 text-white/70">
          No source metrics available yet.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Source Performance
              </h2>

              <p className="mt-1 text-sm text-white/50">
                Sorted by ITM rate, then first-pick accuracy.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Top ITM Source"
              value={topSource?.sourceName ?? "N/A"}
              description={
                topSource
                  ? `${topSource.itmPercent}% ITM rate`
                  : "No source data"
              }
            />

            <MetricCard
              label="Average ITM Rate"
              value={`${averageItm}%`}
              description="Average across all sources"
            />

            <MetricCard
              label="Average 1st Pick Accuracy"
              value={`${averageAccuracy}%`}
              description="Exact 1st pick winner rate"
            />

            <MetricCard
              label="Total ITM Hits"
              value={totalItmHits}
              description={`${totalItmNumbers} total numbers tracked`}
            />
          </div>

          {/* Source List */}
          <div className="space-y-4">
            {sortedStats.map((stat, index) => {
              const missedFirstPicks =
                stat.totalPicks - stat.correctFirstPicks;
              const itmMisses = stat.itmTotalNumbers - stat.itmHits;

              return (
                <div
                  key={stat.sourceId}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/[0.08]"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/40 text-sm font-semibold text-white/80">
                        #{index + 1}
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {stat.sourceName}
                        </h3>

                        <p className="mt-1 text-sm text-white/55">
                          {stat.itmHits} ITM hit
                          {stat.itmHits === 1 ? "" : "s"} out of{" "}
                          {stat.itmTotalNumbers} numbers
                        </p>

                        <p className="mt-1 text-sm text-white/45">
                          {stat.correctFirstPicks} exact first-pick winner
                          {stat.correctFirstPicks === 1 ? "" : "s"} out of{" "}
                          {stat.totalPicks}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[280px]">
                      <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                        <p className="text-sm text-white/45">ITM Rate</p>

                        <p className="mt-1 text-2xl font-bold text-white">
                          {stat.itmPercent}%
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                        <p className="text-sm text-white/45">1st Accuracy</p>

                        <p className="mt-1 text-2xl font-bold text-white">
                          {stat.accuracyPercent}%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-5 lg:grid-cols-2">
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-white/60">ITM Rate</span>
                        <span className="font-medium text-white">
                          {stat.itmPercent}%
                        </span>
                      </div>

                      <ProgressBar value={stat.itmPercent} />

                      <p className="mt-2 text-xs text-white/45">
                        {stat.itmHits} hit
                        {stat.itmHits === 1 ? "" : "s"} / {itmMisses} miss
                        {itmMisses === 1 ? "" : "es"}
                      </p>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-white/60">
                          First Pick Accuracy
                        </span>
                        <span className="font-medium text-white">
                          {stat.accuracyPercent}%
                        </span>
                      </div>

                      <ProgressBar value={stat.accuracyPercent} />

                      <p className="mt-2 text-xs text-white/45">
                        {stat.correctFirstPicks} correct / {missedFirstPicks}{" "}
                        missed
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 text-sm text-white/70 sm:grid-cols-2 lg:grid-cols-5">
                    <SmallStat label="ITM Hits" value={stat.itmHits} />
                    <SmallStat label="ITM Numbers" value={stat.itmTotalNumbers} />
                    <SmallStat label="ITM Misses" value={itmMisses} />
                    <SmallStat label="1st Pick Hits" value={stat.correctFirstPicks} />
                    <SmallStat label="1st Pick Total" value={stat.totalPicks} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

type MetricCardProps = {
  label: string;
  value: string | number;
  description: string;
};

const MetricCard = ({ label, value, description }: MetricCardProps) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
      <p className="text-sm uppercase tracking-[0.2em] text-white/50">
        {label}
      </p>

      <h2 className="mt-3 break-words text-xl font-bold text-white sm:text-2xl">
        {value}
      </h2>

      <p className="mt-2 text-sm text-white/65">{description}</p>
    </div>
  );
};

type SmallStatProps = {
  label: string;
  value: string | number;
};

const SmallStat = ({ label, value }: SmallStatProps) => {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2">
      <span className="text-white/45">{label}</span>

      <p className="mt-1 font-medium text-white">{value}</p>
    </div>
  );
};

type ProgressBarProps = {
  value: number;
};

const ProgressBar = ({ value }: ProgressBarProps) => {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-white/80 transition-all"
        style={{
          width: `${clampPercent(value)}%`,
        }}
      />
    </div>
  );
};

export default Metrics;