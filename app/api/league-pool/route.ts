import { getLeaguePools } from "@/lib/league-actions/league";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await getLeaguePools();

  return NextResponse.json(result);
}