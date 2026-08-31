import { PrismaClient } from "../generated/prisma";

// Standard singleton pattern so dev hot-reload (tsx watch) doesn't spawn a new
// PrismaClient (and a new connection pool) on every file save.
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma = globalThis.__prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}
