import React from "react";
import { RaceSheetRowProps } from "@/types";
import {
  getDoublePickHighlightClass,
  getPickHighlightClass,
  getUserPickHighlightClass,
  getWinnerHighlightClass,
} from "@/lib/utils";
import PickInput from "./PickInput";
import DoublePickInput from "./DoublePickInput";
import ResultCell from "./ResultCell";

const RaceSheetRow = ({
  row,
  sources,
  updateResult,
  updateWinner,
  updateDoublePick,
  updateUserPick,
  updateSourcePick,
}: RaceSheetRowProps) => {
  return (
    <tr className="border-b border-white/10 align-middle hover:bg-white/5">
      <td className="px-4 py-3">
        <ResultCell
          value={row.result}
          onChange={(value) => updateResult(row.raceNumber, value)}
          onClear={() => updateResult(row.raceNumber, "")}
        />
      </td>

      <td className="px-4 py-3 text-center font-semibold text-white/90">
        {row.raceNumber}
      </td>

      {/* Winners */}
      <td className="px-2 py-3">
        <PickInput
          value={row.winners.value1}
          onChange={(value) => updateWinner(row.raceNumber, "value1", value)}
          highlightClass={getWinnerHighlightClass(row, row.winners.value1, 0)}
        />
      </td>

      <td className="px-2 py-3">
        <PickInput
          value={row.winners.value2}
          onChange={(value) => updateWinner(row.raceNumber, "value2", value)}
          highlightClass={getWinnerHighlightClass(row, row.winners.value2, 1)}
        />
      </td>

      <td className="px-2 py-3">
        <PickInput
          value={row.winners.value3}
          onChange={(value) => updateWinner(row.raceNumber, "value3", value)}
          highlightClass={getWinnerHighlightClass(row, row.winners.value3, 2)}
        />
      </td>

      <td className="px-2 py-3">
        <PickInput
          value={row.winners.value4 ?? ""}
          onChange={(value) => updateWinner(row.raceNumber, "value4", value)}
          highlightClass={getWinnerHighlightClass(
            row,
            row.winners.value4 ?? "",
            3
          )}
        />
      </td>

      {/* My Picks - Double Entry */}
      <td className="border-l border-white/20 px-2 py-3">
        <DoublePickInput
          value1={row.doublePick?.value1 ?? ""}
          value2={row.doublePick?.value2 ?? ""}
          onChangeValue1={(value) =>
            updateDoublePick(row.raceNumber, "value1", value)
          }
          onChangeValue2={(value) =>
            updateDoublePick(row.raceNumber, "value2", value)
          }
          highlightClass1={getDoublePickHighlightClass(
            row.winners,
            row.doublePick?.value1 ?? "",
            0
          )}
          highlightClass2={getDoublePickHighlightClass(
            row.winners,
            row.doublePick?.value2 ?? "",
            1
          )}
        />
      </td>

      {/* My Picks - Normal Picks */}
      <td className="px-2 py-3">
        <PickInput
          value={row.userPicks.value1}
          onChange={(value) => updateUserPick(row.raceNumber, "value1", value)}
          highlightClass={getUserPickHighlightClass(
            row,
            row.userPicks.value1,
            0
          )}
        />
      </td>

      <td className="px-2 py-3">
        <PickInput
          value={row.userPicks.value2}
          onChange={(value) => updateUserPick(row.raceNumber, "value2", value)}
          highlightClass={getUserPickHighlightClass(
            row,
            row.userPicks.value2,
            1
          )}
        />
      </td>

      <td className="px-2 py-3">
        <PickInput
          value={row.userPicks.value3}
          onChange={(value) => updateUserPick(row.raceNumber, "value3", value)}
          highlightClass={getUserPickHighlightClass(
            row,
            row.userPicks.value3,
            2
          )}
        />
      </td>

      <td className="px-2 py-3">
        <PickInput
          value={row.userPicks.value4 ?? ""}
          onChange={(value) => updateUserPick(row.raceNumber, "value4", value)}
          highlightClass={getUserPickHighlightClass(
            row,
            row.userPicks.value4 ?? "",
            3
          )}
        />
      </td>

      {/* Sources */}
      {sources.map((source) => (
        <React.Fragment key={source.id}>
          <td className="border-l border-white/20 px-2 py-3">
            <PickInput
              value={row.sourcePicks[source.id]?.value1 ?? ""}
              onChange={(value) =>
                updateSourcePick(row.raceNumber, source.id, "value1", value)
              }
              highlightClass={getPickHighlightClass(
                row.winners,
                row.sourcePicks[source.id]?.value1 ?? "",
                0
              )}
            />
          </td>

          <td className="px-2 py-3">
            <PickInput
              value={row.sourcePicks[source.id]?.value2 ?? ""}
              onChange={(value) =>
                updateSourcePick(row.raceNumber, source.id, "value2", value)
              }
              highlightClass={getPickHighlightClass(
                row.winners,
                row.sourcePicks[source.id]?.value2 ?? "",
                1
              )}
            />
          </td>

          <td className="px-2 py-3">
            <PickInput
              value={row.sourcePicks[source.id]?.value3 ?? ""}
              onChange={(value) =>
                updateSourcePick(row.raceNumber, source.id, "value3", value)
              }
              highlightClass={getPickHighlightClass(
                row.winners,
                row.sourcePicks[source.id]?.value3 ?? "",
                2
              )}
            />
          </td>

          <td className="px-2 py-3">
            <PickInput
              value={row.sourcePicks[source.id]?.value4 ?? ""}
              onChange={(value) =>
                updateSourcePick(row.raceNumber, source.id, "value4", value)
              }
              highlightClass={getPickHighlightClass(
                row.winners,
                row.sourcePicks[source.id]?.value4 ?? "",
                3
              )}
            />
          </td>
        </React.Fragment>
      ))}
    </tr>
  );
};

export default RaceSheetRow;