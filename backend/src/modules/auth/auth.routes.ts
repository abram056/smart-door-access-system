import { Router } from "express";
import { validate } from "../../middleware/validate.middleware";
import { loginSchema } from "./auth.schema";
import { loginHandler } from "./auth.controller";

const router = Router();

// POST /api/auth/login — Contract 7
router.post("/login", validate("body", loginSchema), loginHandler);

export default router;
