import { raceDays, racePicks, races, sources } from "@/database/schema";

export type RaceResult = "win" | "loss" | "scratch";

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

export type GetSourcesResponse =
  | {
      success: true;
      sourcesList: Source[];
    }
  | {
      success: false;
      message: string;
      sourcesList?: Source[];
    };

export type RaceResultOption = "win" | "loss" | "scratch" | "";

export type PickTriple = {
  value1: string;
  value2: string;
  value3: string;
};

export type RaceRow = {
  raceId?: string;
  raceNumber: number;
  result: RaceResultOption;
  userPicks: PickTriple;
  sourcePicks: Record<string, PickTriple>;
};

export type RaceSheetTableProps = {
  raceDayId: string;
  sources: Source[];
  initialRows: RaceRow[];
};

export type RaceSheetPageData = {
  sources: Source[];
  rows: RaceRow[];
};