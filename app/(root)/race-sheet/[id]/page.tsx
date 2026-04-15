import RaceSheetHeader from "@/components/RaceSheetHeader";
import RaceSheetTable from "@/components/RaceSheetTable";
import {
  getRaceDay,
  getRaceDaySourceOptions,
} from "@/lib/race-actions/raceDay";
import { getRaceSheetData } from "@/lib/race-actions/raceSheet";
import React from "react";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const p = await params;
  const raceId = p.id;

  const raceDayResult = await getRaceDay({ id: raceId });
  const raceSheetResult = await getRaceSheetData(raceId);
  const raceDaySourcesResult = await getRaceDaySourceOptions(raceId);

  if (!raceDayResult.success || !raceDayResult.raceDay) {
    return (
      <section className="min-h-screen px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
          <h1 className="text-xl font-semibold">Unable to load race sheet</h1>
          <p className="mt-2 text-white/70">
            {raceDayResult.message ?? "Something went wrong."}
          </p>
        </div>
      </section>
    );
  }

  if (
    !raceSheetResult.success ||
    !raceSheetResult.sourcesList ||
    !raceSheetResult.rows
  ) {
    return (
      <section className="min-h-screen px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
          <h1 className="text-xl font-semibold">
            Unable to load race sheet data
          </h1>
          <p className="mt-2 text-white/70">
            {raceSheetResult.message ?? "Something went wrong."}
          </p>
        </div>
      </section>
    );
  }

  if (
    !raceDaySourcesResult.success ||
    !raceDaySourcesResult.allSources ||
    !raceDaySourcesResult.selectedSourceIds
  ) {
    return (
      <section className="min-h-screen px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
          <h1 className="text-xl font-semibold">
            Unable to load race day sources
          </h1>
          <p className="mt-2 text-white/70">
            {raceDaySourcesResult.message ?? "Something went wrong."}
          </p>
        </div>
      </section>
    );
  }

  const raceDay = raceDayResult.raceDay;

  return (
    <section className="min-h-screen text-white">
      <div className="mx-auto max-w-7xl space-y-10">
        <RaceSheetHeader
          raceDay={raceDay}
          allSources={raceDaySourcesResult.allSources}
          selectedSourceIds={raceDaySourcesResult.selectedSourceIds}
        />
        <RaceSheetTable
          raceDayId={raceDay.id}
          sources={raceSheetResult.sourcesList}
          initialRows={raceSheetResult.rows}
        />
      </div>
    </section>
  );
};

export default Page;