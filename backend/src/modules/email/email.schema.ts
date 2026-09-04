import { z } from "zod";

export const sendEmailSchema = z.object({
  to: z.string().email("invalid email"),
  subject: z.string().min(1, "subject is required"),
  body: z.string().min(1, "body is required"),
});
