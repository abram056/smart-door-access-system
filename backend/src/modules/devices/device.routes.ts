import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { deviceMiddleware } from "../../middleware/device.middleware";
import { validate } from "../../middleware/validate.middleware";
import { heartbeatSchema, registerDeviceSchema, updateDeviceSchema } from "./device.schema";
import {
  getDeviceHandler,
  heartbeatHandler,
  listDevicesHandler,
  registerDeviceHandler,
  updateDeviceHandler,
} from "./device.controller";

const router = Router();

// Heartbeat is device-authenticated (FR-9.1) — register before authMiddleware.
router.post("/heartbeat", deviceMiddleware, validate("body", heartbeatSchema), heartbeatHandler);

// Everything else is an admin action.
router.use(authMiddleware);

router.get("/", listDevicesHandler);
router.post("/", validate("body", registerDeviceSchema), registerDeviceHandler);
router.get("/:id", getDeviceHandler);
router.put("/:id", validate("body", updateDeviceSchema), updateDeviceHandler);

export default router;
