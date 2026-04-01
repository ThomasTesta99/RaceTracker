import { getRaceDays } from "@/lib/race-actions/raceDay";
import { NextResponse } from "next/server";

export async function GET(){
    const result = await getRaceDays();
    return NextResponse.json(result);
}