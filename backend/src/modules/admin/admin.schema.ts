import { z } from "zod";

// ─── Validation: creating a new admin audit log entry ───
export const createLogSchema = z.object({
  action: z.string().min(1, "action is required"),
});

// ─── Validation: optional query params for dashboard endpoints ───
export const dashboardQuerySchema = z.object({
  threshold: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined))
    .pipe(z.number().int().positive().optional()),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined))
    .pipe(z.number().int().positive().max(100).optional()),
});

// ─── Validation: payment status URL param ───
export const paymentStatusSchema = z.enum([
  "pending",
  "success",
  "failed",
]);

// ─── Validation: promoting/demoting a user's role ───
export const updateUserRoleSchema = z.object({
  role: z.enum(["customer", "admin"]),
});
