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

export async function submitDomain(data: Domain) {
  try {
    const existingDomain = await prisma.domain.findFirst({
      where: {
        url: data.url,
        ownerId: data.userID,
      },
    });

    if (existingDomain) {
      const lastTest = await updateTestStatus("failed");
      const test = await prisma.test.create({
        data: {
          domainId: existingDomain.id,
          status: "pending",
        },
      });

      return {
        success: true,
        message: "New test submitted for existing domain",
        testId: test.id,
      };
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

      const test = await prisma.test.create({
        data: {
          domainId: domain.id,
          status: "pending",
        },
      });
      return {
        success: true,
        message: "New test submitted for new domain",
        testId: test.id,
      };
    }
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

// export function pollRecentTests(
//   userID: string,
//   intervalMs = 5000,
//   onUpdate?: (tests: any[]) => void
// ) {
//   const interval = setInterval(async () => {
//     try {
//       const tests = await prisma.test.findMany({
//         where: {
//           domain: {
//             ownerId: userID,
//           },
//         },
//         include: {
//           domain: true,
//         },
//         orderBy: { createdAt: "desc" },
//       });

//       onUpdate?.(tests);
//     } catch (error) {
//       console.error("Polling recent tests failed:", error);
//     }
//   }, intervalMs);

//   return () => clearInterval(interval);
// }
