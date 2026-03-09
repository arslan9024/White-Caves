import { configureStore } from '@reduxjs/toolkit';
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
import eventBusMiddleware from './middleware/eventBusMiddleware';

// Wrap middleware in error handling
const safeEventBusMiddleware = (store) => {
  return (next) => {
    return (action) => {
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
    aiAssistantDashboard: aiAssistantDashboardReducer
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
