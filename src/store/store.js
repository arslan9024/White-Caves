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
import aiAssistantsReducer from './slices/aiAssistantsSlice';

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
    aiAssistants: aiAssistantsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});
