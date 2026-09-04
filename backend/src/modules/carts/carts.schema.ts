import { z } from "zod";

export const addCartItemSchema = z.object({
  productId: z.number().int().positive("invalid product"),
  quantity: z.number().int().positive("quantity must be at least 1"),
});

export const updateCartQuantitySchema = z.object({
  quantity: z.number().int().positive("quantity must be at least 1"),
});
