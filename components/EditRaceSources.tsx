"use client";

import React, { useState, useTransition } from "react";
import { Source } from "@/types";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { updateRaceDaySources } from "@/lib/race-actions/raceDay";
import { useRouter } from "next/navigation";

type EditRaceSourcesProps = {
  raceDayId: string;
  allSources: Source[];
  selectedSourceIds: string[];
};

const EditRaceSources = ({
  raceDayId,
  allSources,
  selectedSourceIds,
}: EditRaceSourcesProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(selectedSourceIds);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const toggleSource = (sourceId: string) => {
    setSelectedIds((prev) =>
      prev.includes(sourceId)
        ? prev.filter((id) => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const handleSave = () => {
    setMessage("");

    if (selectedIds.length === 0) {
      setMessage("Please select at least one source.");
      return;
    }

    startTransition(async () => {
      const result = await updateRaceDaySources({
        raceDayId,
        sourceIds: selectedIds,
      });

      if (!result.success) {
        setMessage(result.message);
        return;
      }

      setOpen(false);
      router.refresh();
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="secondary" className="cursor-pointer">
          Edit Sources
        </Button>
      </DialogTrigger>

      <DialogContent className="border-white/10 bg-zinc-950 text-white [&>button]:cursor-pointer">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-semibold">
            Edit Sources
          </DialogTitle>
          <DialogDescription className="text-sm text-white/60">
            Choose which sources should appear on this race sheet.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          {allSources.length === 0 ? (
            <p className="text-sm text-white/60">No sources available.</p>
          ) : (
            allSources.map((source) => (
              <div key={source.id} className="flex items-center gap-3">
                <Checkbox
                  id={source.id}
                  checked={selectedIds.includes(source.id)}
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

        {message ? <p className="text-sm text-red-400">{message}</p> : null}

        <div className="flex justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={handleSave}
            disabled={isPending}
            className="cursor-pointer"
          >
            {isPending ? "Saving..." : "Save Sources"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditRaceSources;