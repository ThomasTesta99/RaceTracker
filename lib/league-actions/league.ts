"use server";
import { db } from "@/database/drizzle";
import { leaguePool, leaguePoolEntries } from "@/database/schema";
import { NewLeaguePool, NewLeaguePoolEntry, UpdateLeaguePoolEntryInput } from "@/types";
import { asc, eq } from "drizzle-orm";

export const createLeaguePool = async (date: string) => {
    try {
        const newLeaguePool: NewLeaguePool = {
            id: crypto.randomUUID(),
            date,
        };

        const [result] = await db.insert(leaguePool).values(newLeaguePool).returning();

        return {
            success: true,
            leaguePool: result,
        }
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "There was an error creating the league pool.",
        };
    }
}

export const getLeaguePools = async () => {
  try {
    const pools = await db
      .select()
      .from(leaguePool)
      .orderBy(asc(leaguePool.date));

    return {
      success: true,
      leaguePools: pools,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "There was an error getting the league pools.",
      leaguePools: [],
    };
  }
};

export const getLeaguePoolById = async (id: string) => {
  try {
    const [pool] = await db
      .select()
      .from(leaguePool)
      .where(eq(leaguePool.id, id));

    if (!pool) {
      return {
        success: false,
        message: "League pool not found.",
        leaguePool: null,
      };
    }

    return {
      success: true,
      leaguePool: pool,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "There was an error getting the league pool.",
      leaguePool: null,
    };
  }
};

export const deleteLeaguePool = async (id: string) => {
    try {
        await db.delete(leaguePool).where(eq(leaguePool.id, id));
        return {
            success: true,
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "There was an error deleting the league pool.",
        };
    }
}

export const createLeaguePoolEntry = async (leaguePoolId: string, team: string, name: string) => {
    try {
        const newLeaguePoolEntry: NewLeaguePoolEntry = {
            id: crypto.randomUUID(),
            leaguePoolId,
            team,
            name,
        };

        const [result] = await db.insert(leaguePoolEntries).values(newLeaguePoolEntry).returning();

        return {
            success: true,
            leaguePoolEntry: result,
        }
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "There was an error creating the league pool entry.",
        };
    }
}

export const getLeaguePoolEntries = async (leaguePoolId: string) => {
  try {
    const entries = await db
      .select()
      .from(leaguePoolEntries)
      .where(eq(leaguePoolEntries.leaguePoolId, leaguePoolId))
      .orderBy(asc(leaguePoolEntries.team), asc(leaguePoolEntries.name));

    return {
      success: true,
      entries,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "There was an error getting the league pool entries.",
      entries: [],
    };
  }
};

export const editLeaguePoolEntry = async (
  id: string,
  values: UpdateLeaguePoolEntryInput
) => {
  try {
    const [result] = await db
      .update(leaguePoolEntries)
      .set(values)
      .where(eq(leaguePoolEntries.id, id))
      .returning();

    if (!result) {
      return {
        success: false,
        message: "League pool entry not found.",
      };
    }

    return {
      success: true,
      leaguePoolEntry: result,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "There was an error editing the league pool entry.",
    };
  }
};

export const deleteLeaguePoolEntry = async (id: string) => {
  try {
    const [result] = await db
      .delete(leaguePoolEntries)
      .where(eq(leaguePoolEntries.id, id))
      .returning();

    if (!result) {
      return {
        success: false,
        message: "League pool entry not found.",
      };
    }

    return {
      success: true,
      leaguePoolEntry: result,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "There was an error deleting the league pool entry.",
    };
  }
};