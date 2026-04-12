import { createSource, deleteSource, editSource, getSources } from "@/lib/race-actions/sources";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const result = await getSources();
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sourceName = body.sourceName?.trim();

    if (!sourceName) {
      return NextResponse.json(
        { success: false, message: "Source name is required" },
        { status: 400 }
      );
    }

    const result = await createSource(sourceName);
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to create source" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body.id;
    const sourceName = body.sourceName?.trim();

    if (!id || !sourceName) {
      return NextResponse.json(
        { success: false, message: "ID and source name are required" },
        { status: 400 }
      );
    }

    const result = await editSource({ id, sourceName });
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to update source" },
      { status: 500 }
    );
  }
}