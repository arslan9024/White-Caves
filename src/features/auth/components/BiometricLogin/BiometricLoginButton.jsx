import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../../../store/userSlice';
import { loginStart, loginFailure, loginSuccess } from '../../../../store/authSlice';
import { 
  isPlatformAuthenticatorAvailable, 
  authenticateWithBiometric,
  hasBiometricCredentials,
  getBiometricSession
} from '../../../../services/webAuthnService';
import './BiometricLogin.css';

const BiometricLoginButton = ({ onSuccess, onError, disabled }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState(false);
  const [hasCredentials, setHasCredentials] = useState(false);

  useEffect(() => {
    const checkAvailability = async () => {
      const platformAvailable = await isPlatformAuthenticatorAvailable();
      setAvailable(platformAvailable);
      setHasCredentials(hasBiometricCredentials());
    };
    checkAvailability();
  }, []);

  const handleBiometricLogin = async () => {
    if (disabled || loading || !available || !hasCredentials) return;
    
    setLoading(true);
    dispatch(loginStart());
    
    try {
      const result = await authenticateWithBiometric();
      
      if (result.success) {
        const sessionData = getBiometricSession();
        if (sessionData && sessionData.user) {
          dispatch(setUser({
            id: sessionData.user.uid,
            email: sessionData.user.email,
            name: sessionData.user.displayName,
            photo: sessionData.user.photoURL,
          }));
          
          dispatch(loginSuccess({
            user: sessionData.user,
            token: sessionData.token,
            provider: 'biometric',
          }));
          
          onSuccess?.(sessionData.user);
          
          const existingRole = localStorage.getItem('userRole');
          if (existingRole) {
            const parsed = JSON.parse(existingRole);
            navigate(`/${parsed.role}/dashboard`);
          } else {
            navigate('/select-role');
          }
        } else {
          throw new Error('Session expired. Please sign in with another method.');
        }
      }
    } catch (error) {
      console.error('Biometric login error:', error);
      dispatch(loginFailure(error.message));
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  if (!available || !hasCredentials) {
    return null;
  }

  return (
    <button
      type="button"
      className="biometric-login-btn"
      onClick={handleBiometricLogin}
      disabled={disabled || loading}
      aria-label="Sign in with Face ID or Touch ID"
    >
      <div className="biometric-icon">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M9 11.75C9 12.99 9.92 14 11.05 14C11.61 14 12.12 13.75 12.5 13.35L13.6 14.45C13.04 15.06 12.22 15.5 11.05 15.5C9.13 15.5 7.55 13.85 7.55 11.75C7.55 9.65 9.13 8 11.05 8C12.22 8 13.04 8.44 13.6 9.05L12.5 10.15C12.12 9.75 11.61 9.5 11.05 9.5C9.92 9.5 9 10.51 9 11.75ZM17 11.75C17 12.99 17.92 14 19.05 14C19.61 14 20.12 13.75 20.5 13.35L21.6 14.45C21.04 15.06 20.22 15.5 19.05 15.5C17.13 15.5 15.55 13.85 15.55 11.75C15.55 9.65 17.13 8 19.05 8C20.22 8 21.04 8.44 21.6 9.05L20.5 10.15C20.12 9.75 19.61 9.5 19.05 9.5C17.92 9.5 17 10.51 17 11.75Z"/>
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"/>
          <path d="M12 17C14.21 17 16 15.21 16 13H14C14 14.1 13.1 15 12 15C10.9 15 10 14.1 10 13H8C8 15.21 9.79 17 12 17Z"/>
        </svg>
      </div>
      <span className="biometric-btn-text">
        {loading ? 'Authenticating...' : 'Sign in with Face ID / Touch ID'}
      </span>
    </button>
  );
};

export default BiometricLoginButton;
