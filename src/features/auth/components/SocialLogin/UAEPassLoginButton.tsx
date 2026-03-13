import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginStart, loginFailure } from '../../../../store/authSlice';
import './SocialLogin.css';

const UAEPassLoginButton = ({ onSuccess, onError, disabled }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleUAEPassLogin = async () => {
    if (disabled || loading) return;
    
    setLoading(true);
    dispatch(loginStart());
    
    try {
      const response = await fetch('/api/auth/uaepass/initiate');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to initiate UAE Pass login');
      }
      
      if (data.isMobile && data.deepLink) {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = data.deepLink;
        document.body.appendChild(iframe);
        
        setTimeout(() => {
          document.body.removeChild(iframe);
          window.location.href = data.authUrl;
        }, 2000);
      } else {
        window.location.href = data.authUrl;
      }
      
    } catch (error) {
      console.error('UAE Pass login error:', error);
      dispatch(loginFailure(error.message));
      onError?.(error);
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className="social-login-btn uaepass-btn"
      onClick={handleUAEPassLogin}
      disabled={disabled || loading}
      aria-label="Sign in with UAE Pass"
    >
      <svg className="social-icon" viewBox="0 0 24 24" width="20" height="20">
        <circle cx="12" cy="12" r="11" fill="#1B4D3E"/>
        <path 
          fill="#FFFFFF" 
          d="M12 4C9.5 4 7.5 6 7.5 8.5V11H8.5V8.5C8.5 6.6 10.1 5 12 5C13.9 5 15.5 6.6 15.5 8.5V11H16.5V8.5C16.5 6 14.5 4 12 4Z"
        />
        <rect x="6" y="11" width="12" height="9" rx="1" fill="#FFFFFF"/>
        <circle cx="12" cy="15" r="1.5" fill="#1B4D3E"/>
        <path fill="#1B4D3E" d="M11.5 15.5H12.5V18H11.5V15.5Z"/>
      </svg>
      <span className="social-btn-text">
        {loading ? 'Connecting...' : 'Continue with UAE Pass'}
      </span>
    </button>
  );
};

export default UAEPassLoginButton;
