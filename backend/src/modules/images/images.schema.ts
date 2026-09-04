import { z } from "zod";

export const uploadImageSchema = z.object({
  filename: z.string().min(1, "filename is required"),
});
