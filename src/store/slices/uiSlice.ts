import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  unreadNotifications: number;
  sidebarOpen: boolean;
  theme: 'dark' | 'light';
}

const initialState: UIState = {
  unreadNotifications: 3,
  sidebarOpen: true,
  theme: 'dark',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setUnreadNotifications: (state, action: PayloadAction<number>) => {
      state.unreadNotifications = action.payload;
    },
    clearNotifications: (state) => {
      state.unreadNotifications = 0;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
});

export const { setUnreadNotifications, clearNotifications, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;
