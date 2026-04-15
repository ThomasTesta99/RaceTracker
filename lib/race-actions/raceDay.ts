"use server";

import { db } from "@/database/drizzle";
import { raceDays, raceDaySources, sources } from "@/database/schema";
import { NewRaceDay } from "@/types";
import { randomUUID } from "crypto";
import { and, asc, eq, inArray } from "drizzle-orm";

export const createRaceDay = async ({
  date,
  track,
  sourceIds,
}: {
  date: string;
  track: string;
  sourceIds: string[];
}) => {
  try {
    const newRaceDayId = randomUUID();
    const newRaceDay: NewRaceDay = {
      id: newRaceDayId,
      date,
      track,
    };

    const [race] = await db.insert(raceDays).values(newRaceDay).returning();
    
    if (sourceIds.length > 0) {
      await db.insert(raceDaySources).values(
        sourceIds.map((sourceId) => ({
          raceDayId: newRaceDayId,
          sourceId,
        }))
      );
    }

    return {
      success: true,
      message: "Race day added",
      raceDay: race, 
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "There was an error creating the race day.",
    };
  }
};

export const getRaceDays = async () => {
  try {
    const raceList = await db.select().from(raceDays).orderBy(raceDays.date);

    if (raceList.length === 0) {
      return {
        success: false,
        message: "No race days created",
        raceList: [],
      };
    }

    return {
      success: true,
      raceList,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "There was an error getting the race days.",
      raceList: [],
    };
  }
};

export const getRaceDay = async ({ id }: { id: string }) => {
  try {
    const [raceDay] = await db
      .select()
      .from(raceDays)
      .where(eq(raceDays.id, id))
      .limit(1);

    if (!raceDay) {
      return {
        success: false,
        message: "Unable to get race",
      };
    }

    return {
      success: true,
      raceDay,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "There was an error getting the race day.",
    };
  }
};

export const deleteRaceDay = async ({ id }: { id: string }) => {
  try {
    await db.delete(raceDays).where(eq(raceDays.id, id)).returning();

    return {
      success: true, 
    }
  }catch (error) {
    console.error(error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "There was an error deleting the race.", 
    };
  }
};

export const updateRaceDaySources = async ({
  raceDayId,
  sourceIds,
}: {
  raceDayId: string;
  sourceIds: string[];
}) => {
  try {
    if (sourceIds.length === 0) {
      return {
        success: false,
        message: "Please select at least one source.",
      };
    }

    const currentLinks = await db
      .select({
        sourceId: raceDaySources.sourceId,
      })
      .from(raceDaySources)
      .where(eq(raceDaySources.raceDayId, raceDayId));

    const currentSourceIds = currentLinks.map((link) => link.sourceId);

    const toAdd = sourceIds.filter((id) => !currentSourceIds.includes(id));
    const toRemove = currentSourceIds.filter((id) => !sourceIds.includes(id));

    if (toAdd.length > 0) {
      await db.insert(raceDaySources).values(
        toAdd.map((sourceId) => ({
          raceDayId,
          sourceId,
        }))
      );
    }

    if (toRemove.length > 0) {
      await db
        .delete(raceDaySources)
        .where(
          and(
            eq(raceDaySources.raceDayId, raceDayId),
            inArray(raceDaySources.sourceId, toRemove)
          )
        );
    }

    return {
      success: true,
      message: "Sources updated successfully.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update sources.",
    };
  }
};

export const getRaceDaySourceOptions = async (raceDayId: string) => {
  try {
    const allSources = await db
      .select()
      .from(sources)
      .orderBy(asc(sources.name));

    const selectedLinks = await db
      .select({
        sourceId: raceDaySources.sourceId,
      })
      .from(raceDaySources)
      .where(eq(raceDaySources.raceDayId, raceDayId));

    const selectedSourceIds = selectedLinks.map((link) => link.sourceId);

    return {
      success: true,
      allSources,
      selectedSourceIds,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to load race day sources.",
    };
  }
};