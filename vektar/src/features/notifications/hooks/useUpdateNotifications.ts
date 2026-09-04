import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import {
  markNotificationRead,
  markAllNotificationsReadApi,
  deleteNotificationApi,
} from "../api/notifications.api";
import {
  updateNotificationInList,
  markAllNotificationsRead,
  removeNotification,
} from "../slice/notificationsSlice";
import type { AppDispatch } from "../../../store-config/store";

export function useMarkNotificationRead() {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => markNotificationRead(id),
    onSuccess: (notification) => {
      dispatch(updateNotificationInList(notification));
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsReadApi,
    onSuccess: () => {
      dispatch(markAllNotificationsRead());
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useDeleteNotification() {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteNotificationApi(id).then(() => id),
    onSuccess: (id) => {
      dispatch(removeNotification(id));
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
