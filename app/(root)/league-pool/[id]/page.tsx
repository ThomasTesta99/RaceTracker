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
      <section className="min-h-screen px-4 py-6 text-white sm:px-6 sm:py-10">
        <div className="mx-auto max-w-5xl rounded-2xl border border-red-500/20 bg-red-500/10 p-4 sm:p-6">
          <h1 className="text-lg font-semibold sm:text-xl">
            Unable to load league pool
          </h1>

          <p className="mt-2 text-sm text-white/70 sm:text-base">
            {leaguePoolResult.message ?? "Something went wrong."}
          </p>
        </div>
      </section>
    );
  }

  if (!entriesResult.success || !entriesResult.entries) {
    return (
      <section className="min-h-screen px-4 py-6 text-white sm:px-6 sm:py-10">
        <div className="mx-auto max-w-5xl rounded-2xl border border-red-500/20 bg-red-500/10 p-4 sm:p-6">
          <h1 className="text-lg font-semibold sm:text-xl">
            Unable to load league pool entries
          </h1>

          <p className="mt-2 text-sm text-white/70 sm:text-base">
            {entriesResult.message ?? "Something went wrong."}
          </p>
        </div>
      </section>
    );
  }

  const leaguePool = leaguePoolResult.leaguePool;
  const entries = entriesResult.entries;

  return (
    <section className="min-h-screen px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto w-full max-w-7xl space-y-6 sm:space-y-8 lg:space-y-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full bg-black/40 p-5 shadow-2xl backdrop-blur-xl sm:p-6 lg:w-auto lg:min-w-[360px]">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40 sm:text-sm sm:tracking-[0.25em]">
              Baseball League Pool
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              League Pool
            </h1>

            <p className="mt-3 text-sm text-white/60 sm:text-base">
              {leaguePool.date}
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
            <div className="w-full sm:w-auto">
              <CreateLeaguePoolEntry leaguePoolId={leaguePoolId} />
            </div>

            <div className="w-full sm:w-auto">
              <DeleteLeaguePoolButton leaguePoolId={leaguePoolId} />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/40 p-4 shadow-2xl backdrop-blur-xl sm:p-6">
          {entries.length === 0 ? (
            <p className="text-sm text-white/60 sm:text-base">
              No entries found for this pool.
            </p>
          ) : (
            <div className="w-full overflow-x-auto">
              <div className="min-w-[700px]">
                <LeaguePoolTable entries={entries} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Page;