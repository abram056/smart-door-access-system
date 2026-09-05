import type { NextFunction, Request, Response } from "express";
import * as userService from "./user.service";
import type { CreateUserInput, ListUsersQuery, UpdateUserInput } from "./user.schema";

export async function createUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userService.createUser(req.body as CreateUserInput);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

export async function listUsersHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await userService.listUsers(req.query as unknown as ListUsersQuery);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userService.getUserOrThrow(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userService.updateUser(req.params.id, req.body as UpdateUserInput);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

// DELETE is a soft-disable, not a hard delete — see user.service.ts.
export async function disableUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userService.disableUser(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}
