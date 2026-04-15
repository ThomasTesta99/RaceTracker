"use client";

import { createRaceDay } from "@/lib/race-actions/raceDay";
import React, { useEffect, useState, FormEvent } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Source } from "@/types";

const isSameDay = (a: Date, b: Date) => {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

const CreateRaceForm = () => {
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [useToday, setUseToday] = useState(false);
  const [track, setTrack] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const res = await fetch("/api/sources");
        const result = await res.json();

        if (result.success) {
          setSources(result.sourcesList ?? []);
        } else {
          setMessage(result.message ?? "Failed to load sources.");
        }
      } catch (error) {
        console.error(error);
        setMessage("Failed to load sources.");
      }
    };

    fetchSources();
  }, []);

  const toggleSource = (sourceId: string) => {
    setSelectedSourceIds((prev) =>
      prev.includes(sourceId)
        ? prev.filter((id) => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!selectedDate) {
      setMessage("Please select a date.");
      setLoading(false);
      return;
    }

    if (selectedSourceIds.length === 0) {
      setMessage("Please select at least one source.");
      setLoading(false);
      return;
    }

    const formattedDate = format(selectedDate, "yyyy-MM-dd");

    const result = await createRaceDay({
      date: formattedDate,
      track,
      sourceIds: selectedSourceIds,
    });

    if (result.success && result.raceDay) {
      router.push(`/race-sheet/${result.raceDay.id}`);
      return;
    } else {
      setMessage(result.message);
    }

    setLoading(false);
  };

  const handleTodayChange = (checked: boolean) => {
    setUseToday(checked);

    if (checked) {
      setSelectedDate(new Date());
    } else {
      setSelectedDate(undefined);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);

    if (!date) {
      setUseToday(false);
      return;
    }

    setUseToday(isSameDay(date, new Date()));
  };

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
      <div className="mb-6 flex flex-col gap-3">
        <div>
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-medium text-white shadow-sm backdrop-blur-sm">
            {selectedDate
              ? format(selectedDate, "MMMM d, yyyy")
              : "No date selected"}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/20 px-4 py-3">
          <Checkbox
            id="today"
            checked={useToday}
            onCheckedChange={(checked) => handleTodayChange(checked === true)}
            className="cursor-pointer"
          />
          <label
            htmlFor="today"
            className="cursor-pointer text-sm font-medium text-white"
          >
            Use today&apos;s date
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-white">Date</label>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                disabled={useToday}
                className={cn(
                  "w-full justify-start rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-left text-white",
                  !selectedDate && "text-white/40",
                  useToday && "opacity-70"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="track" className="text-sm font-medium text-white">
            Track
          </label>
          <input
            id="track"
            type="text"
            value={track}
            onChange={(e) => setTrack(e.target.value)}
            placeholder="Enter track name"
            required
            className="rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-white/40"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-white">Sources</label>

          <div className="grid gap-3 rounded-lg border border-white/10 bg-black/20 p-4">
            {sources.length === 0 ? (
              <p className="text-sm text-white/60">No sources available.</p>
            ) : (
              sources.map((source) => (
                <div key={source.id} className="flex items-center gap-3">
                  <Checkbox
                    id={source.id}
                    checked={selectedSourceIds.includes(source.id)}
                    onCheckedChange={() => toggleSource(source.id)}
                    className="cursor-pointer"
                  />
                  <label
                    htmlFor={source.id}
                    className="cursor-pointer text-sm text-white"
                  >
                    {source.name}
                  </label>
                </div>
              ))
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer rounded-lg bg-white px-4 py-3 font-semibold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Race Sheet"}
        </button>
      </form>

      {message && <p className="mt-4 text-sm text-white/80">{message}</p>}
    </div>
  );
};

export default CreateRaceForm;