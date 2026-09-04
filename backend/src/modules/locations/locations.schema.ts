import { z } from "zod";

export const createLocationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required").max(10),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().min(0).optional(),
});

export const updateLocationSchema = z.object({
  name: z.string().min(1).optional(),
  code: z.string().min(1).max(10).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export const moveLocationSchema = z.object({
  direction: z.enum(["up", "down"]),
});
