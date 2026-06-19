import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { logout } from './authSlice';
import type { RootState } from './store';

/** Represents an authenticated user in the system */
export interface AppUser {
  id: string;
  uid?: string;
  email: string;
  name?: string;
  displayName?: string;
  role?: string;
  photoURL?: string;
  phone?: string;
  createdAt?: string;
  lastLogin?: string;
  status?: 'active' | 'pending' | 'suspended';
  permissions?: string[];
  profileCompleted?: boolean;
  profileCompletion?: {
    roleCategory: 'general' | 'client' | 'agent' | 'leadership';
    requiredFields: Array<'name' | 'phone' | 'department'>;
    optionalFields: Array<'name' | 'phone' | 'department'>;
    missingFields: Array<'name' | 'phone' | 'department'>;
  };
  [key: string]: unknown; // Allow Firebase/provider extra fields
}

interface UserState {
  currentUser: AppUser | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  isLoading: false,
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AppUser | null>) => {
      state.currentUser = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearUser: state => {
      state.currentUser = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(logout, () => initialState);
  },
});

export const { setUser, setLoading, setError, clearUser } = userSlice.actions;

// Selectors
export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const selectUserLoading = (state: RootState) => state.user.isLoading;

// NOTE: selectUserError removed — unused. Re-add if needed.

export default userSlice.reducer;
