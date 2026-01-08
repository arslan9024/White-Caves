import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  isPlatformAuthenticatorAvailable, 
  registerBiometric,
  getBiometricCredentials,
  removeCredential,
  saveBiometricSession
} from '../../../../services/webAuthnService';
import './BiometricLogin.css';

const BiometricSetup = () => {
  const user = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.token);
  const [available, setAvailable] = useState(false);
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const checkAvailability = async () => {
      const platformAvailable = await isPlatformAuthenticatorAvailable();
      setAvailable(platformAvailable);
      setCredentials(getBiometricCredentials());
    };
    checkAvailability();
  }, []);

  const handleSetup = async () => {
    if (!user) {
      setMessage({ type: 'error', text: 'Please sign in first' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await registerBiometric(
        user.uid || user.email,
        user.email,
        user.displayName || user.email
      );

      if (result.success) {
        saveBiometricSession(user, token);
        setCredentials(getBiometricCredentials());
        setMessage({ type: 'success', text: 'Biometric login enabled successfully!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (credentialId) => {
    removeCredential(credentialId);
    setCredentials(getBiometricCredentials());
    setMessage({ type: 'success', text: 'Biometric credential removed' });
  };

  if (!available) {
    return (
      <div className="biometric-setup-card">
        <div className="biometric-setup-header">
          <div className="biometric-setup-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 1C8.14 1 5 4.14 5 8v2H3v10h18V10h-2V8c0-3.86-3.14-7-7-7zm0 2c2.76 0 5 2.24 5 5v2H7V8c0-2.76 2.24-5 5-5zm-7 9h14v6H5v-6z"/>
            </svg>
          </div>
          <div className="biometric-setup-title">
            <h3>Biometric Login</h3>
            <p>Not available on this device</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="biometric-setup-card">
      <div className="biometric-setup-header">
        <div className="biometric-setup-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M9 11.75C9 12.99 9.92 14 11.05 14C11.61 14 12.12 13.75 12.5 13.35L13.6 14.45C13.04 15.06 12.22 15.5 11.05 15.5C9.13 15.5 7.55 13.85 7.55 11.75C7.55 9.65 9.13 8 11.05 8C12.22 8 13.04 8.44 13.6 9.05L12.5 10.15C12.12 9.75 11.61 9.5 11.05 9.5C9.92 9.5 9 10.51 9 11.75ZM17 11.75C17 12.99 17.92 14 19.05 14C19.61 14 20.12 13.75 20.5 13.35L21.6 14.45C21.04 15.06 20.22 15.5 19.05 15.5C17.13 15.5 15.55 13.85 15.55 11.75C15.55 9.65 17.13 8 19.05 8C20.22 8 21.04 8.44 21.6 9.05L20.5 10.15C20.12 9.75 19.61 9.5 19.05 9.5C17.92 9.5 17 10.51 17 11.75Z"/>
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"/>
            <path d="M12 17C14.21 17 16 15.21 16 13H14C14 14.1 13.1 15 12 15C10.9 15 10 14.1 10 13H8C8 15.21 9.79 17 12 17Z"/>
          </svg>
        </div>
        <div className="biometric-setup-title">
          <h3>Face ID / Touch ID</h3>
          <p>Sign in quickly using your device's biometric authentication</p>
        </div>
      </div>

      {message && (
        <div className={`biometric-message ${message.type}`}>
          {message.text}
        </div>
      )}

      {credentials.length === 0 ? (
        <div className="biometric-setup-actions">
          <button 
            className="biometric-setup-btn primary"
            onClick={handleSetup}
            disabled={loading || !user}
          >
            {loading ? 'Setting up...' : 'Enable Biometric Login'}
          </button>
        </div>
      ) : (
        <div className="biometric-credential-list">
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            Registered devices:
          </p>
          {credentials.map(cred => (
            <div key={cred.id} className="biometric-credential-item">
              <div className="biometric-credential-info">
                <div className="biometric-credential-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28zM3.5 9.72c-.1 0-.2-.03-.29-.09-.23-.16-.28-.47-.12-.7.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25.16.22.11.54-.12.7-.23.16-.54.11-.7-.12-.9-1.26-2.04-2.25-3.39-2.94-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.96-.08.14-.23.21-.39.21zm6.25 12.07c-.13 0-.26-.05-.35-.15-.87-.87-1.34-1.43-2.01-2.64-.69-1.23-1.05-2.73-1.05-4.34 0-2.97 2.54-5.39 5.66-5.39s5.66 2.42 5.66 5.39c0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-2.42-2.09-4.39-4.66-4.39-2.57 0-4.66 1.97-4.66 4.39 0 1.44.32 2.77.93 3.85.64 1.15 1.08 1.64 1.85 2.42.19.2.19.51 0 .71-.11.1-.24.15-.37.15zm7.17-1.85c-1.19 0-2.24-.3-3.1-.89-1.49-1.01-2.38-2.65-2.38-4.39 0-.28.22-.5.5-.5s.5.22.5.5c0 1.41.72 2.74 1.94 3.56.71.48 1.54.71 2.54.71.24 0 .64-.03 1.04-.1.27-.05.53.13.58.41.05.27-.13.53-.41.58-.57.11-1.07.12-1.21.12zM14.91 22c-.04 0-.09-.01-.13-.02-1.59-.44-2.63-1.03-3.72-2.1-1.4-1.39-2.17-3.24-2.17-5.22 0-1.62 1.38-2.94 3.08-2.94 1.7 0 3.08 1.32 3.08 2.94 0 1.07.93 1.94 2.08 1.94s2.08-.87 2.08-1.94c0-3.77-3.25-6.83-7.25-6.83-2.84 0-5.44 1.58-6.61 4.03-.39.81-.59 1.76-.59 2.8 0 .78.07 2.01.67 3.61.1.26-.03.55-.29.64-.26.1-.55-.04-.64-.29-.49-1.31-.73-2.61-.73-3.96 0-1.2.23-2.29.68-3.24 1.33-2.79 4.28-4.6 7.51-4.6 4.55 0 8.25 3.51 8.25 7.83 0 1.62-1.38 2.94-3.08 2.94s-3.08-1.32-3.08-2.94c0-1.07-.93-1.94-2.08-1.94s-2.08.87-2.08 1.94c0 1.71.66 3.31 1.87 4.51.95.94 1.86 1.46 3.27 1.85.27.07.42.35.35.61-.05.23-.26.38-.47.38z"/>
                  </svg>
                </div>
                <div className="biometric-credential-details">
                  <h4>This Device</h4>
                  <span>Added {new Date(cred.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <button 
                className="biometric-remove-btn"
                onClick={() => handleRemove(cred.id)}
              >
                Remove
              </button>
            </div>
          ))}
          <button 
            className="biometric-setup-btn secondary"
            onClick={handleSetup}
            disabled={loading}
            style={{ marginTop: '12px' }}
          >
            {loading ? 'Adding...' : 'Add Another Device'}
          </button>
        </div>
      )}
    </div>
  );
};

export default BiometricSetup;
