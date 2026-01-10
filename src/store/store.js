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
import leadsReducer from './slices/leadsSlice';
import aiAssistantDashboardReducer from './slices/aiAssistantDashboardSlice';
import featuredReducer from './slices/featuredSlice';
import appReducer from './appSlice';
import navigationUIReducer from './slices/navigationUISlice';
import accessControlReducer from './slices/accessControlSlice';
import dashboardViewReducer from './slices/dashboardViewSlice';
import eventBusMiddleware from './middleware/eventBusMiddleware';

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
    leads: leadsReducer,
    aiAssistantDashboard: aiAssistantDashboardReducer,
    featured: featuredReducer,
    app: appReducer,
    navigationUI: navigationUIReducer,
    accessControl: accessControlReducer,
    dashboardView: dashboardViewReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(eventBusMiddleware)
});
