// lib/prisma.ts

import { PrismaClient } from "./generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create the Neon adapter with connection string
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});

// Initialize Prisma Client with the adapter
const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? [] : [],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
