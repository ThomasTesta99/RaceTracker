import { RaceRow } from "@/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getPickHighlightClass = (
  userPicks: { value1: string; value2: string; value3: string },
  sourceValue: string,
  sourceIndex: 0 | 1 | 2
) => {
  const normalizedUser = [
    userPicks.value1.trim(),
    userPicks.value2.trim(),
    userPicks.value3.trim(),
  ];

  const normalizedSourceValue = sourceValue.trim();

  if (!normalizedSourceValue) {
    return "border-white/10 bg-black/30";
  }

  // Green only if this is the source's 1st pick
  // and it matches the actual 1st winner
  if (sourceIndex === 0 && normalizedSourceValue === normalizedUser[0]) {
    return "border-green-400/40 bg-green-500/30";
  }

  // Yellow if it appears anywhere in the winners
  if (normalizedUser.includes(normalizedSourceValue)) {
    return "border-yellow-300/40 bg-yellow-400/30";
  }

  return "border-white/10 bg-black/30";
};

export const getUserPickHighlightClass = (
  row: RaceRow,
  userValue: string,
  userIndex: 0 | 1 | 2
) => {
  const normalizedUserValue = userValue.trim();

  if (!normalizedUserValue) {
    return "border-white/10 bg-black/30";
  }

  const allSourcePicks = Object.values(row.sourcePicks);

  // Green only for the actual 1st winner box,
  // and only if some source had that horse in their 1st pick
  if (userIndex === 0) {
    const hasWinningTopPick = allSourcePicks.some((sourcePick) => {
      return sourcePick.value1.trim() === normalizedUserValue;
    });

    if (hasWinningTopPick) {
      return "border-green-400/40 bg-green-500/30";
    }
  }

  // Yellow if any source has this horse anywhere
  const hasAnyMatch = allSourcePicks.some((sourcePick) => {
    const sourceValues = [
      sourcePick.value1.trim(),
      sourcePick.value2.trim(),
      sourcePick.value3.trim(),
    ];

    return sourceValues.includes(normalizedUserValue);
  });

  if (hasAnyMatch) {
    return "border-yellow-300/40 bg-yellow-400/30";
  }

  return "border-white/10 bg-black/30";
};