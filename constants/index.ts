// import { RaceData } from "@/types";

import { BarChart2Icon, DatabaseIcon, FileSpreadsheetIcon, HomeIcon, Settings, TrophyIcon } from "lucide-react";

export const sidebarLinks = [
    {
        icon: HomeIcon, 
        route: '/', 
        label: 'Home', 
    },
    {
        icon: FileSpreadsheetIcon,
        route: '/race-sheets', 
        label: 'Race Sheets', 
    },
    {
        icon: DatabaseIcon, 
        route: '/sources', 
        label: 'Sources'
    },
    {
        icon: BarChart2Icon, 
        route: '/metrics', 
        label: 'Metrics', 
    },
    {
        icon: TrophyIcon, 
        route: '/league-pools', 
        label: 'League Pool',
    },
    {
        icon: Settings, 
        route: "/settings", 
        label: "Settings"
    }
];

export const MIN_PASSWORD_LENGTH = 10;