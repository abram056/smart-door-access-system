import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createUserSchema, listUsersQuerySchema, updateUserSchema } from "./user.schema";
import {
  createUserHandler,
  disableUserHandler,
  getUserHandler,
  listUsersHandler,
  updateUserHandler,
} from "./user.controller";

const router = Router();

// Every user-management action requires a valid admin JWT.
router.use(authMiddleware);

router.get("/", validate("query", listUsersQuerySchema), listUsersHandler);
router.post("/", validate("body", createUserSchema), createUserHandler);
router.get("/:id", getUserHandler);
router.put("/:id", validate("body", updateUserSchema), updateUserHandler);
router.delete("/:id", disableUserHandler);

export default router;
