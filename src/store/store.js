
import { configureStore } from '@reduxjs/toolkit';
import propertyReducer from './propertySlice';
import userReducer from './userSlice';
import navigationReducer from './navigationSlice';
import dashboardReducer from './dashboardSlice';
import contentReducer from './contentSlice';

export const store = configureStore({
  reducer: {
    properties: propertyReducer,
    user: userReducer,
    navigation: navigationReducer,
    dashboard: dashboardReducer,
    content: contentReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});
