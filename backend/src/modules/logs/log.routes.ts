import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { listLogsQuerySchema } from "./log.schema";
import { listLogsHandler } from "./log.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", validate("query", listLogsQuerySchema), listLogsHandler);

export default router;
