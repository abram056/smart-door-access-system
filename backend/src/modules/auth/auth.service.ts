import bcrypt from "bcrypt";
import { ErrorCodes, type LoginResponse } from "@smartdoor/shared";
import { AppError } from "../../lib/AppError";
import { prisma } from "../../lib/prisma";
import { signAdminToken } from "../../lib/jwt";
import { env } from "../../config/env";
import type { LoginInput } from "./auth.schema";

export async function login(input: LoginInput): Promise<LoginResponse> {
  const admin = await prisma.administrator.findUnique({
    where: { username: input.username },
  });

  // Same error for "no such user" and "wrong password" — don't leak which one.
  if (!admin) {
    throw AppError.unauthorized(ErrorCodes.INVALID_CREDENTIALS, "Invalid username or password.");
  }

  const passwordMatches = await bcrypt.compare(input.password, admin.passwordHash);
  if (!passwordMatches) {
    throw AppError.unauthorized(ErrorCodes.INVALID_CREDENTIALS, "Invalid username or password.");
  }

  const access_token = signAdminToken({
    sub: admin.id,
    username: admin.username,
    role: admin.role,
  });

  return {
    access_token,
    expires_in: env.jwtExpiresInSeconds,
  };
}
