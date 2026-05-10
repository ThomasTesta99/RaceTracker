import CreateLeaguePoolEntry from "@/components/CreatePoolEntry";
import DeleteLeaguePoolButton from "@/components/DeleteLeaguePoolDialog";
import LeaguePoolTable from "@/components/LeaguePoolTable";
import {
  getLeaguePoolById,
  getLeaguePoolEntries,
} from "@/lib/league-actions/league";
import React from "react";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const leaguePoolId = id;

  const leaguePoolResult = await getLeaguePoolById(leaguePoolId);
  const entriesResult = await getLeaguePoolEntries(leaguePoolId);

  if (!leaguePoolResult.success || !leaguePoolResult.leaguePool) {
    return (
      <section className="min-h-screen px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
          <h1 className="text-xl font-semibold">Unable to load league pool</h1>
          <p className="mt-2 text-white/70">
            {leaguePoolResult.message ?? "Something went wrong."}
          </p>
        </div>
      </section>
    );
  }

  if (!entriesResult.success || !entriesResult.entries) {
    return (
      <section className="min-h-screen px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
          <h1 className="text-xl font-semibold">
            Unable to load league pool entries
          </h1>
          <p className="mt-2 text-white/70">
            {entriesResult.message ?? "Something went wrong."}
          </p>
        </div>
      </section>
    );
  }

  const leaguePool = leaguePoolResult.leaguePool;
  const entries = entriesResult.entries;

  return (
    <section className="min-h-screen text-white">
      <div className="mx-auto space-y-10">

        <div className="flex items-center justify-between">
          <div className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-2xl backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.25em] text-white/40">
              Baseball League Pool
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
              League Pool
            </h1>

            <p className="mt-3 text-white/60">{leaguePool.date}</p>
          </div>

          <div className="flex items-center gap-3">
            <CreateLeaguePoolEntry leaguePoolId={leaguePoolId} />
            <DeleteLeaguePoolButton leaguePoolId={leaguePoolId} />
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-2xl backdrop-blur-xl">
          {entries.length === 0 ? (
            <p className="text-white/60">No entries found for this pool.</p>
          ) : (
            <LeaguePoolTable entries={entries} />
          )}
        </div>
      </div>
    </section>
  );
};

export default Page;