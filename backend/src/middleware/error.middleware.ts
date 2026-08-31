import type { ErrorRequestHandler } from "express";
import { ErrorCodes, type ApiErrorBody } from "@smartdoor/shared";
import { AppError } from "../lib/AppError";
import { Prisma } from "../generated/prisma";

// Must be registered LAST in app.ts, after all routes.
export const errorMiddleware: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof AppError) {
    const body: ApiErrorBody = { error: { code: err.code, message: err.message } };
    res.status(err.statusCode).json(body);
    return;
  }

  // Prisma unique-constraint violations that a service forgot to pre-check.
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    const body: ApiErrorBody = {
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: `Duplicate value for: ${(err.meta?.target as string[])?.join(", ") ?? "unknown field"}`,
      },
    };
    res.status(409).json(body);
    return;
  }

  // eslint-disable-next-line no-console
  console.error("Unhandled error:", err);
  const body: ApiErrorBody = {
    error: { code: ErrorCodes.INTERNAL_ERROR, message: "Something went wrong." },
  };
  res.status(500).json(body);
};
