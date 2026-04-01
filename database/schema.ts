import {
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const betTypeEnum = pgEnum("bet_type", ["box", "exact"]);

export const raceDays = pgTable("race_days",{
    id: text("id").primaryKey(),
    date: date("date").notNull().defaultNow(),
    track: text("track").notNull(),
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
    raceNumber: integer("race_number"),
    result: text("result"),
    betType: betTypeEnum("bet_type"),
    win1: text("win_1"),
    win2: text("win_2"),
    win3: text("win_3"),
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
      .references(() => sources.id, { onDelete: "restrict" }),
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

export const schema = {
  raceDays,
  races,
  sources,
  racePicks,
};