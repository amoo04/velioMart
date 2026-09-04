import { apiGet, apiPatch, apiDelete } from "../../../lib/api";
import type { Notification } from "../slice/notificationsSlice";

export async function fetchNotifications(): Promise<Notification[]> {
  const res = await apiGet<Notification[]>("/api/notifications");
  if (res.error) throw new Error(res.error);
  return res.data ?? [];
}

export async function markNotificationRead(id: number): Promise<Notification> {
  const res = await apiPatch<Notification>(`/api/notifications/${id}/read`);
  if (res.error) throw new Error(res.error);
  return res.data!;
}

export async function markAllNotificationsReadApi(): Promise<void> {
  const res = await apiPatch("/api/notifications/read-all");
  if (res.error) throw new Error(res.error);
}

export async function deleteNotificationApi(id: number): Promise<void> {
  const res = await apiDelete(`/api/notifications/${id}`);
  if (res.error) throw new Error(res.error);
}
