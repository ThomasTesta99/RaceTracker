import React from "react";
import { RaceSheetTableHeadProps } from "@/types";

const RaceSheetTableHead = ({ sources }: RaceSheetTableHeadProps) => {
  return (
    <thead>
      <tr className="border-b border-white/10 bg-white/10">
        <th
          rowSpan={2}
          className="min-w-[120px] px-4 py-3 text-center text-lg font-semibold sm:text-xl"
        >
          Result
        </th>

        <th
          rowSpan={2}
          className="min-w-[90px] px-4 py-3 text-center text-lg font-semibold sm:text-xl"
        >
          Race #
        </th>

        <th
          colSpan={3}
          className="px-4 py-3 text-center text-lg font-semibold text-white sm:text-xl"
        >
          Winners
        </th>

        <th
          colSpan={4}
          className="border-l border-white/20 px-4 py-3 text-center text-lg font-semibold text-white sm:text-xl"
        >
          My Picks
        </th>

        {sources.map((source) => (
          <th
            key={source.id}
            colSpan={3}
            className="border-l border-white/20 px-4 py-3 text-center text-lg font-semibold text-white sm:text-xl"
          >
            {source.name}
          </th>
        ))}
      </tr>

      <tr className="border-b border-white/10 bg-white/5 text-white/70">
        <th className="px-3 py-2 text-center font-medium">1st</th>
        <th className="px-3 py-2 text-center font-medium">2nd</th>
        <th className="px-3 py-2 text-center font-medium">3rd</th>

        <th className="border-l border-white/20 px-3 py-2 text-center font-medium">
          1st/2nd
        </th>
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
  );
};

export default RaceSheetTableHead;