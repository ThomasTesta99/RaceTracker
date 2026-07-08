import {
  leaguePool,
  leaguePoolEntries,
  raceDays,
  raceDaySources,
  racePicks,
  races,
  sources,
} from "@/database/schema";
import { ReactNode } from "react";

export type RaceResult = "win" | "loss" | "scratch";

export type RaceDay = typeof raceDays.$inferSelect;
export type NewRaceDay = typeof raceDays.$inferInsert;

export type RacePick = typeof racePicks.$inferSelect;
export type NewRacePick = typeof racePicks.$inferInsert;

export type Race = typeof races.$inferSelect;
export type NewRace = typeof races.$inferInsert;

export type Source = typeof sources.$inferSelect;
export type NewSource = typeof sources.$inferInsert;

export type RaceDaySource = typeof raceDaySources.$inferSelect;
export type NewRaceDaySource = typeof raceDaySources.$inferInsert;

export type LeaguePool = typeof leaguePool.$inferSelect;
export type NewLeaguePool = typeof leaguePool.$inferInsert;

export type LeaguePoolEntry = typeof leaguePoolEntries.$inferSelect;
export type NewLeaguePoolEntry = typeof leaguePoolEntries.$inferInsert;

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
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
      };
    }
  | {
      success: false;
      message: string;
      raceList: RaceDay[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
      };
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

export type PickField = "value1" | "value2" | "value3" | "value4";

export type PickValues = {
  value1: string;
  value2: string;
  value3: string;
  value4: string;
};

export type DoublePickValues = {
  value1: string;
  value2: string;
};

export type RaceRow = {
  raceId?: string;
  raceNumber: number;
  result: RaceResultOption;
  winners: PickValues;
  userPicks: PickValues;
  sourcePicks: Record<string, PickValues>;
  doublePick: DoublePickValues;
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

export type SourceStat = {
  sourceId: string;
  sourceName: string;

  totalPicks: number;
  correctFirstPicks: number;
  accuracyPercent: number;

  itmHits: number;
  itmTotalNumbers: number;
  itmPercent: number;
};

export type UserStat = {
  totalRaces: number;
  wins: number;
  losses: number;
  scratches: number;
  winPercent: number;

  userItmHits: number;
  userItmTotalNumbers: number;
  userItmPercent: number;
};

export type UpdateLeaguePoolEntryInput = {
  team?: string;
  name?: string;
  number0Color?: string | null;
  number1Color?: string | null;
  number2Color?: string | null;
  number3Color?: string | null;
  number4Color?: string | null;
  number5Color?: string | null;
  number6Color?: string | null;
  number7Color?: string | null;
  number8Color?: string | null;
  number9Color?: string | null;
  number10Color?: string | null;
};

export type GetLeaguePoolsResponse = {
  success: boolean;
  leaguePools?: LeaguePool[];
  message?: string;
};

export type CreateLeaguePoolEntryProps = {
  leaguePoolId: string;
  trigger?: ReactNode;
};

export type CreateLeaguePoolEntryFormProps = {
  leaguePoolId: string;
  onSuccess?: () => void;
};

export type RaceSheetTableHeadProps = {
  sources: Source[];
};

export type PickInputProps = {
  value: string;
  onChange: (value: string) => void;
  highlightClass: string;
};

export type DoublePickInputProps = {
  value1: string;
  value2: string;
  onChangeValue1: (value: string) => void;
  onChangeValue2: (value: string) => void;
  highlightClass1: string;
  highlightClass2: string;
};

export type ResultCellProps = {
  value: RaceResultOption;
  onChange: (value: RaceResultOption) => void;
  onClear: () => void;
};

export type RaceSheetRowProps = {
  row: RaceRow;
  sources: Source[];
  updateResult: (raceNumber: number, value: RaceResultOption) => void;
  updateWinner: (
    raceNumber: number,
    field: PickField,
    value: string
  ) => void;
  updateDoublePick: (
    raceNumber: number,
    field: keyof DoublePickValues,
    value: string
  ) => void;
  updateUserPick: (
    raceNumber: number,
    field: PickField,
    value: string
  ) => void;
  updateSourcePick: (
    raceNumber: number,
    sourceId: string,
    field: PickField,
    value: string
  ) => void;
};