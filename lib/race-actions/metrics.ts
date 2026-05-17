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

        totalPicks: sql<number>`
          count(
            case
              when nullif(trim(${racePicks.value1}), '') is not null
              and nullif(trim(${races.win1}), '') is not null
              then 1
            end
          )
        `,

        correctFirstPicks: sql<number>`
          count(
            case
              when trim(${racePicks.value1}) = trim(${races.win1})
              and nullif(trim(${racePicks.value1}), '') is not null
              and nullif(trim(${races.win1}), '') is not null
              then 1
            end
          )
        `,

        accuracyPercent: sql<number>`
          case
            when count(
              case
                when nullif(trim(${racePicks.value1}), '') is not null
                and nullif(trim(${races.win1}), '') is not null
                then 1
              end
            ) = 0 then 0
            else round(
              (
                count(
                  case
                    when trim(${racePicks.value1}) = trim(${races.win1})
                    and nullif(trim(${racePicks.value1}), '') is not null
                    and nullif(trim(${races.win1}), '') is not null
                    then 1
                  end
                )::numeric
                /
                count(
                  case
                    when nullif(trim(${racePicks.value1}), '') is not null
                    and nullif(trim(${races.win1}), '') is not null
                    then 1
                  end
                )::numeric
              ) * 100,
              2
            )
          end
        `,

        itmHits: sql<number>`
          (
            count(
              case
                when nullif(trim(${racePicks.value1}), '') is not null
                and (
                  trim(${racePicks.value1}) = trim(${races.win1})
                  or trim(${racePicks.value1}) = trim(${races.win2})
                  or trim(${racePicks.value1}) = trim(${races.win3})
                )
                then 1
              end
            )
            +
            count(
              case
                when nullif(trim(${racePicks.value2}), '') is not null
                and (
                  trim(${racePicks.value2}) = trim(${races.win1})
                  or trim(${racePicks.value2}) = trim(${races.win2})
                  or trim(${racePicks.value2}) = trim(${races.win3})
                )
                then 1
              end
            )
            +
            count(
              case
                when nullif(trim(${racePicks.value3}), '') is not null
                and (
                  trim(${racePicks.value3}) = trim(${races.win1})
                  or trim(${racePicks.value3}) = trim(${races.win2})
                  or trim(${racePicks.value3}) = trim(${races.win3})
                )
                then 1
              end
            )
          )
        `,

        itmTotalNumbers: sql<number>`
          (
            count(
              case
                when nullif(trim(${racePicks.value1}), '') is not null
                and (
                  nullif(trim(${races.win1}), '') is not null
                  or nullif(trim(${races.win2}), '') is not null
                  or nullif(trim(${races.win3}), '') is not null
                )
                then 1
              end
            )
            +
            count(
              case
                when nullif(trim(${racePicks.value2}), '') is not null
                and (
                  nullif(trim(${races.win1}), '') is not null
                  or nullif(trim(${races.win2}), '') is not null
                  or nullif(trim(${races.win3}), '') is not null
                )
                then 1
              end
            )
            +
            count(
              case
                when nullif(trim(${racePicks.value3}), '') is not null
                and (
                  nullif(trim(${races.win1}), '') is not null
                  or nullif(trim(${races.win2}), '') is not null
                  or nullif(trim(${races.win3}), '') is not null
                )
                then 1
              end
            )
          )
        `,

        itmPercent: sql<number>`
          case
            when (
              count(
                case
                  when nullif(trim(${racePicks.value1}), '') is not null
                  and (
                    nullif(trim(${races.win1}), '') is not null
                    or nullif(trim(${races.win2}), '') is not null
                    or nullif(trim(${races.win3}), '') is not null
                  )
                  then 1
                end
              )
              +
              count(
                case
                  when nullif(trim(${racePicks.value2}), '') is not null
                  and (
                    nullif(trim(${races.win1}), '') is not null
                    or nullif(trim(${races.win2}), '') is not null
                    or nullif(trim(${races.win3}), '') is not null
                  )
                  then 1
                end
              )
              +
              count(
                case
                  when nullif(trim(${racePicks.value3}), '') is not null
                  and (
                    nullif(trim(${races.win1}), '') is not null
                    or nullif(trim(${races.win2}), '') is not null
                    or nullif(trim(${races.win3}), '') is not null
                  )
                  then 1
                end
              )
            ) = 0 then 0
            else round(
              (
                (
                  count(
                    case
                      when nullif(trim(${racePicks.value1}), '') is not null
                      and (
                        trim(${racePicks.value1}) = trim(${races.win1})
                        or trim(${racePicks.value1}) = trim(${races.win2})
                        or trim(${racePicks.value1}) = trim(${races.win3})
                      )
                      then 1
                    end
                  )
                  +
                  count(
                    case
                      when nullif(trim(${racePicks.value2}), '') is not null
                      and (
                        trim(${racePicks.value2}) = trim(${races.win1})
                        or trim(${racePicks.value2}) = trim(${races.win2})
                        or trim(${racePicks.value2}) = trim(${races.win3})
                      )
                      then 1
                    end
                  )
                  +
                  count(
                    case
                      when nullif(trim(${racePicks.value3}), '') is not null
                      and (
                        trim(${racePicks.value3}) = trim(${races.win1})
                        or trim(${racePicks.value3}) = trim(${races.win2})
                        or trim(${racePicks.value3}) = trim(${races.win3})
                      )
                      then 1
                    end
                  )
                )::numeric
                /
                (
                  count(
                    case
                      when nullif(trim(${racePicks.value1}), '') is not null
                      and (
                        nullif(trim(${races.win1}), '') is not null
                        or nullif(trim(${races.win2}), '') is not null
                        or nullif(trim(${races.win3}), '') is not null
                      )
                      then 1
                    end
                  )
                  +
                  count(
                    case
                      when nullif(trim(${racePicks.value2}), '') is not null
                      and (
                        nullif(trim(${races.win1}), '') is not null
                        or nullif(trim(${races.win2}), '') is not null
                        or nullif(trim(${races.win3}), '') is not null
                      )
                      then 1
                    end
                  )
                  +
                  count(
                    case
                      when nullif(trim(${racePicks.value3}), '') is not null
                      and (
                        nullif(trim(${races.win1}), '') is not null
                        or nullif(trim(${races.win2}), '') is not null
                        or nullif(trim(${races.win3}), '') is not null
                      )
                      then 1
                    end
                  )
                )::numeric
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

        userItmHits: sql<number>`
          (
            count(
              case
                when nullif(trim(${races.userPick1}), '') is not null
                and (
                  trim(${races.userPick1}) = trim(${races.win1})
                  or trim(${races.userPick1}) = trim(${races.win2})
                  or trim(${races.userPick1}) = trim(${races.win3})
                )
                then 1
              end
            )
            +
            count(
              case
                when nullif(trim(${races.userPick2}), '') is not null
                and (
                  trim(${races.userPick2}) = trim(${races.win1})
                  or trim(${races.userPick2}) = trim(${races.win2})
                  or trim(${races.userPick2}) = trim(${races.win3})
                )
                then 1
              end
            )
            +
            count(
              case
                when nullif(trim(${races.userPick3}), '') is not null
                and (
                  trim(${races.userPick3}) = trim(${races.win1})
                  or trim(${races.userPick3}) = trim(${races.win2})
                  or trim(${races.userPick3}) = trim(${races.win3})
                )
                then 1
              end
            )
          )
        `,

        userItmTotalNumbers: sql<number>`
          (
            count(
              case
                when nullif(trim(${races.userPick1}), '') is not null
                and (
                  nullif(trim(${races.win1}), '') is not null
                  or nullif(trim(${races.win2}), '') is not null
                  or nullif(trim(${races.win3}), '') is not null
                )
                then 1
              end
            )
            +
            count(
              case
                when nullif(trim(${races.userPick2}), '') is not null
                and (
                  nullif(trim(${races.win1}), '') is not null
                  or nullif(trim(${races.win2}), '') is not null
                  or nullif(trim(${races.win3}), '') is not null
                )
                then 1
              end
            )
            +
            count(
              case
                when nullif(trim(${races.userPick3}), '') is not null
                and (
                  nullif(trim(${races.win1}), '') is not null
                  or nullif(trim(${races.win2}), '') is not null
                  or nullif(trim(${races.win3}), '') is not null
                )
                then 1
              end
            )
          )
        `,

        userItmPercent: sql<number>`
          case
            when (
              count(
                case
                  when nullif(trim(${races.userPick1}), '') is not null
                  and (
                    nullif(trim(${races.win1}), '') is not null
                    or nullif(trim(${races.win2}), '') is not null
                    or nullif(trim(${races.win3}), '') is not null
                  )
                  then 1
                end
              )
              +
              count(
                case
                  when nullif(trim(${races.userPick2}), '') is not null
                  and (
                    nullif(trim(${races.win1}), '') is not null
                    or nullif(trim(${races.win2}), '') is not null
                    or nullif(trim(${races.win3}), '') is not null
                  )
                  then 1
                end
              )
              +
              count(
                case
                  when nullif(trim(${races.userPick3}), '') is not null
                  and (
                    nullif(trim(${races.win1}), '') is not null
                    or nullif(trim(${races.win2}), '') is not null
                    or nullif(trim(${races.win3}), '') is not null
                  )
                  then 1
                end
              )
            ) = 0 then 0
            else round(
              (
                (
                  count(
                    case
                      when nullif(trim(${races.userPick1}), '') is not null
                      and (
                        trim(${races.userPick1}) = trim(${races.win1})
                        or trim(${races.userPick1}) = trim(${races.win2})
                        or trim(${races.userPick1}) = trim(${races.win3})
                      )
                      then 1
                    end
                  )
                  +
                  count(
                    case
                      when nullif(trim(${races.userPick2}), '') is not null
                      and (
                        trim(${races.userPick2}) = trim(${races.win1})
                        or trim(${races.userPick2}) = trim(${races.win2})
                        or trim(${races.userPick2}) = trim(${races.win3})
                      )
                      then 1
                    end
                  )
                  +
                  count(
                    case
                      when nullif(trim(${races.userPick3}), '') is not null
                      and (
                        trim(${races.userPick3}) = trim(${races.win1})
                        or trim(${races.userPick3}) = trim(${races.win2})
                        or trim(${races.userPick3}) = trim(${races.win3})
                      )
                      then 1
                    end
                  )
                )::numeric
                /
                (
                  count(
                    case
                      when nullif(trim(${races.userPick1}), '') is not null
                      and (
                        nullif(trim(${races.win1}), '') is not null
                        or nullif(trim(${races.win2}), '') is not null
                        or nullif(trim(${races.win3}), '') is not null
                      )
                      then 1
                    end
                  )
                  +
                  count(
                    case
                      when nullif(trim(${races.userPick2}), '') is not null
                      and (
                        nullif(trim(${races.win1}), '') is not null
                        or nullif(trim(${races.win2}), '') is not null
                        or nullif(trim(${races.win3}), '') is not null
                      )
                      then 1
                    end
                  )
                  +
                  count(
                    case
                      when nullif(trim(${races.userPick3}), '') is not null
                      and (
                        nullif(trim(${races.win1}), '') is not null
                        or nullif(trim(${races.win2}), '') is not null
                        or nullif(trim(${races.win3}), '') is not null
                      )
                      then 1
                    end
                  )
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