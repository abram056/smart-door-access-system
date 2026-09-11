import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import {
  updateSettingsSchema,
  changePasswordSchema,
  addEmergencyCardSchema,
} from "./settings.schema";
import {
  getSettingsHandler,
  updateSettingsHandler,
  changePasswordHandler,
  addEmergencyCardHandler,
  removeEmergencyCardHandler,
} from "./settings.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", getSettingsHandler);
router.post("/", validate("body", updateSettingsSchema), updateSettingsHandler);
router.post("/password", validate("body", changePasswordSchema), changePasswordHandler);
router.post("/emergency-cards/add", validate("body", addEmergencyCardSchema), addEmergencyCardHandler);
router.post("/emergency-cards/remove", validate("body", addEmergencyCardSchema), removeEmergencyCardHandler);

export default router;
