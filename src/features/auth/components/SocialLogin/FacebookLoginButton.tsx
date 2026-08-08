import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signInWithPopup, FacebookAuthProvider } from 'firebase/auth';
import { auth } from '../../../../config/firebase';
import { loginStart, loginFailure } from '../../../../store/authSlice';
import { syncFirebaseUser } from '../../../../services/authService';
import { createLogger } from '../../../../utils/logger';
import { finalizeAuthenticatedSession } from '../../../../utils/authSession';

const log = createLogger('FacebookLogin');
import './SocialLogin.css';

interface FacebookLoginButtonProps {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
  disabled?: boolean;
}

const FacebookLoginButton = ({ onSuccess, onError, disabled }: FacebookLoginButtonProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // Hide button when Firebase is not configured
  if (!auth) return null;

  const handleFacebookLogin = async () => {
    if (disabled || loading) return;

    setLoading(true);
    dispatch(loginStart());

    try {
      const provider = new FacebookAuthProvider();
      provider.addScope('email');
      provider.addScope('public_profile');

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
        provider: 'facebook',
      });

      onSuccess?.(backendUser);
    } catch (error: unknown) {
      log.error('Facebook login error:', error);
      const msg = error instanceof Error ? error.message : 'Facebook login failed';
      dispatch(loginFailure(msg));
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className="social-login-btn facebook-btn"
      onClick={handleFacebookLogin}
      disabled={disabled || loading}
      aria-label="Sign in with Facebook"
    >
      <svg className="social-icon" viewBox="0 0 24 24" width="20" height="20">
        <path
          fill="#1877F2"
          d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
        />
      </svg>
      <span className="social-btn-text">
        {loading ? 'Signing in...' : 'Continue with Facebook'}
      </span>
    </button>
  );
};

export default FacebookLoginButton;
