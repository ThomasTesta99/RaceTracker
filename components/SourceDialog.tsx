"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Pencil, Plus } from "lucide-react";
import { Source } from "@/types";

type CreateSourceProps = {
  onSourceSaved?: () => void;
  source?: Source;
  trigger?: React.ReactNode;
};

const SourceDialog = ({ onSourceSaved, source, trigger }: CreateSourceProps) => {
  const isEditMode = !!source;

  const [open, setOpen] = useState(false);
  const [sourceName, setSourceName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (open) {
      setSourceName(source?.name ?? "");
      setMessage("");
    }
  }, [open, source]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    const trimmedName = sourceName.trim();

    if (!trimmedName) {
      setMessage("Source name is required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/sources", {
        method: isEditMode ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          isEditMode
            ? { id: source.id, sourceName: trimmedName }
            : { sourceName: trimmedName }
        ),
      });

      const result = await res.json();

      if (result.success) {
        setOpen(false);
        setSourceName("");
        setMessage("");

        onSourceSaved?.();
      } else {
        setMessage(
          result.message ||
            `Failed to ${isEditMode ? "update" : "create"} source`
        );
      }
    } catch (error) {
      console.error(error);
      setMessage(`Failed to ${isEditMode ? "update" : "create"} source`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);

        if (!next) {
          setMessage("");
          setSourceName("");
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            variant="outline"
            size="lg"
            className="w-full cursor-pointer text-black"
          >
            <Plus className="h-4 w-4" />
            Create Source
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-md [&>button]:cursor-pointer">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isEditMode ? "Edit Source" : "Create Source"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="sourceName" className="text-sm font-medium">
              Source Name
            </label>
            <Input
              id="sourceName"
              placeholder="Enter source name"
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
            />
          </div>

          {message && <p className="text-sm text-red-500">{message}</p>}

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={loading}
          >
            {loading
              ? isEditMode
                ? "Saving..."
                : "Creating..."
              : isEditMode
              ? "Save Changes"
              : "Create Source"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SourceDialog;