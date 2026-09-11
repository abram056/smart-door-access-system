import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { deviceMiddleware } from "../../middleware/device.middleware";
import { validate } from "../../middleware/validate.middleware";
import {
  createCardSchema,
  enrollConfirmSchema,
  enrollStartSchema,
  updateCardSchema,
} from "./card.schema";
import {
  confirmEnrollmentHandler,
  createCardHandler,
  disableCardHandler,
  getCardHandler,
  getEnrollmentStatusHandler,
  listCardsHandler,
  startEnrollmentHandler,
  updateCardHandler,
} from "./card.controller";

const router = Router();

// Enrollment status is polled by the ESP32 (device-authenticated, NOT admin).
router.get("/enroll/status", deviceMiddleware, getEnrollmentStatusHandler);

// Enrollment confirm comes from the ESP32 (FR-9.1: Device-ID/Device-Token on
// every device request), NOT from an admin session — register this before
// the router-wide authMiddleware below.
router.post(
  "/enroll/confirm",
  deviceMiddleware,
  validate("body", enrollConfirmSchema),
  confirmEnrollmentHandler,
);

// Everything else is an admin action.
router.use(authMiddleware);

router.get("/", listCardsHandler);
router.post("/", validate("body", createCardSchema), createCardHandler);
router.post("/enroll", validate("body", enrollStartSchema), startEnrollmentHandler);
router.get("/:id", getCardHandler);
router.put("/:id", validate("body", updateCardSchema), updateCardHandler);
router.delete("/:id", disableCardHandler);

export default router;
