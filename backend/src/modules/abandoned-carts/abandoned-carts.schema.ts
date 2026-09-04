import { z } from "zod";

export const abandonedCartsQuerySchema = z.object({
  thresholdHours: z.coerce.number().int().positive().optional(),
});

export const processRemindersSchema = z.object({
  thresholdHours: z.number().int().positive().optional(),
});
