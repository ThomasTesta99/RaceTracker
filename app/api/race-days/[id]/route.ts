import { deleteRaceDay } from "@/lib/race-actions/raceDay";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Source id is required." },
        { status: 400 }
      );
    }

    const result = await deleteRaceDay({id});

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to delete source." },
      { status: 500 }
    );
  }
}