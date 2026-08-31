import type { NextFunction, Request, Response } from "express";
import * as deviceService from "./device.service";
import type { HeartbeatInput, RegisterDeviceInput, UpdateDeviceInput } from "./device.schema";

// POST /api/devices — admin-authenticated (UC-2, Contract 6)
export async function registerDeviceHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await deviceService.registerDevice(req.body as RegisterDeviceInput);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function listDevicesHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Number(req.query.page ?? 1);
    const pageSize = Number(req.query.pageSize ?? 20);
    const result = await deviceService.listDevices(page, pageSize);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getDeviceHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const device = await deviceService.getDeviceOrThrow(req.params.id);
    res.status(200).json(device);
  } catch (err) {
    next(err);
  }
}

export async function updateDeviceHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const device = await deviceService.updateDevice(req.params.id, req.body as UpdateDeviceInput);
    res.status(200).json(device);
  } catch (err) {
    next(err);
  }
}

// POST /api/devices/heartbeat — device-authenticated (Contract 1)
// req.device is attached by device.middleware.
export async function heartbeatHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await deviceService.recordHeartbeat(req.device!.id, req.body as HeartbeatInput);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
