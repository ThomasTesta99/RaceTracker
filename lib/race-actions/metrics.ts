"use server";

import { db } from "@/database/drizzle";
import { racePicks, races, sources } from "@/database/schema";
import { AnyColumn, eq, sql } from "drizzle-orm";

const isNotEmpty = (column: AnyColumn) => sql`
  nullif(trim(${column}), '') is not null
`;

const sameTrimmedValue = (left: AnyColumn, right: AnyColumn) => sql`
  trim(${left}) = trim(${right})
`;

const winnerExists = sql`
  (
    nullif(trim(${races.win1}), '') is not null
    or nullif(trim(${races.win2}), '') is not null
    or nullif(trim(${races.win3}), '') is not null
    or nullif(trim(${races.win4}), '') is not null
  )
`;

const pickIsInTheMoney = (pickColumn: AnyColumn) => sql`
  (
    trim(${pickColumn}) = trim(${races.win1})
    or trim(${pickColumn}) = trim(${races.win2})
    or trim(${pickColumn}) = trim(${races.win3})
    or trim(${pickColumn}) = trim(${races.win4})
  )
`;

const countFirstPickTotal = sql<number>`
  count(
    case
      when ${isNotEmpty(racePicks.value1)}
      and ${isNotEmpty(races.win1)}
      then 1
    end
  )
`;

const countCorrectFirstPicks = sql<number>`
  count(
    case
      when ${sameTrimmedValue(racePicks.value1, races.win1)}
      and ${isNotEmpty(racePicks.value1)}
      and ${isNotEmpty(races.win1)}
      then 1
    end
  )
`;

const countSourceItmHits = (pickColumn: AnyColumn) => sql<number>`
  count(
    case
      when ${isNotEmpty(pickColumn)}
      and ${pickIsInTheMoney(pickColumn)}
      then 1
    end
  )
`;

const countSourceItmTotal = (pickColumn: AnyColumn) => sql<number>`
  count(
    case
      when ${isNotEmpty(pickColumn)}
      and ${winnerExists}
      then 1
    end
  )
`;

const countUserItmHits = (pickColumn: AnyColumn) => sql<number>`
  count(
    case
      when ${isNotEmpty(pickColumn)}
      and ${pickIsInTheMoney(pickColumn)}
      then 1
    end
  )
`;

const countUserItmTotal = (pickColumn: AnyColumn) => sql<number>`
  count(
    case
      when ${isNotEmpty(pickColumn)}
      and ${winnerExists}
      then 1
    end
  )
`;

const sourceItmHits = sql<number>`
  (
    ${countSourceItmHits(racePicks.value1)}
    + ${countSourceItmHits(racePicks.value2)}
    + ${countSourceItmHits(racePicks.value3)}
    + ${countSourceItmHits(racePicks.value4)}
  )
`;

const sourceItmTotalNumbers = sql<number>`
  (
    ${countSourceItmTotal(racePicks.value1)}
    + ${countSourceItmTotal(racePicks.value2)}
    + ${countSourceItmTotal(racePicks.value3)}
    + ${countSourceItmTotal(racePicks.value4)}
  )
`;

const userItmHits = sql<number>`
  (
    ${countUserItmHits(races.userPick1)}
    + ${countUserItmHits(races.userPick2)}
    + ${countUserItmHits(races.userPick3)}
    + ${countUserItmHits(races.userPick4)}
  )
`;

const userItmTotalNumbers = sql<number>`
  (
    ${countUserItmTotal(races.userPick1)}
    + ${countUserItmTotal(races.userPick2)}
    + ${countUserItmTotal(races.userPick3)}
    + ${countUserItmTotal(races.userPick4)}
  )
`;

export const getMetrics = async () => {
  try {
    const sourceStats = await db
      .select({
        sourceId: sources.id,
        sourceName: sources.name,

        totalPicks: countFirstPickTotal,

        correctFirstPicks: countCorrectFirstPicks,

        accuracyPercent: sql<number>`
          case
            when ${countFirstPickTotal} = 0 then 0
            else round(
              (
                ${countCorrectFirstPicks}::numeric
                / ${countFirstPickTotal}::numeric
              ) * 100,
              2
            )
          end
        `,

        itmHits: sourceItmHits,

        itmTotalNumbers: sourceItmTotalNumbers,

        itmPercent: sql<number>`
          case
            when ${sourceItmTotalNumbers} = 0 then 0
            else round(
              (
                ${sourceItmHits}::numeric
                / ${sourceItmTotalNumbers}::numeric
              ) * 100,
              2
            )
          end
        `,
      })
      .from(racePicks)
      .innerJoin(races, eq(racePicks.raceId, races.id))
      .innerJoin(sources, eq(racePicks.sourceId, sources.id))
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

        userItmHits,

        userItmTotalNumbers,

        userItmPercent: sql<number>`
          case
            when ${userItmTotalNumbers} = 0 then 0
            else round(
              (
                ${userItmHits}::numeric
                / ${userItmTotalNumbers}::numeric
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