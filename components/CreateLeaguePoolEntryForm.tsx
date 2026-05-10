"use client";

import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createLeaguePoolEntry } from "@/lib/league-actions/league";
import { CreateLeaguePoolEntryFormProps } from "@/types";



const CreateLeaguePoolEntryForm = ({
  leaguePoolId,
  onSuccess,
}: CreateLeaguePoolEntryFormProps) => {
  const router = useRouter();

  const [team, setTeam] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    if (!team.trim()) {
      setMessage("Please enter a team.");
      setLoading(false);
      return;
    }

    if (!name.trim()) {
      setMessage("Please enter a name.");
      setLoading(false);
      return;
    }

    const result = await createLeaguePoolEntry(
      leaguePoolId,
      team.trim(),
      name.trim()
    );

    if (result.success) {
      setTeam("");
      setName("");
      onSuccess?.();
      router.refresh();
      return;
    }

    setMessage(
      result.message ?? "There was an error creating the league pool entry."
    );

    setLoading(false);
  };

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="team" className="text-sm font-medium text-white">
            Team
          </label>

          <input
            id="team"
            type="text"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            placeholder="Enter team name"
            required
            className="rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-white/40"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-white">
            Name
          </label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter person name"
            required
            className="rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-white/40"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer rounded-lg bg-white px-4 py-3 font-semibold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Adding..." : "Add Entry"}
        </button>
      </form>

      {message && <p className="mt-4 text-sm text-white/80">{message}</p>}
    </div>
  );
};

export default CreateLeaguePoolEntryForm;