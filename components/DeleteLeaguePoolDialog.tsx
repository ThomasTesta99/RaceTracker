"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { deleteLeaguePool } from "@/lib/league-actions/league";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type DeleteLeaguePoolButtonProps = {
  leaguePoolId: string;
};

const DeleteLeaguePoolButton = ({ leaguePoolId }: DeleteLeaguePoolButtonProps) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      setMessage("");

      const result = await deleteLeaguePool(leaguePoolId);

      if (!result.success) {
        setMessage(result.message ?? "Failed to delete league pool.");
        return;
      }

      setOpen(false);

      router.replace("/league-pools");
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete league pool.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!loading) {
          setOpen(nextOpen);
          if (!nextOpen) setMessage("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer border-red-400/30 bg-red-500/10 text-red-200 hover:bg-red-500/20 hover:text-red-100"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Pool
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md border border-white/10 bg-zinc-950 text-white shadow-2xl [&>button]:text-white/70 [&>button]:hover:cursor-pointer">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Delete League Pool
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-white/70">
            Are you sure you want to delete this league pool? This will also
            delete all entries inside it.
          </p>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => setOpen(false)}
              className="flex-1 cursor-pointer border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </Button>

            <Button
              type="button"
              disabled={loading}
              onClick={handleDelete}
              className="flex-1 cursor-pointer bg-red-500 font-semibold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </div>

          {message && <p className="text-sm text-red-300">{message}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteLeaguePoolButton;