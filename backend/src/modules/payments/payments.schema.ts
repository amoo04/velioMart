import { z } from "zod";

export const createPaymentSchema = z.object({
  order_id: z.number().int().positive("invalid order"),
  payment_method: z.string().optional(),
});

export const updatePaymentStatusSchema = z.object({
  payment_status: z.string().min(1, "payment status is required"),
  transaction_ref: z.string().optional(),
});
