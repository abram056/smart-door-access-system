import type { NextFunction, Request, Response } from "express";
import * as accessService from "./access.service";
import type { AccessRequestInput } from "./access.schema";

// POST /api/access — req.device attached by device.middleware.
export async function accessRequestHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { rfid_uid } = req.body as AccessRequestInput;
    const result = await accessService.handleAccessRequest(req.device!, rfid_uid);
    // Contract 2 — always 200; "denied" is a valid decision, not an HTTP error.
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
