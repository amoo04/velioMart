import { notificationsRepository } from "./notification.repository";

export const notificationsService = {
  async getUserNotifications(userId: string) {
    const id = Number(userId);
    return notificationsRepository.findByUserId(id);
  },

  async getNotification(userId: string, notificationId: number) {
    const id = Number(userId);
    const notification = await notificationsRepository.findById(notificationId);
    if (!notification) {
      throw new Error("Notification not found");
    }
    if (notification.user_id !== id) {
      throw new Error("Unauthorized");
    }
    return notification;
  },

  async markAsRead(userId: string, notificationId: number) {
    const id = Number(userId);
    const notification = await notificationsRepository.findById(notificationId);
    if (!notification) {
      throw new Error("Notification not found");
    }
    if (notification.user_id !== id) {
      throw new Error("Unauthorized");
    }
    return notificationsRepository.markAsRead(notificationId);
  },

  async markAllAsRead(userId: string) {
    const id = Number(userId);
    return notificationsRepository.markAllAsRead(id);
  },

  async deleteNotification(userId: string, notificationId: number) {
    const id = Number(userId);
    const notification = await notificationsRepository.findById(notificationId);
    if (!notification) {
      throw new Error("Notification not found");
    }
    if (notification.user_id !== id) {
      throw new Error("Unauthorized");
    }
    return notificationsRepository.delete(notificationId);
  },

  async createNotification(
    userId: number,
    title: string,
    message: string,
  ) {
    return notificationsRepository.create({
      userId,
      title,
      message,
    });
  },
};
