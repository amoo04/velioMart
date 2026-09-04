import { z } from "zod";

export const createReviewSchema = z.object({
  productId: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional().nullable(),
});

export const updateReviewStatusSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]),
});

export const reviewsQuerySchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  productId: z.coerce.number().int().positive().optional(),
});
