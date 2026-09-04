import { z } from "zod";

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/avif",
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const updateMediaSchema = z.object({
  altText: z.string().optional().nullable(),
  tags: z.string().optional().nullable(),
});

export const mediaQuerySchema = z.object({
  search: z.string().optional(),
});
