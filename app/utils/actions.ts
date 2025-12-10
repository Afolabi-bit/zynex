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

export async function submitDomain(domain: Domain) {
  console.log("Submitting domain:", domain);
  try {
    const existsForUser = await prisma.domain.findUnique({
      where: {
        url: domain.url,
        ownerId: domain.userID,
      },
    });

    if (!existsForUser) {
      console.log("Domain does not exist for user, creating...");
      await prisma.domain.create({
        data: {
          url: domain.url,
          device: domain.device,
          network: domain.network,
          ownerId: domain.userID,
        },
      });
    }
  } catch (error) {
    console.error("Error submitting domain:", error);
  }
}
