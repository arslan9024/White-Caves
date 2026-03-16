import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import propertyReducer from './propertySlice';
import userReducer from './userSlice';
import navigationReducer from './navigationSlice';
import dashboardReducer from './dashboardSlice';
import contentReducer from './contentSlice';
import authReducer from './authSlice';
import analyticsReducer from './analyticsSlice';
import featuresReducer from './featuresSlice';
import inventoryReducer from './slices/inventorySlice';
import aiAssistantDashboardReducer from './slices/aiAssistantDashboardSlice';
import sidebarReducer from './slices/sidebarSlice';
import notificationReducer from './slices/notificationSlice';
import whatsappReducer from './slices/whatsappSlice';
import eventBusMiddleware from './middleware/eventBusMiddleware';

// Wrap middleware in error handling
const safeEventBusMiddleware = (store: any) => {
  return (next: (action: Action) => any) => {
    return (action: Action) => {
      try {
        return eventBusMiddleware(store)(next)(action);
      } catch (error) {
        console.error('EventBus Middleware Error:', error);
        return next(action);
      }
    };
  };
};

export const store = configureStore({
  reducer: {
    properties: propertyReducer,
    user: userReducer,
    navigation: navigationReducer,
    dashboard: dashboardReducer,
    content: contentReducer,
    auth: authReducer,
    analytics: analyticsReducer,
    features: featuresReducer,
    inventory: inventoryReducer,
    aiAssistantDashboard: aiAssistantDashboardReducer,
    sidebar: sidebarReducer,
    notifications: notificationReducer,
    whatsapp: whatsappReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignore: ['aiAssistantDashboard', 'analytics']
      },
      immutableStateInvariant: {
        ignoredPaths: ['aiAssistantDashboard.notifications']
      }
    }).concat(safeEventBusMiddleware),
  devTools: true
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// Export hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
