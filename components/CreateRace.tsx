"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateRaceForm from "./CreateRaceForm";

const CreateRace = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="cursor-pointer border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Race
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl border border-white/10 bg-zinc-950/95 text-white shadow-2xl backdrop-blur-xl [&>button]:text-white/70 [&>button]:hover:cursor-pointer">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-white">
            Create Race
          </DialogTitle>
        </DialogHeader>

        <CreateRaceForm />
      </DialogContent>
    </Dialog>
  );
};

export default CreateRace;