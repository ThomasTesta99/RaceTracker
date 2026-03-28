"use server"

import { db } from "@/database/drizzle";
import { sources } from "@/database/schema";
import { NewSource, Source } from "@/types"
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";

export const createSource = async (sourceName: string) => {
    try {
        const newSource: NewSource = {
            id: randomUUID(), 
            name: sourceName, 
        }
        
        await db
            .insert(sources)
            .values(newSource);
        
        return {
            success: true, 
            message: "Source added", 
        }
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "There was an error creating the source: ", error,
        }
    }
}

export const getSources = async () => {
    try {
        const sourcesList: Source[] = await db
            .select()
            .from(sources);

        return {
            success: true, 
            sourcesList: sourcesList, 
        }
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "There was an error getting the sources: ", error,
        }
    }
}

export const deleteSource = async (id: string) => {
    try {
        await db.delete(sources).where(eq(sources.id, id));

        return {
            success: true, 
        }
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "There was an error deleting the source: ", error,
        }
    }
}