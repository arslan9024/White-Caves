
import { configureStore } from '@reduxjs/toolkit';
import propertyReducer from './propertySlice';
import userReducer from './userSlice';
import navigationReducer from './navigationSlice';
import dashboardReducer from './dashboardSlice';

export const store = configureStore({
  reducer: {
    properties: propertyReducer,
    user: userReducer,
    navigation: navigationReducer,
    dashboard: dashboardReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});
