"use server";

import { asc, eq, inArray } from "drizzle-orm";
import { randomUUID } from "crypto";
import { RaceRow, Source } from "@/types";
import { db } from "@/database/drizzle";
import { racePicks, races, sources } from "@/database/schema";

const TOTAL_RACES = 15;

const createEmptyRows = (sourcesList: Source[]): RaceRow[] => {
  return Array.from({ length: TOTAL_RACES }, (_, index) => {
    const sourcePicks: RaceRow["sourcePicks"] = {};

    for (const source of sourcesList) {
      sourcePicks[source.id] = {
        value1: "",
        value2: "",
        value3: "",
      };
    }

    return {
      raceNumber: index + 1,
      result: "",
      userPicks: {
        value1: "",
        value2: "",
        value3: "",
      },
      sourcePicks,
    };
  });
};

export const getRaceSheetData = async (raceDayId: string) => {
  try {
    const sourcesList = await db.select().from(sources).orderBy(asc(sources.name));

    const racesList = await db
      .select()
      .from(races)
      .where(eq(races.raceDayId, raceDayId))
      .orderBy(asc(races.raceNumber));

    const raceIds = racesList.map((race) => race.id);

    const racePicksList =
      raceIds.length > 0
        ? await db
            .select()
            .from(racePicks)
            .where(inArray(racePicks.raceId, raceIds))
        : [];

    const emptyRows = createEmptyRows(sourcesList);

    const rows: RaceRow[] = emptyRows.map((row) => {
      const existingRace = racesList.find(
        (race) => race.raceNumber === row.raceNumber
      );

      if (!existingRace) {
        return row;
      }

      const sourcePicks: RaceRow["sourcePicks"] = {};

      for (const source of sourcesList) {
        const existingSourcePick = racePicksList.find(
          (pick) =>
            pick.raceId === existingRace.id && pick.sourceId === source.id
        );

        sourcePicks[source.id] = {
          value1: existingSourcePick?.value1 ?? "",
          value2: existingSourcePick?.value2 ?? "",
          value3: existingSourcePick?.value3 ?? "",
        };
      }

      return {
        raceId: existingRace.id,
        raceNumber: existingRace.raceNumber ?? row.raceNumber,
        result:
            existingRace.result === "win" ||
            existingRace.result === "loss" ||
            existingRace.result === "scratch"
            ? existingRace.result
            : "",
        userPicks: {
            value1: existingRace.win1 ?? "",
            value2: existingRace.win2 ?? "",
            value3: existingRace.win3 ?? "",
        },
        sourcePicks,
        };
    });

    return {
      success: true,
      sourcesList,
      rows,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const saveRaceSheet = async ({
  raceDayId,
  rows,
}: {
  raceDayId: string;
  rows: RaceRow[];
}) => {
  try {
    for (const row of rows) {
      const [savedRace] = await db
        .insert(races)
        .values({
          id: row.raceId ?? randomUUID(),
          raceDayId,
          raceNumber: row.raceNumber,
          result: row.result || null,
          win1: row.userPicks.value1 || null,
          win2: row.userPicks.value2 || null,
          win3: row.userPicks.value3 || null,
        })
        .onConflictDoUpdate({
          target: [races.raceDayId, races.raceNumber],
          set: {
            result: row.result || null,
            win1: row.userPicks.value1 || null,
            win2: row.userPicks.value2 || null,
            win3: row.userPicks.value3 || null,
          },
        })
        .returning({
          id: races.id,
        });

      for (const [sourceId, picks] of Object.entries(row.sourcePicks)) {
        await db
          .insert(racePicks)
          .values({
            id: randomUUID(),
            raceId: savedRace.id,
            sourceId,
            value1: picks.value1 || null,
            value2: picks.value2 || null,
            value3: picks.value3 || null,
          })
          .onConflictDoUpdate({
            target: [racePicks.raceId, racePicks.sourceId],
            set: {
              value1: picks.value1 || null,
              value2: picks.value2 || null,
              value3: picks.value3 || null,
            },
          });
      }
    }

    return {
      success: true,
      message: "Race sheet saved successfully.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};