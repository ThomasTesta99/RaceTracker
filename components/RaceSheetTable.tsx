"use client";

import { saveRaceSheet } from "@/lib/race-actions/raceSheet";
import {
  RaceResultOption,
  RaceRow,
  RaceSheetTableProps,
} from "@/types";
import React, { useState, useTransition } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { getPickHighlightClass, getUserPickHighlightClass } from "@/lib/utils";

const RaceSheetTable = ({
  raceDayId,
  sources,
  initialRows,
}: RaceSheetTableProps) => {
  const [rows, setRows] = useState<RaceRow[]>(initialRows);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();

  const updateResult = (raceNumber: number, value: RaceResultOption) => {
    setRows((prev) =>
      prev.map((row) =>
        row.raceNumber === raceNumber ? { ...row, result: value } : row
      )
    );
  };

  const updateUserPick = (
    raceNumber: number,
    field: "value1" | "value2" | "value3",
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
    field: "value1" | "value2" | "value3",
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

      setMessage({ text: result.message, isError: !result.success });
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Race Sheet</h2>
          <p className="text-sm text-white/60">
            Enter your picks and compare them against each source.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isPending}
          className="cursor-pointer rounded-xl bg-white px-4 py-2 font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Race Sheet"}
        </button>
      </div>

      {message ? (
        <p className={`text-sm ${message.isError ? "text-red-400" : "text-green-400"}`}>
          {message.text}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5 shadow-lg backdrop-blur-sm">
        <table className="min-w-full border-collapse text-sm text-white">
          <thead>
            <tr className="border-b border-white/10 bg-white/10">
              <th
                rowSpan={2}
                className="min-w-[120px] px-4 py-3 text-left font-semibold text-xl"
              >
                Result
              </th>
              <th
                rowSpan={2}
                className="min-w-[90px] px-4 py-3 text-left font-semibold text-xl"
              >
                Race #
              </th>
              <th
                colSpan={3}
                className="px-4 py-3 text-center font-semibold text-white text-xl"
              >
                Winners
              </th>

              {sources.map((source) => (
                <th
                  key={source.id}
                  colSpan={3}
                  className="border-l border-white/20 px-4 py-3 text-center font-semibold text-white text-xl"
                >
                  {source.name}
                </th>
              ))}
            </tr>

            <tr className="border-b border-white/10 bg-white/5 text-white/70">
              <th className="px-3 py-2 text-center font-medium">1st</th>
              <th className="px-3 py-2 text-center font-medium">2nd</th>
              <th className="px-3 py-2 text-center font-medium">3rd</th>

              {sources.map((source) => (
                <React.Fragment key={source.id}>
                  <th className="border-l border-white/20 px-3 py-2 text-center font-medium">
                    1st
                  </th>
                  <th className="px-3 py-2 text-center font-medium">2nd</th>
                  <th className="px-3 py-2 text-center font-medium">3rd</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr
                key={row.raceNumber}
                className="border-b border-white/10 align-middle hover:bg-white/5"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Select
                      value={row.result}
                      onValueChange={(value) =>
                        updateResult(row.raceNumber, value as RaceResultOption)
                      }
                    >
                      <SelectTrigger className="w-full border-white/10 bg-black/30 text-sm text-white">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="border-white/10 bg-zinc-900 text-white">
                        <SelectItem value="win">Win</SelectItem>
                        <SelectItem value="loss">Loss</SelectItem>
                        <SelectItem value="scratch">Scratch</SelectItem>
                      </SelectContent>
                    </Select>

                    <button
                      type="button"
                      onClick={() => updateResult(row.raceNumber, "")}
                      className="rounded-md border border-white/10 px-2 py-2 text-xs text-white/70 hover:bg-white/5"
                    >
                      Clear
                    </button>
                  </div>
                </td>

                <td className="px-4 py-3 text-white/90">{row.raceNumber}</td>

                <td className="px-2 py-3">
                  <input
                    value={row.userPicks.value1}
                    onChange={(e) =>
                      updateUserPick(row.raceNumber, "value1", e.target.value)
                    }
                    className={`w-16 rounded-lg border px-2 py-2 text-center text-white outline-none ${getUserPickHighlightClass(
                      row,
                      row.userPicks.value1,
                      0
                    )}`}
                  />
                </td>
                <td className="px-2 py-3">
                  <input
                    value={row.userPicks.value2}
                    onChange={(e) =>
                      updateUserPick(row.raceNumber, "value2", e.target.value)
                    }
                    className={`w-16 rounded-lg border px-2 py-2 text-center text-white outline-none ${getUserPickHighlightClass(
                      row,
                      row.userPicks.value2,
                      1
                    )}`}
                  />
                </td>
                <td className="px-2 py-3">
                  <input
                    value={row.userPicks.value3}
                    onChange={(e) =>
                      updateUserPick(row.raceNumber, "value3", e.target.value)
                    }
                    className={`w-16 rounded-lg border px-2 py-2 text-center text-white outline-none ${getUserPickHighlightClass(
                      row,
                      row.userPicks.value3,
                      2
                    )}`}
                  />
                </td>

                {sources.map((source) => (
                  <React.Fragment key={source.id}>
                    <td className="border-l border-white/20 px-2 py-3">
                      <input
                        value={row.sourcePicks[source.id]?.value1 ?? ""}
                        onChange={(e) =>
                          updateSourcePick(
                            row.raceNumber,
                            source.id,
                            "value1",
                            e.target.value
                          )
                        }
                        className={`w-16 rounded-lg border px-2 py-2 text-center text-white outline-none ${getPickHighlightClass(
                          row.userPicks,
                          row.sourcePicks[source.id]?.value1 ?? "",
                          0
                        )}`}
                      />
                    </td>
                    <td className="px-2 py-3">
                      <input
                        value={row.sourcePicks[source.id]?.value2 ?? ""}
                        onChange={(e) =>
                          updateSourcePick(
                            row.raceNumber,
                            source.id,
                            "value2",
                            e.target.value
                          )
                        }
                        className={`w-16 rounded-lg border px-2 py-2 text-center text-white outline-none ${getPickHighlightClass(
                          row.userPicks,
                          row.sourcePicks[source.id]?.value2 ?? "",
                          1
                        )}`}
                      />
                    </td>
                    <td className="px-2 py-3">
                      <input
                        value={row.sourcePicks[source.id]?.value3 ?? ""}
                        onChange={(e) =>
                          updateSourcePick(
                            row.raceNumber,
                            source.id,
                            "value3",
                            e.target.value
                          )
                        }
                        className={`w-16 rounded-lg border px-2 py-2 text-center text-white outline-none ${getPickHighlightClass(
                          row.userPicks,
                          row.sourcePicks[source.id]?.value3 ?? "",
                          2
                        )}`}
                      />
                    </td>
                  </React.Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RaceSheetTable;