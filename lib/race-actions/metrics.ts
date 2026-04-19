"use server";

import { db } from "@/database/drizzle";
import { racePicks, races, sources } from "@/database/schema";
import { and, count, eq, isNotNull, sql } from "drizzle-orm";

export const getMetrics = async () => {
  try {
    const sourceStats = await db
      .select({
        sourceId: sources.id,
        sourceName: sources.name,

        totalPicks: count(racePicks.id),

        correctFirstPicks: sql<number>`
          count(
            case
              when ${racePicks.value1} = ${races.win1}
              and ${races.win1} is not null
              then 1
            end
          )
        `,

        accuracyPercent: sql<number>`
          case
            when count(${racePicks.id}) = 0 then 0
            else round(
              (
                count(
                  case
                    when ${racePicks.value1} = ${races.win1}
                    and ${races.win1} is not null
                    then 1
                  end
                )::numeric
                / count(${racePicks.id})::numeric
              ) * 100,
              2
            )
          end
        `,
      })
      .from(racePicks)
      .innerJoin(races, eq(racePicks.raceId, races.id))
      .innerJoin(sources, eq(racePicks.sourceId, sources.id))
      .where(
        and(
          isNotNull(racePicks.value1),
          isNotNull(races.win1)
        )
      )
      .groupBy(sources.id, sources.name);

    return {
      success: true,
      data: sourceStats,
    };
  } catch (error) {
    console.error("Error fetching race data:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to load race day sources.",
    };
  }
};