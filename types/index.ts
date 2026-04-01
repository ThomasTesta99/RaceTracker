import { raceDays, racePicks, races, sources } from "@/database/schema";

export type RaceResult = "win" | "loss";

export type RaceDay = typeof raceDays.$inferSelect;
export type NewRaceDay = typeof raceDays.$inferInsert;

export type RacePick = typeof racePicks.$inferSelect;
export type NewRacePick = typeof racePicks.$inferInsert;

export type Race = typeof races.$inferSelect;
export type NewRace = typeof races.$inferInsert;

export type Source = typeof sources.$inferSelect;
export type NewSource = typeof sources.$inferInsert;

export type GetRaceDayResponse =
  | {
      success: true;
      raceDay: RaceDay;
    }
  | {
      success: false;
      message: string;
    };

export type GetRaceDaysResponse =
  | {
      success: true;
      raceList: RaceDay[];
    }
  | {
      success: false;
      message: string;
      raceList?: RaceDay[];
    };