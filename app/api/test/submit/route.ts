import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    // Process the submitted data as needed
    console.log("Received data:", data);
    return NextResponse.json(
      { message: "Data submitted successfully", receivedData: data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing submission:", error);
    return NextResponse.json(
      { message: "Error processing submission" },
      { status: 500 }
    );
  }
}
