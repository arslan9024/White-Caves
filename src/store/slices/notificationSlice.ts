import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { logout } from '../authSlice';

// ─── Types ──────────────────────────────────────────────────────────────
export interface AppNotification {
  id: number;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  duration: number;
  createdAt: number;
}

interface NotificationState {
  notifications: AppNotification[];
}

interface AddNotificationPayload {
  type?: AppNotification['type'];
  title: string;
  message: string;
  duration?: number;
}

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<AddNotificationPayload>) => {
      const id = Date.now() + Math.random();
      state.notifications.push({
        id,
        type: action.payload.type || 'info',
        title: action.payload.title,
        message: action.payload.message,
        duration: action.payload.duration || 3000,
        createdAt: new Date().getTime(),
      });
    },
    removeNotification: (state, action: PayloadAction<number>) => {
      state.notifications = state.notifications.filter(
        notif => notif.id !== action.payload
      );
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const {
  addNotification,
  removeNotification,
  clearAllNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
