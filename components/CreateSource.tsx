"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Plus } from "lucide-react";

type CreateSourceProps = {
  onSourceCreated?: () => void;
};

const CreateSource = ({ onSourceCreated }: CreateSourceProps) => {
  const [open, setOpen] = useState(false);
  const [sourceName, setSourceName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleCreateSource = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    if (!sourceName.trim()) {
      setMessage("Source name is required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/sources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceName: sourceName.trim(),
        }),
      });

      const result = await res.json();

      if (result.success) {
        setMessage("");
        setSourceName("");
        setOpen(false);

        if (onSourceCreated) {
          onSourceCreated();
        }
      } else {
        setMessage(result.message || "Failed to create source");
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to create source");
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
        <Button
          variant="outline"
          size="lg"
          className="w-full cursor-pointer text-black"
        >
          <Plus />
          Create Source
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md [&>button]:cursor-pointer">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create Source</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleCreateSource} className="space-y-4">
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
            {loading ? "Creating..." : "Create Source"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSource;