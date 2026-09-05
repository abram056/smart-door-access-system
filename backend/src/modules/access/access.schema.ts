import { z } from "zod";

// Contract 2 — Access Request
export const accessRequestSchema = z.object({
  rfid_uid: z.string().min(1, "rfid_uid is required"),
  timestamp: z.string().datetime({ offset: true }),
});

export type AccessRequestInput = z.infer<typeof accessRequestSchema>;
