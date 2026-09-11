import type { NextFunction, Request, Response } from "express";
import * as logService from "./log.service";

type ListLogsQuery = {
  search?: string;
  userId?: string;
  doorId?: string;
  deviceId?: string;
  result?: string;
  dateFrom?: string;
  dateTo?: string;
  page: number;
  pageSize: number;
};

type LogSyncInput = {
  logs: Array<{
    rfid_uid: string;
    timestamp: string;
    result: "GRANTED" | "DENIED";
    reason: string;
  }>;
};

export async function listLogsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await logService.listLogs(req.query as unknown as ListLogsQuery);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function syncLogsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const device = (req as any).device;
    if (!device) {
      res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Device authentication required." } });
      return;
    }
    const count = await logService.syncOfflineLogs(req.body as LogSyncInput, device);
    res.status(200).json({ uploaded: count });
  } catch (err) {
    next(err);
  }
}
