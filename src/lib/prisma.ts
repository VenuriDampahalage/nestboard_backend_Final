// bridge --> helps Prisma talk to a PostgreSQL database
import { PrismaPg } from "@prisma/adapter-pg";
// generated specifically for database schema
import { PrismaClient } from "../generated/client.js";
import { env } from "./env.js";

// global singleton pattern
//safe space in global environment to store database connection
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Set up connection bridge using DATABASE_URL from environment variables
export const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

// Create actual database connection (prisma variable)
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: env.NODE_ENV === "dev" ? ["query", "warn", "error"] : ["error"],
  });

if (env.NODE_ENV !== "prod") {
  globalForPrisma.prisma = prisma;
}
