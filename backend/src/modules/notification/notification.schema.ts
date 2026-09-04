import { z } from "zod";

export const createNotificationSchema = z.object({
  title: z.string().min(1, "title is required"),
  message: z.string().min(1, "message is required"),
  userId: z.number().int().positive().optional(),
});

export const notificationQuerySchema = z.object({
  is_read: z.string().optional(),
});
