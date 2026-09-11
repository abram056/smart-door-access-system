import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import cardRoutes from "./modules/cards/card.routes";
import deviceRoutes from "./modules/devices/device.routes";
import accessRoutes from "./modules/access/access.routes";
import logRoutes from "./modules/logs/log.routes";
import settingsRoutes from "./modules/settings/settings.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/cards", cardRoutes);
router.use("/devices", deviceRoutes);
router.use("/access", accessRoutes); // also owns /access/logs/sync (Contract 3)
router.use("/logs", logRoutes);
router.use("/settings", settingsRoutes);

export default router;
