import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginStart, loginFailure } from '../../../../store/authSlice';
import './SocialLogin.css';

const LinkedInLoginButton = ({ onSuccess, onError, disabled }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleLinkedInLogin = async () => {
    if (disabled || loading) return;
    
    setLoading(true);
    dispatch(loginStart());
    
    try {
      const response = await fetch('/api/auth/linkedin/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to initialize LinkedIn login');
      }
      
      const { authUrl, state } = await response.json();
      sessionStorage.setItem('linkedin_auth_state', state);
      window.location.href = authUrl;
    } catch (error) {
      console.error('LinkedIn login error:', error);
      dispatch(loginFailure(error.message));
      onError?.(error);
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className="social-login-btn linkedin-btn"
      onClick={handleLinkedInLogin}
      disabled={disabled || loading}
      aria-label="Sign in with LinkedIn"
    >
      <svg className="social-icon" viewBox="0 0 24 24" width="20" height="20">
        <path fill="#0A66C2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
      <span className="social-btn-text">
        {loading ? 'Signing in...' : 'Continue with LinkedIn'}
      </span>
    </button>
  );
};

export default LinkedInLoginButton;
