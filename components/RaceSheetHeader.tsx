import { RaceDay } from "@/types";
import React from "react";
import { CalendarDays, Flag } from "lucide-react";

const RaceSheetHeader = ({ raceDay }: { raceDay: RaceDay }) => {
  const formattedDate = new Date(raceDay.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className=" p-6 shadow-lg backdrop-blur-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-4">
          <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            {raceDay.track}
          </h1>
          <div className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm text-white/80">
            <CalendarDays className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:items-end">
            Bet Money
          
        </div>
      </div>
    </section>
  );
};

export default RaceSheetHeader;