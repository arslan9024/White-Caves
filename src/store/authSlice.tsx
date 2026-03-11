import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

interface UserSession {
  id: string;
  device: string;
  browser: string;
  loggedInAt: string;
  lastActive: string;
  ip: string | null;
  location: string | null;
  isCurrent: boolean;
}

interface SessionData {
  isLoggedIn: boolean;
  lastActive: string | null;
  sessions: UserSession[];
  expiresAt: string | null;
  activeSessionId: string | null;
}

interface LoginMethods {
  social: boolean;
  email: boolean;
  mobile: boolean;
}

interface AuthState {
  user: any | null;
  token: string | null;
  refreshToken: string | null;
  session: SessionData;
  loginMethods: LoginMethods;
  loginProvider: string | null;
  rememberMe: boolean;
  sessionTimeout: number;
  loading: boolean;
  error: string | null;
}

const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const detectDevice = (): string => {
  if (typeof navigator === 'undefined') return 'Unknown';
  const ua = navigator.userAgent || '';
  if (/mobile/i.test(ua)) return 'Mobile';
  if (/tablet/i.test(ua)) return 'Tablet';
  return 'Desktop';
};

const detectBrowser = (): string => {
  if (typeof navigator === 'undefined') return 'Unknown';
  const ua = navigator.userAgent || '';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  return 'Unknown';
};

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  session: {
    isLoggedIn: false,
    lastActive: null,
    sessions: [],
    expiresAt: null,
    activeSessionId: null,
  },
  loginMethods: {
    social: false,
    email: false,
    mobile: false,
  },
  loginProvider: null,
  rememberMe: false,
  sessionTimeout: 30,
  loading: false,
  error: null,
};

interface LoginSuccessPayload {
  user: any;
  token?: string;
  refreshToken?: string;
  provider?: string;
  rememberMe?: boolean;
}

interface RefreshSessionPayload {
  token: string;
  refreshToken?: string;
  expiresAt?: string;
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    loginSuccess: (state, action: PayloadAction<LoginSuccessPayload>) => {
      const { user, token, refreshToken, provider, rememberMe } = action.payload;
      const sessionId = generateSessionId();
      const now = new Date().toISOString();
      const expiresAt = new Date(Date.now() + state.sessionTimeout * 60 * 1000).toISOString();
      
      state.user = user;
      state.token = token || null;
      state.refreshToken = refreshToken || null;
      state.loginProvider = provider || 'unknown';
      state.rememberMe = rememberMe || false;
      
      state.session = {
        isLoggedIn: true,
        lastActive: now,
        expiresAt,
        activeSessionId: sessionId,
        sessions: [
          ...state.session.sessions.filter(s => s.id !== sessionId),
          {
            id: sessionId,
            device: detectDevice(),
            browser: detectBrowser(),
            loggedInAt: now,
            lastActive: now,
            ip: null,
            location: null,
            isCurrent: true,
          }
        ],
      };
      
      state.loginMethods = {
        social: ['google', 'facebook', 'apple', 'linkedin'].includes(provider || ''),
        email: provider === 'email',
        mobile: provider === 'phone',
      };
      
      state.loading = false;
      state.error = null;
    },
    logout: (state, action: PayloadAction<{ sessionId?: string } | undefined>) => {
      const sessionId = action?.payload?.sessionId;
      
      if (sessionId && sessionId !== state.session.activeSessionId) {
        state.session.sessions = state.session.sessions.filter(s => s.id !== sessionId);
      } else {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.loginProvider = null;
        state.session = {
          isLoggedIn: false,
          lastActive: null,
          sessions: [],
          expiresAt: null,
          activeSessionId: null,
        };
        state.loginMethods = {
          social: false,
          email: false,
          mobile: false,
        };
      }
    },
    logoutAllSessions: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.loginProvider = null;
      state.session = {
        isLoggedIn: false,
        lastActive: null,
        sessions: [],
        expiresAt: null,
        activeSessionId: null,
      };
      state.loginMethods = {
        social: false,
        email: false,
        mobile: false,
      };
    },
    updateLastActivity: (state) => {
      const now = new Date().toISOString();
      state.session.lastActive = now;
      
      const sessionIndex = state.session.sessions.findIndex(
        s => s.id === state.session.activeSessionId
      );
      if (sessionIndex !== -1) {
        state.session.sessions[sessionIndex].lastActive = now;
      }
    },
    refreshSession: (state, action: PayloadAction<RefreshSessionPayload>) => {
      const { token, refreshToken, expiresAt } = action.payload;
      state.token = token;
      state.refreshToken = refreshToken || state.refreshToken;
      state.session.expiresAt = expiresAt || new Date(Date.now() + state.sessionTimeout * 60 * 1000).toISOString();
      state.session.lastActive = new Date().toISOString();
    },
    checkSessionTimeout: (state) => {
      if (!state.session.isLoggedIn) return;
      
      const now = Date.now();
      const lastActive = new Date(state.session.lastActive || '').getTime();
      const timeoutMs = state.sessionTimeout * 60 * 1000;
      
      if (now - lastActive > timeoutMs) {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.session.isLoggedIn = false;
        state.session.activeSessionId = null;
      }
    },
    setSessionTimeout: (state, action: PayloadAction<number>) => {
      state.sessionTimeout = action.payload;
    },
    updateUserProfile: (state, action: PayloadAction<any>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setRememberMe: (state, action: PayloadAction<boolean>) => {
      state.rememberMe = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  loginStart,
  loginFailure,
  loginSuccess,
  logout,
  logoutAllSessions,
  updateLastActivity,
  refreshSession,
  checkSessionTimeout,
  setSessionTimeout,
  updateUserProfile,
  setRememberMe,
} = authSlice.actions;

// Selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsLoggedIn = (state: RootState) => state.auth.session.isLoggedIn;
export const selectSessions = (state: RootState) => state.auth.session.sessions;
export const selectLoginProvider = (state: RootState) => state.auth.loginProvider;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
