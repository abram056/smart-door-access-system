import type { NextFunction, Request, Response } from "express";
import * as settingsService from "./settings.service";
import type { UpdateSettingsInput, ChangePasswordInput } from "./settings.schema";

export async function getSettingsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const settings = await settingsService.getSettings();
    res.status(200).json(settings);
  } catch (err) {
    next(err);
  }
}

export async function updateSettingsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const settings = await settingsService.updateSettings(req.body as UpdateSettingsInput);
    res.status(200).json(settings);
  } catch (err) {
    next(err);
  }
}

export async function changePasswordHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const admin = (req as any).admin;
    if (!admin) {
      res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Admin authentication required." } });
      return;
    }
    await settingsService.changePassword(admin.sub, req.body as ChangePasswordInput);
    res.status(200).json({ message: "Password changed successfully." });
  } catch (err) {
    next(err);
  }
}

export async function addEmergencyCardHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { uid } = req.body as { uid: string };
    const settings = await settingsService.addEmergencyCard(uid);
    res.status(200).json(settings);
  } catch (err) {
    next(err);
  }
}

export async function removeEmergencyCardHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { uid } = req.body as { uid: string };
    const settings = await settingsService.removeEmergencyCard(uid);
    res.status(200).json(settings);
  } catch (err) {
    next(err);
  }
}
