import { z } from "zod";

// Contract 6 — Device Provisioning
export const registerDeviceSchema = z.object({
  device_name: z.string().min(1, "device_name is required"),
  door_name: z.string().min(1, "door_name is required"),
});

// Contract 1 — Heartbeat
export const heartbeatSchema = z.object({
  firmware_version: z.string().min(1),
  door_state: z.enum(["LOCKED", "UNLOCKED"]),
  signal_strength: z.number(),
});

export const updateDeviceSchema = z.object({
  name: z.string().min(1).optional(),
  status: z.enum(["ONLINE", "OFFLINE", "DISABLED"]).optional(),
});

export type RegisterDeviceInput = z.infer<typeof registerDeviceSchema>;
export type HeartbeatInput = z.infer<typeof heartbeatSchema>;
export type UpdateDeviceInput = z.infer<typeof updateDeviceSchema>;
