"use client";

import { createRaceDay } from "@/lib/race-actions/raceDay";
import React, { useState, FormEvent } from "react";

const CreateRaceForm = () => {
  const [date, setDate] = useState("");
  const [track, setTrack] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const result = await createRaceDay({ date, track });

    if (result.success) {
      setMessage(result.message);
      setDate("");
      setTrack("");
    } else {
      setMessage(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
      <h2 className="mb-6 text-2xl font-bold text-white">Enter the Fields to Create a Race Sheet</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="date" className="text-sm font-medium text-white">
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-white/40"
          />
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

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-white px-4 py-3 font-semibold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Race Day"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-sm text-white/80">{message}</p>
      )}
    </div>
  );
};

export default CreateRaceForm;