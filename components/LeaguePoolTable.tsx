"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

import { LeaguePoolEntry } from "@/types";
import {
  deleteLeaguePoolEntry,
  editLeaguePoolEntry,
} from "@/lib/league-actions/league";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LeaguePoolTableProps = {
  entries: LeaguePoolEntry[];
};

type NumberColorKey =
  | "number0Color"
  | "number1Color"
  | "number2Color"
  | "number3Color"
  | "number4Color"
  | "number5Color"
  | "number6Color"
  | "number7Color"
  | "number8Color"
  | "number9Color"
  | "number10Color";

const numberColorKeys: NumberColorKey[] = [
  "number0Color",
  "number1Color",
  "number2Color",
  "number3Color",
  "number4Color",
  "number5Color",
  "number6Color",
  "number7Color",
  "number8Color",
  "number9Color",
  "number10Color",
];

const colorOptions: {
  label: string;
  value: string | null;
  className: string;
}[] = [
  {
    label: "No Color",
    value: null,
    className: "bg-black/30 text-white hover:bg-white/10",
  },
  {
    label: "Green",
    value: "green",
    className: "bg-green-500/70 text-white hover:bg-green-500/80",
  },
  {
    label: "Yellow",
    value: "yellow",
    className: "bg-yellow-400/80 text-black hover:bg-yellow-400",
  },
  {
    label: "Red",
    value: "red",
    className: "bg-red-500/70 text-white hover:bg-red-500/80",
  },
  {
    label: "Blue",
    value: "blue",
    className: "bg-blue-500/70 text-white hover:bg-blue-500/80",
  },
  {
    label: "Gray",
    value: "gray",
    className: "bg-zinc-500/70 text-white hover:bg-zinc-500/80",
  },
];

const getColorClass = (color: string | null) => {
  switch (color) {
    case "green":
      return "bg-green-500/70 text-white";
    case "yellow":
      return "bg-yellow-400/80 text-black";
    case "red":
      return "bg-red-500/70 text-white";
    case "blue":
      return "bg-blue-500/70 text-white";
    case "gray":
      return "bg-zinc-500/70 text-white";
    default:
      return "bg-black/30 text-white hover:bg-white/10";
  }
};

