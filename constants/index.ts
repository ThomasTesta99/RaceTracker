// import { RaceData } from "@/types";

import { BarChart2Icon, DatabaseIcon, FileSpreadsheetIcon, HomeIcon, TrophyIcon } from "lucide-react";

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
    }
]