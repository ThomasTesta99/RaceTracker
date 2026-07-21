import { RaceRow } from "@/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getPickHighlightClass = (
  winners: { value1: string; value2: string; value3: string; value4: string },
  sourceValue: string,
  sourceIndex: 0 | 1 | 2 | 3
) => {
  const normalizedWinners = [
    winners.value1.trim(),
    winners.value2.trim(),
    winners.value3.trim(),
    winners.value4.trim(), 
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
  userIndex: 0 | 1 | 2 | 3
) => {
  const winners = [
    row.winners.value1.trim(),
    row.winners.value2.trim(),
    row.winners.value3.trim(),
    row.winners.value4.trim(),
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
  winnerIndex: 0 | 1 | 2 | 3
) => {
  const normalizedWinnerValue = winnerValue.trim();

  if (!normalizedWinnerValue) {
    return "border-white/10 bg-black/30";
  }

  const userPicks = [
    row.userPicks.value1.trim(),
    row.userPicks.value2.trim(),
    row.userPicks.value3.trim(),
    row.userPicks.value4.trim(),
  ];

  const sourcePickGroups = Object.values(row.sourcePicks).map((sourcePick) => [
    sourcePick.value1.trim(),
    sourcePick.value2.trim(),
    sourcePick.value3.trim(),
    sourcePick.value4.trim(),
  ]);


  const correctPositionMatch =
    userPicks[winnerIndex] === normalizedWinnerValue ||
    sourcePickGroups.some(
      (sourcePicks) =>
        sourcePicks[winnerIndex] === normalizedWinnerValue
    );

  if (correctPositionMatch) {
    return "border-green-400/40 bg-green-500/30";
  }


  const pickedAnywhere =
    userPicks.includes(normalizedWinnerValue) ||
    sourcePickGroups.some((sourcePicks) =>
      sourcePicks.includes(normalizedWinnerValue)
    );

  if (pickedAnywhere) {
    return "border-yellow-300/40 bg-yellow-400/30";
  }

  return "border-white/10 bg-black/30";
};

export const getDoublePickHighlightClass = (
  winners: { value1: string; value2: string;},
  doublePickValue: string,
  doublePickIndex: 0 | 1
) => {
  const normalizedWinners = [
    winners.value1.trim(),
    winners.value2.trim(),
  ];

  const normalizedValue = doublePickValue.trim();

  if (!normalizedValue) {
    return "border-white/10 bg-black/30";
  }

  if (normalizedWinners[doublePickIndex] === normalizedValue) {
    return "border-green-400/40 bg-green-500/30";
  }

  if (normalizedWinners.includes(normalizedValue)) {
    return "border-yellow-300/40 bg-yellow-400/30";
  }

  return "border-white/10 bg-black/30";
};