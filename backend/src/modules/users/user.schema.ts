import { z } from "zod";

export const createUserSchema = z.object({
  fullName: z.string().min(1, "fullName is required"),
  email: z.string().email().optional(),
  role: z.string().min(1).default("STAFF"),
});

export const updateUserSchema = z.object({
  fullName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: z.string().min(1).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const listUsersQuerySchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
