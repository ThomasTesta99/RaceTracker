import {
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  uniqueIndex,
  doublePrecision,
} from "drizzle-orm/pg-core";

export const betTypeEnum = pgEnum("bet_type", ["box", "exact"]);

export const raceDays = pgTable("race_days",{
    id: text("id").primaryKey(),
    date: date("date").notNull().defaultNow(),
    track: text("track").notNull(),
    betMoney: doublePrecision("bet_money").default(0),
},
  (table) => [
    index("race_days_date_idx").on(table.date),
    index("race_days_track_idx").on(table.track),
    uniqueIndex("race_days_date_track_unique").on(table.date, table.track),
  ]
);

export const races = pgTable("races", {
    id: text("id").primaryKey(),
    raceDayId: text("race_day_id")
      .notNull()
      .references(() => raceDays.id, { onDelete: "cascade" }),
    raceNumber: integer("race_number").notNull(),
    result: text("result"),
    betType: betTypeEnum("bet_type"),
    win1: text("win_1"),
    win2: text("win_2"),
    win3: text("win_3"),

    userPick1: text("user_pick_1"),
    userPick2: text("user_pick_2"),
    userPick3: text("user_pick_3"),
},
  (table) => [
    index("races_race_day_id_idx").on(table.raceDayId),
    index("races_race_number_idx").on(table.raceNumber),
    uniqueIndex("races_race_day_number_unique").on(
      table.raceDayId,
      table.raceNumber
    ),
  ]
);

export const sources = pgTable("sources",
{
    id: text("id").primaryKey(),
    name: text("name").notNull(),
},
  (table) => [
    uniqueIndex("sources_name_unique").on(table.name),
  ]
);

export const racePicks = pgTable("race_picks", {
    id: text("id").primaryKey(),
    raceId: text("race_id")
      .notNull()
      .references(() => races.id, { onDelete: "cascade" }),
    sourceId: text("source_id")
      .notNull()
      .references(() => sources.id, { onDelete: "cascade" }),
    value1: text("value_1"),
    value2: text("value_2"),
    value3: text("value_3"),
},
  (table) => [
    index("race_picks_race_id_idx").on(table.raceId),
    index("race_picks_source_id_idx").on(table.sourceId),
    uniqueIndex("race_picks_race_source_unique").on(
      table.raceId,
      table.sourceId
    ),
  ]
);

export const raceDaySources = pgTable(
  "race_day_sources",
  {
    raceDayId: text("race_day_id")
      .notNull()
      .references(() => raceDays.id, { onDelete: "cascade" }),
    sourceId: text("source_id")
      .notNull()
      .references(() => sources.id, { onDelete: "cascade" }),
  },
  (table) => [
    uniqueIndex("race_day_sources_unique").on(table.raceDayId, table.sourceId),
    index("race_day_sources_race_day_id_idx").on(table.raceDayId),
    index("race_day_sources_source_id_idx").on(table.sourceId),
  ]
);

export const leaguePool = pgTable("league_pool", {
  id: text("id").primaryKey(),
  date: date("date").notNull().defaultNow(),
},
  (table) => [
    index("league_pool_date_idx").on(table.date),
  ]
);

export const leaguePoolEntries = pgTable("league_pool_entries", {
  id: text("id").primaryKey(),
  team: text("team").notNull(), 
  name: text("name").notNull(),
  leaguePoolId: text("league_pool_id").notNull().references(() => leaguePool.id, { onDelete: "cascade" }),
  number0Color: text("number_0_color"),
  number1Color: text("number_1_color"),
  number2Color: text("number_2_color"),
  number3Color: text("number_3_color"),
  number4Color: text("number_4_color"),
  number5Color: text("number_5_color"),
  number6Color: text("number_6_color"),
  number7Color: text("number_7_color"),
  number8Color: text("number_8_color"),
  number9Color: text("number_9_color"),
  number10Color: text("number_10_color"),
},
  (table) => [
    index("league_pool_entries_pool_idx").on(table.leaguePoolId),
    index("league_pool_entries_team_idx").on(table.team),
    index("league_pool_entries_name_idx").on(table.name),
    index("league_pool_entries_pool_team_idx").on(
      table.leaguePoolId,
      table.team
    ),
    index("league_pool_entries_pool_name_idx").on(
      table.leaguePoolId,
      table.name
    ),
  ]
);

export const schema = {
  raceDays,
  races,
  sources,
  raceDaySources,
  racePicks,
  leaguePool, 
  leaguePoolEntries
};