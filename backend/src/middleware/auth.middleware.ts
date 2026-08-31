import type { NextFunction, Request, Response } from "express";
import { ErrorCodes } from "@smartdoor/shared";
import { AppError } from "../lib/AppError";
import { verifyAdminToken, type AdminTokenPayload } from "../lib/jwt";

declare global {
  namespace Express {
    interface Request {
      admin?: AdminTokenPayload;
    }
  }
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    next(AppError.unauthorized(ErrorCodes.UNAUTHORIZED, "Missing Bearer token."));
    return;
  }

  const token = header.slice("Bearer ".length).trim();
  try {
    req.admin = verifyAdminToken(token);
    next();
  } catch {
    next(AppError.unauthorized(ErrorCodes.INVALID_TOKEN, "Invalid or expired token."));
  }
}
