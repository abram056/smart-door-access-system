import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import { PrismaClient } from "../src/generated/prisma";
import { env } from "../src/config/env";

const adapter = new PrismaPg({ connectionString: env.databaseUrl });
const prisma = new PrismaClient({ adapter });

const DEFAULT_SETTINGS = [
  { key: "heartbeat_interval", value: "60" },
  { key: "unlock_duration", value: "5" },
  { key: "emergency_cards", value: "[]" },
];

async function main() {
  // Seed administrator
  const existing = await prisma.administrator.findUnique({
    where: { username: env.seedAdminUsername },
  });

  if (!existing) {
    const passwordHash = await bcrypt.hash(env.seedAdminPassword, 10);
    await prisma.administrator.create({
      data: {
        username: env.seedAdminUsername,
        passwordHash,
        role: "ADMIN",
      },
    });
    console.log(
      `Seeded administrator "${env.seedAdminUsername}" / "${env.seedAdminPassword}" — change this before any real deployment.`,
    );
  } else {
    console.log(`Administrator "${env.seedAdminUsername}" already exists — skipping.`);
  }

  // Seed default settings
  for (const setting of DEFAULT_SETTINGS) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log("Default settings seeded.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
