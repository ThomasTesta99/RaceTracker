import { getRaceDays } from "@/lib/race-actions/raceDay";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const page = Number.parseInt(searchParams.get("page") ?? "1", 10) || 1;
  const limit = Number.parseInt(searchParams.get("limit") ?? "10", 10) || 10;

  const result = await getRaceDays({
    page,
    limit,
  });

  return NextResponse.json(result);
}