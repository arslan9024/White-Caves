import { describe, it, expect, beforeEach } from 'vitest';
import authReducer, { 
  loginSuccess, 
  logout, 
  setLoading, 
  setError,
  clearError 
} from './authSlice';

describe('authSlice', () => {
  const initialState = {
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

  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toMatchObject({
      user: null,
      token: null,
      session: expect.objectContaining({
        isLoggedIn: false,
      }),
    });
  });

  it('should handle setLoading', () => {
    const state = authReducer(initialState, setLoading(true));
    expect(state.loading).toBe(true);
  });

  it('should handle setError', () => {
    const state = authReducer(initialState, setError('Test error'));
    expect(state.error).toBe('Test error');
    expect(state.loading).toBe(false);
  });

  it('should handle clearError', () => {
    const stateWithError = { ...initialState, error: 'Test error' };
    const state = authReducer(stateWithError, clearError());
    expect(state.error).toBe(null);
  });

  it('should handle loginSuccess with Google provider', () => {
    const user = { uid: '123', email: 'test@example.com' };
    const state = authReducer(
      initialState,
      loginSuccess({ user, token: 'token123', provider: 'google' })
    );
    
    expect(state.user).toEqual(user);
    expect(state.token).toBe('token123');
    expect(state.loginProvider).toBe('google');
    expect(state.loginMethods.social).toBe(true);
    expect(state.loginMethods.email).toBe(false);
    expect(state.session.isLoggedIn).toBe(true);
  });

  it('should handle loginSuccess with email provider', () => {
    const user = { uid: '456', email: 'user@test.com' };
    const state = authReducer(
      initialState,
      loginSuccess({ user, token: 'token456', provider: 'email' })
    );
    
    expect(state.loginProvider).toBe('email');
    expect(state.loginMethods.email).toBe(true);
    expect(state.loginMethods.social).toBe(false);
  });

  it('should handle loginSuccess with phone provider', () => {
    const user = { uid: '789', phoneNumber: '+1234567890' };
    const state = authReducer(
      initialState,
      loginSuccess({ user, token: 'token789', provider: 'phone' })
    );
    
    expect(state.loginProvider).toBe('phone');
    expect(state.loginMethods.mobile).toBe(true);
    expect(state.loginMethods.social).toBe(false);
  });

  it('should handle logout', () => {
    const loggedInState = {
      ...initialState,
      user: { uid: '123' },
      token: 'token123',
      session: {
        isLoggedIn: true,
        activeSessionId: 'session_123',
        sessions: [{ id: 'session_123' }],
      },
    };
    
    const state = authReducer(loggedInState, logout());
    
    expect(state.user).toBe(null);
    expect(state.token).toBe(null);
    expect(state.session.isLoggedIn).toBe(false);
    expect(state.session.sessions).toEqual([]);
  });
});
