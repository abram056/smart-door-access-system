import type { NextFunction, Request, Response } from "express";
import * as cardService from "./card.service";
import type {
  CreateCardInput,
  EnrollConfirmInput,
  EnrollStartInput,
  UpdateCardInput,
} from "./card.schema";

export async function listCardsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Number(req.query.page ?? 1);
    const pageSize = Number(req.query.pageSize ?? 20);
    const result = await cardService.listCards(page, pageSize);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function createCardHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const card = await cardService.createCard(req.body as CreateCardInput);
    res.status(201).json(card);
  } catch (err) {
    next(err);
  }
}

export async function getCardHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const card = await cardService.getCardOrThrow(req.params.id);
    res.status(200).json(card);
  } catch (err) {
    next(err);
  }
}

export async function updateCardHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const card = await cardService.updateCard(req.params.id, req.body as UpdateCardInput);
    res.status(200).json(card);
  } catch (err) {
    next(err);
  }
}

export async function disableCardHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const card = await cardService.disableCard(req.params.id);
    res.status(200).json(card);
  } catch (err) {
    next(err);
  }
}

// POST /api/cards/enroll — admin starts a waiting session for a user.
export async function startEnrollmentHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.body as EnrollStartInput;
    const result = await cardService.startEnrollment(userId);
    res.status(202).json(result);
  } catch (err) {
    next(err);
  }
}

// POST /api/cards/enroll/confirm — ESP32 posts the scanned uid (Contract 4).
// Note: device-authenticated, not admin-authenticated — see card.routes.ts.
export async function confirmEnrollmentHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { rfid_uid } = req.body as EnrollConfirmInput;
    const result = await cardService.confirmEnrollment(rfid_uid);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
