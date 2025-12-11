import { submitDomain } from "@/app/utils/actions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const result = await submitDomain(data);

    console.log("Domain submitted successfully:", result);

    return NextResponse.json(
      {
        message: "Test queued successfully",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/test/submit:", error);

    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          { message: "This URL is already in your tracked domains." },
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
