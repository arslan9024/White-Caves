import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import propertyReducer from './propertySlice';
import userReducer from './userSlice';
import navigationReducer from './navigationSlice';
import dashboardReducer from './dashboardSlice';
import authReducer from './authSlice';
import analyticsReducer from './analyticsSlice';
import inventoryReducer from './slices/inventorySlice';
import aiAssistantDashboardReducer from './slices/aiAssistantDashboardSlice';
import sidebarReducer from './slices/sidebarSlice';
import notificationReducer from './slices/notificationSlice';
import whatsappReducer from './slices/whatsappSlice';
import nadiaReducer from './slices/nadiaSlice';
import crmDataReducer from './crmDataSlice';
import roleReducer from './roleSlice';
import featuresReducer from './featuresSlice';
import savedSearchesReducer from './slices/savedSearchesSlice';
import eventBusMiddleware from './middleware/eventBusMiddleware';
import { createLogger } from '../utils/logger';

const storeLog = createLogger('Store');

// Wrap middleware in error handling
const safeEventBusMiddleware: import('@reduxjs/toolkit').Middleware = (store) => {
  return (next) => {
    return (action) => {
      try {
        return eventBusMiddleware(store)(next)(action);
      } catch (error) {
        storeLog.error('EventBus Middleware Error:', error);
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
    auth: authReducer,
    analytics: analyticsReducer,
    inventory: inventoryReducer,
    aiAssistantDashboard: aiAssistantDashboardReducer,
    sidebar: sidebarReducer,
    notifications: notificationReducer,
    whatsapp: whatsappReducer,
    nadia: nadiaReducer,
    crmData: crmDataReducer,
    role: roleReducer,
    features: featuresReducer,
    savedSearches: savedSearchesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['aiAssistantDashboard', 'analytics']
      },
      immutableStateInvariant: {
        ignoredPaths: ['aiAssistantDashboard.notifications']
      }
    }).concat(safeEventBusMiddleware),
  devTools: import.meta.env.DEV
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
