import type { Request, Response } from "express";
import { ErrorCodes, type ApiErrorBody } from "@smartdoor/shared";

// Must be registered after all real routes, before error.middleware.
export function notFoundMiddleware(req: Request, res: Response) {
  const body: ApiErrorBody = {
    error: {
      code: ErrorCodes.NOT_FOUND,
      message: `No route: ${req.method} ${req.originalUrl}`,
    },
  };
  res.status(404).json(body);
}
