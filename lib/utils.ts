import { RaceRow } from "@/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getPickHighlightClass = (
  winners: { value1: string; value2: string; value3: string },
  sourceValue: string,
  sourceIndex: 0 | 1 | 2
) => {
  const normalizedWinners = [
    winners.value1.trim(),
    winners.value2.trim(),
    winners.value3.trim(),
  ];

  const normalizedSourceValue = sourceValue.trim();

  if (!normalizedSourceValue) {
    return "border-white/10 bg-black/30";
  }

  if (normalizedWinners[sourceIndex] === normalizedSourceValue) {
    return "border-green-400/40 bg-green-500/30";
  }

  if (normalizedWinners.includes(normalizedSourceValue)) {
    return "border-yellow-300/40 bg-yellow-400/30";
  }

  return "border-white/10 bg-black/30";
};

export const getUserPickHighlightClass = (
  row: RaceRow,
  userValue: string,
  userIndex: 0 | 1 | 2
) => {
  const winners = [
    row.winners.value1.trim(),
    row.winners.value2.trim(),
    row.winners.value3.trim(),
  ];

  const normalizedUserValue = userValue.trim();

  if (!normalizedUserValue) {
    return "border-white/10 bg-black/30";
  }

  if (winners[userIndex] === normalizedUserValue) {
    return "border-green-400/40 bg-green-500/30";
  }

  if (winners.includes(normalizedUserValue)) {
    return "border-yellow-300/40 bg-yellow-400/30";
  }

  return "border-white/10 bg-black/30";
};

export const getWinnerHighlightClass = (
  row: RaceRow,
  winnerValue: string,
  winnerIndex: 0 | 1 | 2
) => {
  const normalizedWinnerValue = winnerValue.trim();

  if (!normalizedWinnerValue) {
    return "border-white/10 bg-black/30";
  }

  const userPicks = [
    row.userPicks.value1.trim(),
    row.userPicks.value2.trim(),
    row.userPicks.value3.trim(),
  ];

  const sourcePicks = Object.values(row.sourcePicks).flatMap((sourcePick) => [
    sourcePick.value1.trim(),
    sourcePick.value2.trim(),
    sourcePick.value3.trim(),
  ]);

  const allPicks = [...userPicks, ...sourcePicks];

  if (allPicks[winnerIndex] === normalizedWinnerValue) {
    return "border-green-400/40 bg-green-500/30";
  }

  if (allPicks.includes(normalizedWinnerValue)) {
    return "border-yellow-300/40 bg-yellow-400/30";
  }

  return "border-white/10 bg-black/30";
};