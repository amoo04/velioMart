import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional().nullable(),
  price: z.number().int().positive("Price must be positive in cents"),
  stock: z.number().int().min(0).default(0),
  category_id: z.number().int().positive().optional().nullable(),
  image_url: z.string().optional().nullable(),
  brand: z.string().optional().nullable(),
  status: z.string().default("active"),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  price: z.number().int().positive().optional(),
  stock: z.number().int().min(0).optional(),
  category_id: z.number().int().positive().optional().nullable(),
  image_url: z.string().optional().nullable(),
  brand: z.string().optional().nullable(),
  status: z.string().optional(),
});

export const productQuerySchema = z.object({
  categoryId: z.coerce.number().int().positive().optional(),
  status: z.string().optional(),
  search: z.string().optional(),
});
