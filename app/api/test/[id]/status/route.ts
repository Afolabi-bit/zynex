import { NextResponse } from "next/server";
import { getTestStatus } from "@/app/utils/actions";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const testId = parseInt(id);
    if (isNaN(testId)) {
      return NextResponse.json({ error: "Invalid test ID" }, { status: 400 });
    }

    const test = await getTestStatus(testId);

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    return NextResponse.json(test);
  } catch (error) {
    console.error("Error fetching test status:", error);
    return NextResponse.json(
      { error: "Failed to fetch test status" },
      { status: 500 }
    );
  }
}
