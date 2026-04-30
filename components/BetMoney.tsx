"use client";

import React, { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { updateBetMoney } from "@/lib/race-actions/raceDay";

const BetMoney = ({
  raceDayId,
  money,
}: {
  raceDayId: string;
  money: number | null;
}) => {
  const [open, setOpen] = useState(false);
  const [currentMoney, setCurrentMoney] = useState<number | null>(money);
  const [amount, setAmount] = useState(money?.toString() ?? "0");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    setMessage("");

    const parsedAmount = Number(amount);

    startTransition(async () => {
      const result = await updateBetMoney({
        raceDayId,
        betMoney: parsedAmount,
      });

      if (result.success) {
        const updatedAmount = result?.raceDay?.betMoney ?? 0;

        setCurrentMoney(updatedAmount);
        setAmount(updatedAmount.toString());
        setMessage(result.message);
        setOpen(false);
      } else {
        setMessage(result.message);
      }
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        setMessage("");

        if (next) {
          setAmount(currentMoney?.toString() ?? "0");
        }
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          className="cursor-pointer text-2xl font-bold text-white transition hover:text-white/70"
        >
          {currentMoney === null ? "No Bet" : `$${currentMoney}`}
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md border border-white/10 bg-zinc-950 text-white [&>button]:cursor-pointer">
        <DialogHeader>
          <DialogTitle>Bet Money</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-white/70">
              Amount
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-white outline-none focus:border-white/30"
              placeholder="Enter bet amount"
            />
          </div>

          {message ? <p className="text-sm text-white/60">{message}</p> : null}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="cursor-pointer rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/5"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="cursor-pointer rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BetMoney;