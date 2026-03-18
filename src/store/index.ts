/**
 * White Caves CRM - Redux Store Setup
 * Central state management for the entire application
 */

import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import leadsReducer from './slices/leadsSlice';
import propertiesReducer from './slices/propertiesSlice';
import dashboardReducer from './slices/dashboardSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    leads: leadsReducer,
    properties: propertiesReducer,
    dashboard: dashboardReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/login/fulfilled'],
        ignoredPaths: ['auth.user.createdAt', 'auth.user.updatedAt'],
      },
    }),
  devTools: {
    enabled: process.env.NODE_ENV === 'development',
    trace: true,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
