"use server";

import prisma from "@/lib/db";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { Domain } from "../types/databaseTypes";

export async function syncUserToDatabase(user: KindeUser) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email || "",
          name: user.given_name + " " + user.family_name,
        },
      });
    }
  } catch (error) {
    console.error("Error syncing user:", error);
  }
}

export async function updateTestStatus(status: string) {
  try {
    const test = await prisma.test.findFirst({
      where: {
        status: "pending",
      },
    });
    if (!test) {
      return null;
    }
    await prisma.test.update({
      where: {
        id: test.id,
      },
      data: {
        status: status,
      },
    });
    return test;
  } catch (error) {
    console.error("Error updating test status:", error);
    throw new Error("Failed to update test status");
  }
}

async function runLighthouseAndSave(
  testId: number,
  url: string,
  device: string,
  network: string
) {
  try {
    // Get the base URL for API calls (server-side needs absolute URL)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/lighthouse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        device: device.toLowerCase(),
        network,
      }),
    });

    // Check if response is OK before attempting to parse JSON
    if (!response.ok) {
      let errorMessage = `Lighthouse API request failed with status ${response.status}`;

      // Try to get error details from response
      try {
        const errorText = await response.text();
        console.error("Lighthouse API error response:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });

        // Try to parse as JSON if possible
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          // If not JSON, use the text as-is
          errorMessage = errorText || errorMessage;
        }
      } catch (textError) {
        console.error("Failed to read error response:", textError);
      }

      throw new Error(errorMessage);
    }

    // Parse JSON response with error handling
    let data;
    try {
      const responseText = await response.text();

      if (!responseText || responseText.trim() === "") {
        throw new Error("Lighthouse API returned an empty response");
      }

      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse Lighthouse API response:", {
        error: parseError instanceof Error ? parseError.message : parseError,
        responseStatus: response.status,
        responseHeaders: Object.fromEntries(response.headers.entries()),
      });
      throw new Error(
        `Failed to parse Lighthouse API response: ${
          parseError instanceof Error ? parseError.message : "Unknown error"
        }`
      );
    }

    if (!data.success) {
      console.error("Lighthouse API returned unsuccessful result:", data);
      throw new Error(
        data.error || data.message || "Lighthouse API request failed"
      );
    }

    console.log("Lighthouse completed successfully:", {
      testId,
      performanceScore: data.results.performanceScore,
    });

    await prisma.test.update({
      where: { id: testId },
      data: {
        status: "completed",
        // performanceScore: results.performanceScore,
        // fcp: results.fcp,
        // lcp: results.lcp,
        // tbt: results.tbt,
        // cls: results.cls,
        // Store full report in database for now (we'll move to R2 later)
      },
    });
  } catch (error) {
    console.error("Lighthouse test failed:", {
      testId,
      url,
      error: error instanceof Error ? error.message : error,
    });

    // Mark test as failed
    await prisma.test.update({
      where: { id: testId },
      data: { status: "failed" },
    });
    throw error;
  }
}

export async function submitDomain(data: Domain) {
  let test;
  try {
    const existingDomain = await prisma.domain.findFirst({
      where: {
        url: data.url,
        ownerId: data.userID,
      },
    });

    if (existingDomain) {
      const lastTest = await updateTestStatus("failed");
      test = await prisma.test.create({
        data: {
          domainId: existingDomain.id,
          status: "pending",
        },
      });
    } else {
      const domain = await prisma.domain.create({
        data: {
          url: data.url,
          device: data.device,
          network: data.network,
          ownerId: data.userID,
        },
      });
      const lastTest = await updateTestStatus("failed");

      test = await prisma.test.create({
        data: {
          domainId: domain.id,
          status: "pending",
        },
      });
    }

    await runLighthouseAndSave(
      test.id,
      data.url,
      data.device,
      data.network
    ).catch((error) => {
      console.error("Lighthouse failed:", error);
    });

    return {
      success: true,
      message: "New test submitted for new domain",
      testId: test.id,
    };
  } catch (error) {
    console.error("Error submitting domain:", error);

    // Re-throw the error with a clear message
    if (error instanceof Error) {
      throw new Error(`Failed to submit domain: ${error.message}`);
    }
    throw new Error("Failed to submit domain");
  }
}

export async function getTestStatus(id: number) {
  try {
    const test = await prisma.test.findUnique({
      where: {
        id: id,
      },
    });
    return test;
  } catch (error) {
    console.error("Error getting test status:", error);
    throw new Error("Failed to get test status");
  }
}

export async function getRecentTests(userID: string) {
  try {
    const tests = await prisma.test.findMany({
      where: {
        domain: {
          ownerId: userID,
        },
      },
      include: {
        domain: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return tests;
  } catch (error) {
    console.error("Error getting recent tests:", error);
    throw new Error("Failed to get recent tests");
  }
}
