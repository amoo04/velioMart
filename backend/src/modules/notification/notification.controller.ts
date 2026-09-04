import type { Context } from "hono";
import { notificationsService } from "./notification.service";
import { createNotificationSchema } from "./notification.schema";
import type { ResolvedUser } from "../../middleware/resolve-user";

export const notificationsController = {
  async getUserNotifications(c: Context) {
    try {
      const user = c.get("user") as ResolvedUser;
      const notifications = await notificationsService.getUserNotifications(String(user.id));
      return c.json(notifications, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async getNotification(c: Context) {
    try {
      const user = c.get("user") as ResolvedUser;
      const id = Number(c.req.param("id"));
      const notification = await notificationsService.getNotification(String(user.id), id);
      return c.json(notification, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async createNotification(c: Context) {
    try {
      const user = c.get("user") as ResolvedUser;
      const body = await c.req.json();
      const parsed = createNotificationSchema.safeParse(body);
      if (!parsed.success) {
        return c.json({ error: parsed.error.issues }, 400);
      }
      const targetUserId = parsed.data.userId ?? user.id;
      const notification = await notificationsService.createNotification(
        targetUserId,
        parsed.data.title,
        parsed.data.message,
      );
      return c.json(notification, 201);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async markAsRead(c: Context) {
    try {
      const user = c.get("user") as ResolvedUser;
      const id = Number(c.req.param("id"));
      const notification = await notificationsService.markAsRead(String(user.id), id);
      return c.json(notification, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async markAllAsRead(c: Context) {
    try {
      const user = c.get("user") as ResolvedUser;
      await notificationsService.markAllAsRead(String(user.id));
      return c.json({ message: "All notifications marked as read" }, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async deleteNotification(c: Context) {
    try {
      const user = c.get("user") as ResolvedUser;
      const id = Number(c.req.param("id"));
      const notification = await notificationsService.deleteNotification(String(user.id), id);
      return c.json(notification, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },
};
