"use client";

import { saveRaceSheet } from "@/lib/race-actions/raceSheet";
import {
  PickField,
  RaceResultOption,
  RaceRow,
  RaceSheetTableProps,
} from "@/types";
import { useState, useTransition } from "react";
import RaceSheetTableHead from "./RaceSheetTableHead";
import RaceSheetRow from "./RaceSheetRow";

const RaceSheetTable = ({
  raceDayId,
  sources,
  initialRows,
}: RaceSheetTableProps) => {
  const [rows, setRows] = useState<RaceRow[]>(initialRows);
  const [message, setMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  const [isPending, startTransition] = useTransition();

  const updateResult = (raceNumber: number, value: RaceResultOption) => {
    setRows((prev) =>
      prev.map((row) =>
        row.raceNumber === raceNumber ? { ...row, result: value } : row
      )
    );
  };

  const updateWinner = (
    raceNumber: number,
    field: PickField,
    value: string
  ) => {
    setRows((prev) =>
      prev.map((row) =>
        row.raceNumber === raceNumber
          ? {
              ...row,
              winners: {
                ...row.winners,
                [field]: value,
              },
            }
          : row
      )
    );
  };

  const updateDoublePick = (
    raceNumber: number,
    field: "value1" | "value2",
    value: string
  ) => {
    setRows((prev) =>
      prev.map((row) =>
        row.raceNumber === raceNumber
          ? {
              ...row,
              doublePick: {
                ...row.doublePick,
                [field]: value,
              },
            }
          : row
      )
    );
  };

  const updateUserPick = (
    raceNumber: number,
    field: PickField,
    value: string
  ) => {
    setRows((prev) =>
      prev.map((row) =>
        row.raceNumber === raceNumber
          ? {
              ...row,
              userPicks: {
                ...row.userPicks,
                [field]: value,
              },
            }
          : row
      )
    );
  };

  const updateSourcePick = (
    raceNumber: number,
    sourceId: string,
    field: PickField,
    value: string
  ) => {
    setRows((prev) =>
      prev.map((row) =>
        row.raceNumber === raceNumber
          ? {
              ...row,
              sourcePicks: {
                ...row.sourcePicks,
                [sourceId]: {
                  ...row.sourcePicks[sourceId],
                  [field]: value,
                },
              },
            }
          : row
      )
    );
  };

  const handleSave = () => {
    setMessage(null);

    startTransition(async () => {
      const result = await saveRaceSheet({
        raceDayId,
        rows,
      });

      setMessage({
        text: result.message,
        isError: !result.success,
      });
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Race Sheet</h2>

          <p className="text-sm text-white/60">
            Enter the winners, your picks, and each source&apos;s picks.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="cursor-pointer rounded-xl bg-white px-4 py-2 font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Race Sheet"}
        </button>
      </div>

      {message ? (
        <p
          className={`text-sm ${
            message.isError ? "text-red-400" : "text-green-400"
          }`}
        >
          {message.text}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5 shadow-lg backdrop-blur-sm">
        <table className="min-w-full border-collapse text-sm text-white">
          <RaceSheetTableHead sources={sources} />

          <tbody>
            {rows.map((row) => (
              <RaceSheetRow
                key={row.raceNumber}
                row={row}
                sources={sources}
                updateResult={updateResult}
                updateWinner={updateWinner}
                updateDoublePick={updateDoublePick}
                updateUserPick={updateUserPick}
                updateSourcePick={updateSourcePick}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RaceSheetTable;