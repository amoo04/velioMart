import { z } from "zod";

export const createShippingZoneSchema = z.object({
  name: z.string().min(1, "Name is required"),
  states: z.string().min(1, "States is required"),
  deliveryEstimate: z.string().min(1, "Delivery estimate is required"),
  rate: z.number().int().min(0, "Rate must be positive in cents"),
  sortOrder: z.number().int().min(0).optional(),
});

export const updateShippingZoneSchema = z.object({
  name: z.string().min(1).optional(),
  states: z.string().min(1).optional(),
  deliveryEstimate: z.string().min(1).optional(),
  rate: z.number().int().min(0).optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export const moveShippingZoneSchema = z.object({
  direction: z.enum(["up", "down"]),
});
