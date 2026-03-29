import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../store/store';
import { Link } from 'react-router-dom';
import { 
  isPlatformAuthenticatorAvailable, 
  hasBiometricCredentials 
} from '../../../../services/webAuthnService';
import './BiometricLogin.css';
import { safeStorage } from '../../../../utils/safeStorage';

const REMINDER_DISMISSED_KEY = 'biometric_reminder_dismissed';

interface BiometricReminderProps {
  variant?: 'banner' | 'card' | 'inline' | 'compact';
}

const BiometricReminder = ({ variant = 'banner' }: BiometricReminderProps) => {
  const user = useSelector((state: RootState) => state.user?.currentUser);
  const [show, setShow] = useState(false);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      if (!user) {
        setShow(false);
        return;
      }

      const platformAvailable = await isPlatformAuthenticatorAvailable();
      setAvailable(platformAvailable);

      if (!platformAvailable) {
        setShow(false);
        return;
      }

      if (hasBiometricCredentials()) {
        setShow(false);
        return;
      }

      const dismissedKey = `${REMINDER_DISMISSED_KEY}_${user.id || user.email}`;
      const dismissed = safeStorage.get(dismissedKey);
      
      if (dismissed) {
        const dismissedDate = new Date(dismissed);
        if (!isNaN(dismissedDate.getTime())) {
          const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
          if (daysSinceDismissed < 7) {
            setShow(false);
            return;
          }
        }
      }

      setShow(true);
    };

    checkStatus();
  }, [user]);

  const handleDismiss = () => {
    if (user) {
      const dismissedKey = `${REMINDER_DISMISSED_KEY}_${user.id || user.email}`;
      safeStorage.set(dismissedKey, new Date().toISOString());
    }
    setShow(false);
  };

  if (!show || !available) {
    return null;
  }

  if (variant === 'compact') {
    return (
      <div className="biometric-reminder-compact">
        <span className="reminder-icon">🔐</span>
        <span className="reminder-text">Enable Face ID / Touch ID for faster login</span>
        <Link to="/profile?tab=security" className="reminder-link">Set up</Link>
        <button className="reminder-dismiss" onClick={handleDismiss} aria-label="Dismiss">×</button>
      </div>
    );
  }

  return (
    <div className="biometric-reminder-banner">
      <div className="reminder-content">
        <div className="reminder-icon-large">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
            <path d="M12 1C8.14 1 5 4.14 5 8v2H3v10h18V10h-2V8c0-3.86-3.14-7-7-7zm0 2c2.76 0 5 2.24 5 5v2H7V8c0-2.76 2.24-5 5-5zm-7 9h14v6H5v-6z"/>
          </svg>
        </div>
        <div className="reminder-text-content">
          <h4>Enable Biometric Login</h4>
          <p>Sign in faster and more securely with Face ID or Touch ID</p>
        </div>
        <div className="reminder-actions">
          <Link to="/profile?tab=security" className="btn btn-primary btn-sm">
            Set Up Now
          </Link>
          <button className="btn btn-ghost btn-sm" onClick={handleDismiss}>
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default BiometricReminder;
