"use client";

import { RaceDay } from "@/types";
import React, { useState } from "react";
import { CalendarDays, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const RaceSheetHeader = ({ raceDay }: { raceDay: RaceDay }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const [year, month, day] = raceDay.date.split("-").map(Number);

  const formattedDate = new Date(year, month - 1, day).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const handleDelete = async () => {
    const confirmed = confirm(
      "Are you sure you want to delete this race day? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);

      const response = await fetch(`/api/race-days/${raceDay.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete race day");
      }

      router.push("/race-sheets");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete race day:", error);
      alert("Failed to delete race day. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="p-6 shadow-lg backdrop-blur-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-4">
          <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            {raceDay.track}
          </h1>

          <div className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm text-white/80">
            <CalendarDays className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex">
            <Button
              variant="destructive"
              className="cursor-pointer gap-2 font-semibold"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash className="h-4 w-4" />
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:items-end">Bet Money</div>
      </div>
    </section>
  );
};

export default RaceSheetHeader;