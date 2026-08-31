import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const env = {
  port: parseInt(process.env.PORT ?? "3000", 10),
  databaseUrl: required("DATABASE_URL"),
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresInSeconds: parseInt(process.env.JWT_EXPIRES_IN_SECONDS ?? "3600", 10),
  nodeEnv: process.env.NODE_ENV ?? "development",
  seedAdminUsername: process.env.SEED_ADMIN_USERNAME ?? "admin",
  seedAdminPassword: process.env.SEED_ADMIN_PASSWORD ?? "admin123",
};
