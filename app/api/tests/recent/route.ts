import { NextResponse } from "next/server";
import { getRecentTests } from "@/app/utils/actions";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const tests = await getRecentTests(userId);
    return NextResponse.json({ tests });
  } catch (error) {
    console.error("Error fetching recent tests:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent tests" },
      { status: 500 }
    );
  }
}
