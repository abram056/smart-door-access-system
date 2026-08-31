import type { NextFunction, Request, Response } from "express";
import * as authService from "./auth.service";
import type { LoginInput } from "./auth.schema";

export async function loginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.body as LoginInput;
    const result = await authService.login(body);
    // Contract 7 — raw shape, no envelope.
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
