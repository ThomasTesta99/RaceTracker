// import { RaceData } from "@/types";

import { BarChart2Icon, FilePlus2Icon, FileSpreadsheetIcon, HomeIcon } from "lucide-react";

// export const SOURCES = [
//     {
//         id: 1,
//         name: "TrackMaster",
//     },
//     {
//         id: 2,
//         name: "Number Fire",
//     },
//     {
//         id: 3,
//         name: "Craig Donnely",
//     },
// ] as const;

// export const RACE_DATA: RaceData = {
//     date: "2026-03-25",
//     track: "Parx",
//     races: [
//         {
//             raceNumber: "1",
//             horseWin: ["7", "5", "6"],
//             result: "loss",
//             betType: "exact",
//             picks: [
//                 {
//                     sourceId: SOURCES[0].id,
//                     sourceName: SOURCES[0].name,
//                     values: ["3", "5", "7"],
//                 },
//                 {
//                     sourceId: SOURCES[1].id,
//                     sourceName: SOURCES[1].name,
//                     values: ["5", "2", "7"],
//                 },
//                 {
//                     sourceId: SOURCES[2].id,
//                     sourceName: SOURCES[2].name,
//                     values: ["7", "5", "2"],
//                 },
//             ],
//         },
//         {
//             raceNumber: "2",
//             horseWin: ["2", "5", "1"],
//             result: "loss",
//             betType: "box",
//             picks: [
//                 {
//                     sourceId: SOURCES[0].id,
//                     sourceName: SOURCES[0].name,
//                     values: ["6", "5", "3"],
//                 },
//                 {
//                     sourceId: SOURCES[1].id,
//                     sourceName: SOURCES[1].name,
//                     values: ["6", "1", "7"],
//                 },
//                 {
//                     sourceId: SOURCES[2].id,
//                     sourceName: SOURCES[2].name,
//                     values: ["6", "7", "1"],
//                 },
//             ],
//         },
//     ],
// };

export const sidebarLinks = [
    {
        icon: HomeIcon, 
        route: '/', 
        label: 'Home', 
    },
    {
        icon: FilePlus2Icon, 
        route: '/new-race-sheet', 
        label: 'Create New Race Sheet', 
    },
    {
        icon: FileSpreadsheetIcon,
        route: '/race-sheets', 
        label: 'Race Sheets', 
    },
    {
        icon: BarChart2Icon, 
        route: '/metrics', 
        label: 'Metrics', 
    },
]