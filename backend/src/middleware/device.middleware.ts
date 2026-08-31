import type { NextFunction, Request, Response } from "express";
import { ErrorCodes } from "@smartdoor/shared";
import { AppError } from "../lib/AppError";
import { prisma } from "../lib/prisma";
import type { Device, Door } from "../generated/prisma";

declare global {
  namespace Express {
    interface Request {
      device?: Device & { door: Door };
    }
  }
}

// Protects every ESP32-facing route (FR-9.1). Every device request must carry
// Device-ID and Device-Token headers (docs/05 Contract 1, and Event 8 for the
// failure path).
export async function deviceMiddleware(req: Request, _res: Response, next: NextFunction) {
  const deviceId = req.header("Device-ID");
  const deviceToken = req.header("Device-Token");

  if (!deviceId || !deviceToken) {
    next(
      AppError.unauthorized(
        ErrorCodes.INVALID_DEVICE_TOKEN,
        "Device-ID and Device-Token headers are required.",
      ),
    );
    return;
  }

  const device = await prisma.device.findUnique({
    where: { deviceId },
    include: { door: true },
  });

  if (!device) {
    next(AppError.notFound(ErrorCodes.DEVICE_NOT_FOUND, "Device does not exist."));
    return;
  }

  if (device.deviceToken !== deviceToken) {
    next(AppError.unauthorized(ErrorCodes.INVALID_DEVICE_TOKEN, "Authentication failed."));
    return;
  }

  if (device.status === "DISABLED") {
    next(new AppError(403, ErrorCodes.DEVICE_DISABLED, "Device is disabled."));
    return;
  }

  req.device = device;
  next();
}
