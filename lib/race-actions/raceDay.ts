"use server"

import { db } from "@/database/drizzle";
import { raceDays } from "@/database/schema";
import { NewRaceDay } from "@/types";
import { randomUUID } from "crypto";

export const createRaceDay = async ({date, track} : {date: string, track: string}) => {
    try {
        const newRaceDay: NewRaceDay = {
            id: randomUUID(), 
            date: date, 
            track: track, 
        }

        await db
            .insert(raceDays)
            .values(newRaceDay);

        return {
            success: true, 
            message: "Race day added"
        }
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "There was an error creating the raceday: ", error,
        }
    }
}