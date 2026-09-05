import { Router } from "express";
import { deviceMiddleware } from "../../middleware/device.middleware";
import { validate } from "../../middleware/validate.middleware";
import { accessRequestSchema } from "./access.schema";
import { accessRequestHandler } from "./access.controller";
import { logSyncSchema } from "../logs/log.schema";
import { syncLogsHandler } from "../logs/log.controller";

const router = Router();

// POST /api/access — Contract 2, device-authenticated (FR-9.1).
router.post("/", deviceMiddleware, validate("body", accessRequestSchema), accessRequestHandler);

// POST /api/access/logs/sync — Contract 3, device-authenticated.
// Lives under /access per the contract's URL even though the logic is
// logs-module logic — kept here so the route path matches docs/05 exactly.
router.post("/logs/sync", deviceMiddleware, validate("body", logSyncSchema), syncLogsHandler);

export default router;
