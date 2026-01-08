import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  isPlatformAuthenticatorAvailable, 
  hasBiometricCredentials,
  registerBiometric,
  saveBiometricSession
} from '../../../../services/webAuthnService';
import './BiometricLogin.css';

const PROMPT_SHOWN_KEY = 'biometric_prompt_shown';

const BiometricPrompt = ({ onClose }) => {
  const navigate = useNavigate();
  const user = useSelector(state => state.user?.currentUser);
  const authUser = useSelector(state => state.auth?.user);
  const token = useSelector(state => state.auth?.token);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const checkShouldShow = async () => {
      const currentUser = user || authUser;
      if (!currentUser) return;

      const platformAvailable = await isPlatformAuthenticatorAvailable();
      if (!platformAvailable) return;

      if (hasBiometricCredentials()) return;

      const promptKey = `${PROMPT_SHOWN_KEY}_${currentUser.id || currentUser.uid || currentUser.email}`;
      const shownBefore = sessionStorage.getItem(promptKey);
      
      if (!shownBefore) {
        sessionStorage.setItem(promptKey, 'true');
        setTimeout(() => setShow(true), 1500);
      }
    };

    checkShouldShow();
  }, [user, authUser]);

  const handleSetup = async () => {
    const currentUser = user || authUser;
    if (!currentUser) return;

    setLoading(true);
    setMessage(null);

    try {
      const userId = currentUser.id || currentUser.uid || currentUser.email;
      const result = await registerBiometric(
        userId,
        currentUser.email,
        currentUser.name || currentUser.displayName || currentUser.email
      );

      if (result.success) {
        saveBiometricSession(currentUser, token);
        setMessage({ type: 'success', text: 'Biometric login enabled!' });
        setTimeout(() => {
          setShow(false);
          onClose?.();
        }, 1500);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setShow(false);
    onClose?.();
  };

  const handleGoToSettings = () => {
    setShow(false);
    navigate('/profile?tab=security');
  };

  if (!show) return null;

  return (
    <div className="biometric-prompt-overlay">
      <div className="biometric-prompt-modal">
        <button className="prompt-close" onClick={handleDismiss} aria-label="Close">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>

        <div className="prompt-icon">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
            <path d="M9 11.75C9 12.99 9.92 14 11.05 14C11.61 14 12.12 13.75 12.5 13.35L13.6 14.45C13.04 15.06 12.22 15.5 11.05 15.5C9.13 15.5 7.55 13.85 7.55 11.75C7.55 9.65 9.13 8 11.05 8C12.22 8 13.04 8.44 13.6 9.05L12.5 10.15C12.12 9.75 11.61 9.5 11.05 9.5C9.92 9.5 9 10.51 9 11.75ZM17 11.75C17 12.99 17.92 14 19.05 14C19.61 14 20.12 13.75 20.5 13.35L21.6 14.45C21.04 15.06 20.22 15.5 19.05 15.5C17.13 15.5 15.55 13.85 15.55 11.75C15.55 9.65 17.13 8 19.05 8C20.22 8 21.04 8.44 21.6 9.05L20.5 10.15C20.12 9.75 19.61 9.5 19.05 9.5C17.92 9.5 17 10.51 17 11.75Z"/>
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"/>
            <path d="M12 17C14.21 17 16 15.21 16 13H14C14 14.1 13.1 15 12 15C10.9 15 10 14.1 10 13H8C8 15.21 9.79 17 12 17Z"/>
          </svg>
        </div>

        <h2>Enable Quick Login</h2>
        <p>Use Face ID or Touch ID to sign in instantly next time</p>

        {message && (
          <div className={`prompt-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="prompt-actions">
          <button 
            className="btn btn-primary"
            onClick={handleSetup}
            disabled={loading}
          >
            {loading ? 'Setting up...' : 'Enable Now'}
          </button>
          <button 
            className="btn btn-secondary"
            onClick={handleGoToSettings}
          >
            Set Up Later in Settings
          </button>
          <button 
            className="btn btn-ghost"
            onClick={handleDismiss}
          >
            Skip for Now
          </button>
        </div>

        <p className="prompt-hint">
          Your biometric data stays on your device and is never shared
        </p>
      </div>
    </div>
  );
};

export default BiometricPrompt;
