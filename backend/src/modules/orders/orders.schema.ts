import { z } from "zod";

export const createOrderSchema = z.object({
  shipping_address: z.string().optional(),
  shipping_zone_id: z.number().int().positive().optional(),
});

export const updatePaymentStatusSchema = z.object({
  payment_status: z.string().min(1, "payment status is required"),
  transaction_ref: z.string().optional(),
});

export const updateDeliveryStatusSchema = z.object({
  delivery_status: z.string().min(1, "delivery status is required"),
});

export const orderQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});
