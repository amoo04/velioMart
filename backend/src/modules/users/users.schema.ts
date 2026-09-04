import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const userQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});
