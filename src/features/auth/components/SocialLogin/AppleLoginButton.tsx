import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signInWithPopup, OAuthProvider } from 'firebase/auth';
import { auth } from '../../../../config/firebase';
import { loginSuccess, loginStart, loginFailure } from '../../../../store/authSlice';
import './SocialLogin.css';

const AppleLoginButton = ({ onSuccess, onError, disabled }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleAppleLogin = async () => {
    if (disabled || loading) return;
    
    setLoading(true);
    dispatch(loginStart());
    
    try {
      const provider = new OAuthProvider('apple.com');
      provider.addScope('email');
      provider.addScope('name');
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        provider: 'apple',
      };
      
      const token = await user.getIdToken();
      dispatch(loginSuccess({
        user: userData,
        token,
        provider: 'apple',
      }));
      
      onSuccess?.(userData);
    } catch (error) {
      console.error('Apple login error:', error);
      dispatch(loginFailure(error.message));
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
        <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
      </svg>
      <span className="social-btn-text">
        {loading ? 'Signing in...' : 'Continue with Apple'}
      </span>
    </button>
  );
};

export default AppleLoginButton;
