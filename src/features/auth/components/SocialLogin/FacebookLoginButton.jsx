import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signInWithPopup, FacebookAuthProvider } from 'firebase/auth';
import { auth } from '../../../../config/firebase';
import { loginSuccess, loginStart, loginFailure } from '../../../../store/authSlice';
import './SocialLogin.css';

const FacebookLoginButton = ({ onSuccess, onError, disabled }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleFacebookLogin = async () => {
    if (disabled || loading) return;
    
    setLoading(true);
    dispatch(loginStart());
    
    try {
      const provider = new FacebookAuthProvider();
      provider.addScope('email');
      provider.addScope('public_profile');
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        provider: 'facebook',
      };
      
      const token = await user.getIdToken();
      dispatch(loginSuccess({
        user: userData,
        token,
        provider: 'facebook',
      }));
      
      onSuccess?.(userData);
    } catch (error) {
      console.error('Facebook login error:', error);
      dispatch(loginFailure(error.message));
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
        <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
      <span className="social-btn-text">
        {loading ? 'Signing in...' : 'Continue with Facebook'}
      </span>
    </button>
  );
};

export default FacebookLoginButton;
