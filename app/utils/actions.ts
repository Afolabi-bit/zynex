"use server";

import prisma from "@/lib/db";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { runLighthouseAudit } from "@/lib/lighthouse-runner";

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

interface Domain {
  url: string;
  device: string;
  network: string;
  userID: string;
}

async function runLighthouseAndSave(
  testId: number,
  url: string,
  device: string,
  network: string
) {
  try {
    console.log("🚀 Starting Lighthouse test:", {
      testId,
      url,
      device,
      network,
    });

    // Get the app URL - use environment variable or construct it
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000";

    // Call the API route (this is OK from a server action)
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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Lighthouse API failed with status ${response.status}`
      );
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(
        data.error || "Lighthouse API returned unsuccessful result"
      );
    }

    const results = data.results;

    console.log("✅ Lighthouse completed successfully:", {
      testId,
      performanceScore: results.performanceScore,
    });

    // Update test with results
    await prisma.test.update({
      where: { id: testId },
      data: {
        status: "completed",
        // performanceScore: results.performanceScore,
        // fcp: results.fcp,
        // lcp: results.lcp,
        // tbt: results.tbt,
        // cls: results.cls,
        // fullReport: results.fullReport, // Uncomment if needed
      },
    });

    return results;
  } catch (error) {
    console.error("❌ Lighthouse test failed:", {
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
      await updateTestStatus("failed");
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

      await updateTestStatus("failed");

      test = await prisma.test.create({
        data: {
          domainId: domain.id,
          status: "pending",
        },
      });
    }

    // Run Lighthouse in background
    runLighthouseAndSave(test.id, data.url, data.device, data.network).catch(
      (error) => {
        console.error("❌ Background Lighthouse test failed:", error);
      }
    );

    return {
      success: true,
      message: "Test submitted successfully",
      testId: test.id,
    };
  } catch (error) {
    console.error("❌ Error submitting domain:", error);

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