const LeaguePoolTable = ({ entries }: LeaguePoolTableProps) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const [colorDialogOpen, setColorDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<LeaguePoolEntry | null>(
    null
  );
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedColorKey, setSelectedColorKey] =
    useState<NumberColorKey | null>(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [entryToEdit, setEntryToEdit] = useState<LeaguePoolEntry | null>(null);
  const [editTeam, setEditTeam] = useState("");
  const [editName, setEditName] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] =
    useState<LeaguePoolEntry | null>(null);

  const openColorDialog = (
    entry: LeaguePoolEntry,
    number: number,
    colorKey: NumberColorKey
  ) => {
    setSelectedEntry(entry);
    setSelectedNumber(number);
    setSelectedColorKey(colorKey);
    setMessage("");
    setColorDialogOpen(true);
  };

  const openEditDialog = (entry: LeaguePoolEntry) => {
    setEntryToEdit(entry);
    setEditTeam(entry.team);
    setEditName(entry.name);
    setMessage("");
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (entry: LeaguePoolEntry) => {
    setEntryToDelete(entry);
    setMessage("");
    setDeleteDialogOpen(true);
  };

  const handleColorSelect = (color: string | null) => {
    if (!selectedEntry || !selectedColorKey) return;

    startTransition(async () => {
      const result = await editLeaguePoolEntry(selectedEntry.id, {
        [selectedColorKey]: color,
      });

      if (!result.success) {
        setMessage(result.message ?? "Failed to update color.");
        return;
      }

      setColorDialogOpen(false);
      router.refresh();
    });
  };

  const handleEditEntry = () => {
    if (!entryToEdit) return;

    if (!editTeam.trim()) {
      setMessage("Please enter a team.");
      return;
    }

    if (!editName.trim()) {
      setMessage("Please enter a name.");
      return;
    }

    startTransition(async () => {
      const result = await editLeaguePoolEntry(entryToEdit.id, {
        team: editTeam.trim(),
        name: editName.trim(),
      });

      if (!result.success) {
        setMessage(result.message ?? "Failed to edit entry.");
        return;
      }

      setEditDialogOpen(false);
      router.refresh();
    });
  };

  const handleDeleteEntry = () => {
    if (!entryToDelete) return;

    startTransition(async () => {
      const result = await deleteLeaguePoolEntry(entryToDelete.id);

      if (!result.success) {
        setMessage(result.message ?? "Failed to delete entry.");
        return;
      }

      setDeleteDialogOpen(false);
      router.refresh();
    });
  };

  return (
    <>
      {/* Desktop / Tablet Table */}
      <div className="hidden overflow-x-auto rounded-2xl border border-white/20 md:block">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="bg-white/10 text-white">
              <th className="border border-white/20 px-3 py-3 text-base font-bold lg:px-5 lg:py-4 lg:text-xl">
                Team
              </th>

              <th className="border border-white/20 px-3 py-3 text-base font-bold lg:px-5 lg:py-4 lg:text-xl">
                Name
              </th>

              {Array.from({ length: 11 }, (_, index) => (
                <th
                  key={index}
                  className="border border-white/20 px-2 py-3 text-center text-base font-bold lg:px-5 lg:py-4 lg:text-xl"
                >
                  {index}
                </th>
              ))}

              <th className="border border-white/20 px-3 py-3 text-center text-base font-bold lg:px-5 lg:py-4 lg:text-xl">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="text-white">
                <td className="border border-white/20 px-3 py-3 text-base font-semibold lg:px-5 lg:py-4 lg:text-xl">
                  {entry.team}
                </td>

                <td className="border border-white/20 px-3 py-3 text-base font-medium text-white/85 lg:px-5 lg:py-4 lg:text-xl">
                  {entry.name}
                </td>

                {numberColorKeys.map((colorKey, index) => {
                  const color = entry[colorKey];

                  return (
                    <td
                      key={colorKey}
                      className={cn(
                        "border border-white/20 p-0 text-center transition",
                        getColorClass(color)
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => openColorDialog(entry, index, colorKey)}
                        className="flex h-12 w-full cursor-pointer items-center justify-center text-base font-bold lg:h-16 lg:text-xl"
                      >
                        {index}
                      </button>
                    </td>
                  );
                })}

                <td className="border border-white/20 px-3 py-3 lg:px-5 lg:py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditDialog(entry)}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20 lg:text-sm"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => openDeleteDialog(entry)}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-red-400/30 bg-red-500/15 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/25 lg:text-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="rounded-2xl border border-white/15 bg-black/30 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                  Team
                </p>

                <h3 className="mt-1 truncate text-lg font-bold text-white">
                  {entry.team}
                </h3>

                <p className="mt-1 truncate text-sm font-medium text-white/70">
                  {entry.name}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEditDialog(entry)}
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
                  aria-label="Edit entry"
                >
                  <Pencil className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => openDeleteDialog(entry)}
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-red-400/30 bg-red-500/15 text-red-200 transition hover:bg-red-500/25"
                  aria-label="Delete entry"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
              {numberColorKeys.map((colorKey, index) => {
                const color = entry[colorKey];

                return (
                  <button
                    key={colorKey}
                    type="button"
                    onClick={() => openColorDialog(entry, index, colorKey)}
                    className={cn(
                      "flex h-12 cursor-pointer items-center justify-center rounded-xl border border-white/15 text-base font-bold transition",
                      getColorClass(color)
                    )}
                  >
                    {index}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={colorDialogOpen} onOpenChange={setColorDialogOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] border border-white/10 bg-zinc-950 text-white shadow-2xl sm:max-w-md [&>button]:text-white/70 [&>button]:hover:cursor-pointer">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold sm:text-2xl">
              Set Number Color
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-white/50">Entry</p>

              <p className="mt-1 text-base font-semibold sm:text-lg">
                {selectedEntry?.team} - {selectedEntry?.name}
              </p>

              <p className="mt-3 text-sm text-white/50">Number</p>

              <p className="mt-1 text-2xl font-bold sm:text-3xl">
                {selectedNumber}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {colorOptions.map((option) => (
                <Button
                  key={option.label}
                  type="button"
                  disabled={isPending}
                  onClick={() => handleColorSelect(option.value)}
                  className={cn(
                    "h-12 cursor-pointer border border-white/15 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-60",
                    option.className
                  )}
                >
                  {option.label}
                </Button>
              ))}
            </div>

            {message && <p className="text-sm text-red-300">{message}</p>}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] border border-white/10 bg-zinc-950 text-white shadow-2xl sm:max-w-md [&>button]:text-white/70 [&>button]:hover:cursor-pointer">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold sm:text-2xl">
              Edit Entry
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="edit-team" className="text-sm font-medium text-white">
                Team
              </label>

              <input
                id="edit-team"
                type="text"
                value={editTeam}
                onChange={(e) => setEditTeam(e.target.value)}
                placeholder="Enter team name"
                className="rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-white/40"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="edit-name" className="text-sm font-medium text-white">
                Name
              </label>

              <input
                id="edit-name"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter person name"
                className="rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-white/40"
              />
            </div>

            <Button
              type="button"
              disabled={isPending}
              onClick={handleEditEntry}
              className="w-full cursor-pointer bg-white font-semibold text-black hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>

            {message && <p className="text-sm text-red-300">{message}</p>}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] border border-white/10 bg-zinc-950 text-white shadow-2xl sm:max-w-md [&>button]:text-white/70 [&>button]:hover:cursor-pointer">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold sm:text-2xl">
              Delete Entry
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-white/70 sm:text-base">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-white">
                {entryToDelete?.team} - {entryToDelete?.name}
              </span>
              ?
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() => setDeleteDialogOpen(false)}
                className="flex-1 cursor-pointer border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </Button>

              <Button
                type="button"
                disabled={isPending}
                onClick={handleDeleteEntry}
                className="flex-1 cursor-pointer bg-red-500 font-semibold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>

            {message && <p className="text-sm text-red-300">{message}</p>}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeaguePoolTable;