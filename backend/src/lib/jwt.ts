import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AdminTokenPayload {
  sub: string; // Administrator.id
  username: string;
  role: string;
}

export function signAdminToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresInSeconds,
  });
}

export function verifyAdminToken(token: string): AdminTokenPayload {
  return jwt.verify(token, env.jwtSecret) as AdminTokenPayload;
}
