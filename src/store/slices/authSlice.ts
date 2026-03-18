/**
 * Auth Redux Slice
 * Manages authentication state, login, logout, 2FA
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState, LoginCredentials, TwoFactorVerification } from '../../types';
import apiClient from '../../services/apiClient';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<{ token: string; user: User }>(
        '/auth/login',
        credentials
      );
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Async thunk for 2FA verification
export const verifyTwoFactor = createAsyncThunk(
  'auth/verify2fa',
  async (verification: TwoFactorVerification, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<{ token: string; user: User }>(
        '/auth/verify-2fa',
        verification
      );
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '2FA verification failed');
    }
  }
);

// Async thunk for getting current user
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<{ user: User }>('/auth/profile');
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        // Note: 2FA will be required before setting isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 2FA
    builder
      .addCase(verifyTwoFactor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyTwoFactor.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(verifyTwoFactor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get current user
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError, setToken } = authSlice.actions;
export default authSlice.reducer;
