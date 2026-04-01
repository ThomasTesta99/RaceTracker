"use server";

import { db } from "@/database/drizzle";
import { raceDays } from "@/database/schema";
import { NewRaceDay } from "@/types";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";

export const createRaceDay = async ({ date, track }: { date: string; track: string }) => {
  try {
    const newRaceDay: NewRaceDay = {
      id: randomUUID(),
      date,
      track,
    };

    await db.insert(raceDays).values(newRaceDay);

    return {
      success: true,
      message: "Race day added",
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