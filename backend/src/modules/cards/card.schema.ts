import { z } from "zod";

export const createCardSchema = z.object({
  uid: z.string().min(1, "uid is required"),
  userId: z.string().uuid("userId must be a valid id"),
});

export const updateCardSchema = z.object({
  status: z.enum(["ACTIVE", "DISABLED", "LOST"]),
});

export const enrollStartSchema = z.object({
  userId: z.string().uuid("userId must be a valid id"),
});

// Contract 4 — what the ESP32 sends to confirm enrollment.
export const enrollConfirmSchema = z.object({
  rfid_uid: z.string().min(1, "rfid_uid is required"),
});

export type CreateCardInput = z.infer<typeof createCardSchema>;
export type UpdateCardInput = z.infer<typeof updateCardSchema>;
export type EnrollStartInput = z.infer<typeof enrollStartSchema>;
export type EnrollConfirmInput = z.infer<typeof enrollConfirmSchema>;
