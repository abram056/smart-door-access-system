import { z } from "zod";

export const updateSettingsSchema = z.object({
  heartbeat_interval: z.number().int().min(10).max(3600).optional(),
  unlock_duration: z.number().int().min(1).max(30).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

export const addEmergencyCardSchema = z.object({
  uid: z.string().min(1, "uid is required"),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type AddEmergencyCardInput = z.infer<typeof addEmergencyCardSchema>;
