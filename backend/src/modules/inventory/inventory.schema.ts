import { z } from "zod";

export const createInventoryRecordSchema = z.object({
  productId: z.number().int().positive("invalid product"),
  previousStock: z.number().int(),
  newStock: z.number().int(),
});
