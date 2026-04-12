"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "./ui/dialog";

type DeleteSourceButtonProps = {
  sourceId: string;
  sourceName: string;
  onDeleted?: () => void;
};

const DeleteSourceButton = ({
  sourceId,
  sourceName,
  onDeleted,
}: DeleteSourceButtonProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleDelete = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await fetch(`/api/sources/${sourceId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();

      if (!result.success) {
        setMessage(result.message || "Failed to delete source.");
        return;
      }

      setOpen(false);
      onDeleted?.();
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete source.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!loading) {
          setOpen(next);
          if (!next) setMessage("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className="cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md [&>button]:cursor-pointer">
        <DialogHeader>
          <DialogTitle>Delete source</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <span className="font-semibold">{sourceName}</span>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {message && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {message}
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="cursor-pointer"
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteSourceButton;