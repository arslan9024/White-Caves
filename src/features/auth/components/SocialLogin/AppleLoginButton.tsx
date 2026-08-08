import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signInWithPopup, OAuthProvider } from 'firebase/auth';
import { auth } from '../../../../config/firebase';
import { loginStart, loginFailure } from '../../../../store/authSlice';
import { syncFirebaseUser } from '../../../../services/authService';
import { createLogger } from '../../../../utils/logger';
import { finalizeAuthenticatedSession } from '../../../../utils/authSession';

const log = createLogger('AppleLogin');
import './SocialLogin.css';

interface AppleLoginButtonProps {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
  disabled?: boolean;
}

const AppleLoginButton = ({ onSuccess, onError, disabled }: AppleLoginButtonProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // Hide button when Firebase is not configured
  if (!auth) return null;

  const handleAppleLogin = async () => {
    if (disabled || loading) return;

    setLoading(true);
    dispatch(loginStart());

    try {
      const provider = new OAuthProvider('apple.com');
      provider.addScope('email');
      provider.addScope('name');

      // auth is guaranteed non-null here: the component returns null above when auth === null
      if (!auth) throw new Error('Firebase not initialized');
      const result = await signInWithPopup(auth, provider);

      // Sync with backend to get a proper backend JWT (not a short-lived Firebase token)
      const backendResponse = await syncFirebaseUser(result.user);
      if (!backendResponse?.data?.user) {
        throw new Error('Backend sync failed: missing user data');
      }
      const backendUser = backendResponse.data.user;

      finalizeAuthenticatedSession({
        dispatch,
        user: {
          id: backendUser.id,
          email: backendUser.email,
          name: backendUser.name || undefined,
          role: backendUser.role,
          photoURL: backendUser.photoUrl || undefined,
        } as any,
        token: backendResponse.data.token,
        provider: 'apple',
      });

      onSuccess?.(backendUser);
    } catch (error: unknown) {
      log.error('Apple login error:', error);
      const msg = error instanceof Error ? error.message : 'Apple login failed';
      dispatch(loginFailure(msg));
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className="social-login-btn apple-btn"
      onClick={handleAppleLogin}
      disabled={disabled || loading}
      aria-label="Sign in with Apple"
    >
      <svg className="social-icon" viewBox="0 0 24 24" width="20" height="20">
        <path
          fill="currentColor"
          d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
        />
      </svg>
      <span className="social-btn-text">{loading ? 'Signing in...' : 'Continue with Apple'}</span>
    </button>
  );
};

export default AppleLoginButton;
