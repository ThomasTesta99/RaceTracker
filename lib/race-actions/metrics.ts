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
      .where(and(isNotNull(racePicks.value1), isNotNull(races.win1)))
      .groupBy(sources.id, sources.name);

    const [userStats] = await db
      .select({
        totalRaces: sql<number>`
          count(
            case
              when ${races.result} in ('win', 'loss')
              then 1
            end
          )
        `,

        wins: sql<number>`
          count(
            case
              when ${races.result} = 'win'
              then 1
            end
          )
        `,

        losses: sql<number>`
          count(
            case
              when ${races.result} = 'loss'
              then 1
            end
          )
        `,

        scratches: sql<number>`
          count(
            case
              when ${races.result} = 'scratch'
              then 1
            end
          )
        `,

        winPercent: sql<number>`
          case
            when count(
              case
                when ${races.result} in ('win', 'loss')
                then 1
              end
            ) = 0 then 0
            else round(
              (
                count(
                  case
                    when ${races.result} = 'win'
                    then 1
                  end
                )::numeric
                /
                count(
                  case
                    when ${races.result} in ('win', 'loss')
                    then 1
                  end
                )::numeric
              ) * 100,
              2
            )
          end
        `,
      })
      .from(races);

    return {
      success: true,
      data: {
        sourceStats,
        userStats,
      },
    };
  } catch (error) {
    console.error("Error fetching race metrics:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to load race metrics.",
    };
  }
};