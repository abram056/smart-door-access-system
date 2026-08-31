import bcrypt from "bcrypt";
import { PrismaClient } from "../src/generated/prisma";
import { env } from "../src/config/env";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.administrator.findUnique({
    where: { username: env.seedAdminUsername },
  });

  if (existing) {
    console.log(`Administrator "${env.seedAdminUsername}" already exists — skipping.`);
    return;
  }

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
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
