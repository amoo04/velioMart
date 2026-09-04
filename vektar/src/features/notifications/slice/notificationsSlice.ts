import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationsState {
  list: Notification[];
}

const initialState: NotificationsState = {
  list: [],
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.list = action.payload;
    },
    updateNotificationInList: (state, action: PayloadAction<Notification>) => {
      const index = state.list.findIndex((n) => n.id === action.payload.id);
      if (index >= 0) {
        state.list[index] = action.payload;
      }
    },
    markAllNotificationsRead: (state) => {
      state.list.forEach((n) => {
        n.is_read = true;
      });
    },
    removeNotification: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter((n) => n.id !== action.payload);
    },
    clearNotifications: () => initialState,
  },
});

export const {
  setNotifications,
  updateNotificationInList,
  markAllNotificationsRead,
  removeNotification,
  clearNotifications,
} = notificationsSlice.actions;
export default notificationsSlice.reducer;
