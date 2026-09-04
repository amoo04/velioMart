import { db } from "../../db";
import { notifications } from "../../db/schema";
import { eq, and } from "drizzle-orm";

export type CreateNotificationInput = {
  userId: number;
  title: string;
  message: string;
};

export type UpdateNotificationInput = {
  title?: string;
  message?: string;
  is_read?: boolean;
};

export const notificationsRepository = {
  async findByUserId(userId: number) {
    try {
      const result = await db
        .select()
        .from(notifications)
        .where(eq(notifications.user_id, userId));
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch notifications: ${error}`);
    }
  },

  async findById(id: number) {
    try {
      const result = await db
        .select()
        .from(notifications)
        .where(eq(notifications.id, id))
        .limit(1);
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to find notification: ${error}`);
    }
  },

  async create(data: CreateNotificationInput) {
    try {
      const result = await db
        .insert(notifications)
        .values({
          user_id: data.userId,
          title: data.title,
          message: data.message,
        })
        .returning();
      return result[0];
    } catch (error) {
      throw new Error(`Failed to create notification: ${error}`);
    }
  },

  async markAsRead(id: number) {
    try {
      const result = await db
        .update(notifications)
        .set({ is_read: true })
        .where(eq(notifications.id, id))
        .returning();
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to mark notification as read: ${error}`);
    }
  },

  async markAllAsRead(userId: number) {
    try {
      await db
        .update(notifications)
        .set({ is_read: true })
        .where(and(eq(notifications.user_id, userId), eq(notifications.is_read, false)));
    } catch (error) {
      throw new Error(`Failed to mark all notifications as read: ${error}`);
    }
  },

  async delete(id: number) {
    try {
      const result = await db
        .delete(notifications)
        .where(eq(notifications.id, id))
        .returning();
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to delete notification: ${error}`);
    }
  },
};
