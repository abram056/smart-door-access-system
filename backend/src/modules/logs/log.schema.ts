import { z } from "zod";

export const logSyncSchema = z.object({
  logs: z.array(
    z.object({
      rfid_uid: z.string().min(1),
      timestamp: z.string().datetime(),
      result: z.enum(["GRANTED", "DENIED"]),
      reason: z.enum([
        "AUTHORIZED",
        "UNKNOWN_CARD",
        "NO_PERMISSION",
        "USER_DISABLED",
        "DEVICE_DISABLED",
        "OFFLINE_CACHE",
        "SYSTEM_ERROR",
      ]),
    })
  ),
});

export const listLogsQuerySchema = z.object({
  search: z.string().optional(),
  userId: z.string().uuid().optional(),
  doorId: z.string().uuid().optional(),
  deviceId: z.string().uuid().optional(),
  result: z.enum(["GRANTED", "DENIED"]).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});
