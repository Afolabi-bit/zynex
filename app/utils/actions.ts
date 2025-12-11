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

export async function submitDomain(data: Domain) {
  console.log("Submitting domain:", data);

  try {
    // const cleanUrl = data.url.trim().replace(/\/$/, "");

    const existingDomain = await prisma.domain.findFirst({
      where: {
        url: data.url,
        ownerId: data.userID,
      },
    });

    if (existingDomain) {
      return {
        success: false,
        message: "Domain already exists for user",
      };
    } else {
      console.log("Domain does not exist for user, creating...");
      const domain = await prisma.domain.create({
        data: {
          url: data.url,
          device: data.device,
          network: data.network,
          ownerId: data.userID,
        },
      });
      console.log("Domain created:", domain.id);
    }

    return {
      success: true,
      // domainId: domain.id,
      url: data.url,
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
