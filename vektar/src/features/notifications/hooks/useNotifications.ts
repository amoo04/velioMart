import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { fetchNotifications } from "../api/notifications.api";
import { setNotifications } from "../slice/notificationsSlice";
import type { AppDispatch } from "../../../store-config/store";
import type { Notification } from "../slice/notificationsSlice";

export type { Notification };

export function useNotificationsQuery() {
  const dispatch = useDispatch<AppDispatch>();

  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  });

  useEffect(() => {
    if (query.data) dispatch(setNotifications(query.data));
  }, [query.data, dispatch]);

  return query;
}
