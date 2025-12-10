import { submitDomain } from "@/app/utils/actions";
import getSessionUser from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 1. Check authentication first
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // 2. Get and validate data
    const data = await request.json();

    // Check if URL exists in the data
    if (!data.url || typeof data.url !== "string") {
      return NextResponse.json(
        { message: "Invalid request. URL is required." },
        { status: 400 }
      );
    }

    // Basic URL validation
    const urlPattern = /^https?:\/\/.+/i;
    if (!urlPattern.test(data.url)) {
      return NextResponse.json(
        { message: "Invalid URL format. Must start with http:// or https://" },
        { status: 400 }
      );
    }

    // 3. Submit the domain
    const result = await submitDomain(data);

    console.log("Domain submitted successfully:", data.url);

    return NextResponse.json(
      {
        message: "Test queued successfully",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/test/submit:", error);

    // Handle different error types
    if (error instanceof Error) {
      // Check for specific database errors
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          { message: "This URL is already being tested. Please wait." },
          { status: 409 }
        );
      }

      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
