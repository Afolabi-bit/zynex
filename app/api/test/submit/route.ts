import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    return NextResponse.json(
      { message: "Data submitted successfully", receivedData: data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Could not process URL",
      },
      { status: 500 }
    );
  }
}
