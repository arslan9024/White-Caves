import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';
import { auth } from '../../../../config/firebase';
import { loginSuccess, loginStart, loginFailure } from '../../../../store/authSlice';
import { createLogger } from '../../../../utils/logger';

// Extend Window for Firebase RecaptchaVerifier
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | null;
  }
}

const log = createLogger('MobileLogin');
import OTPVerification from './OTPVerification';
import './MobileLogin.css';

interface MobileLoginFormProps {
  onSuccess?: (user: Record<string, unknown>) => void;
  onError?: (error: unknown) => void;
}

interface CountryCodeOption {
  code: string;
  country: string;
}

interface FirebaseAuthError extends Error {
  code?: string;
}

const MobileLoginForm: React.FC<MobileLoginFormProps> = ({ onSuccess, onError }) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState('phone');
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+971');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [error, setError] = useState('');

  // Clean up RecaptchaVerifier when component unmounts
  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch {
          // Verifier may already be invalid
        }
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  const countryCodes: CountryCodeOption[] = [
    { code: '+971', country: 'UAE' },
    { code: '+966', country: 'Saudi Arabia' },
    { code: '+973', country: 'Bahrain' },
    { code: '+974', country: 'Qatar' },
    { code: '+968', country: 'Oman' },
    { code: '+965', country: 'Kuwait' },
    { code: '+91', country: 'India' },
    { code: '+44', country: 'UK' },
    { code: '+1', country: 'USA' },
  ];

  const setupRecaptcha = () => {
    if (!auth) return;
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {},
        'expired-callback': () => {
          setError('reCAPTCHA expired. Please try again.');
        },
      });
    }
  };

  const handleSendOTP = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length < 9) {
      setError('Please enter a valid phone number');
      return;
    }
    
    setLoading(true);
    setError('');
    dispatch(loginStart());
    
    try {
      setupRecaptcha();
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      const result = await signInWithPhoneNumber(auth!, fullPhoneNumber, window.recaptchaVerifier!);
      setConfirmationResult(result);
      setStep('otp');
    } catch (error) {
      const authError = error as FirebaseAuthError;
      log.error('Send OTP error:', authError);
      setError(authError.message || 'Failed to send OTP');
      dispatch(loginFailure(authError.message || 'Failed to send OTP'));
      onError?.(authError);
      
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otp: string): Promise<void> => {
    if (!confirmationResult) {
      setError('Session expired. Please request a new OTP.');
      setStep('phone');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      
      const userData = {
        id: user.uid,
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || undefined,
        phone: user.phoneNumber || undefined,
        photoURL: user.photoURL || undefined,
        provider: 'phone',
      };
      
      const token = await user.getIdToken();
      dispatch(loginSuccess({
        user: userData,
        token,
        provider: 'phone',
      }));
      
      onSuccess?.(userData);
    } catch (error) {
      const authError = error as FirebaseAuthError;
      log.error('Verify OTP error:', authError);
      setError('Invalid OTP. Please try again.');
      dispatch(loginFailure(authError.message || 'OTP verification failed'));
      onError?.(authError);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async (): Promise<void> => {
    setStep('phone');
    setConfirmationResult(null);
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
  };

  if (step === 'otp') {
    return (
      <OTPVerification
        phoneNumber={`${countryCode}${phoneNumber}`}
        onVerify={handleVerifyOTP}
        onResend={handleResendOTP}
        loading={loading}
        error={error}
      />
    );
  }

  return (
    <form className="mobile-login-form" onSubmit={handleSendOTP}>
      <div className="phone-input-group">
        <select
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          disabled={loading}
          className="country-code-select"
        >
          {countryCodes.map(({ code, country }) => (
            <option key={code} value={code}>
              {code} {country}
            </option>
          ))}
        </select>
        
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => {
            setPhoneNumber(e.target.value.replace(/\D/g, ''));
            setError('');
          }}
          placeholder="Phone number"
          disabled={loading}
          maxLength={15}
          className="phone-input"
        />
      </div>
      
      {error && <span className="error-message">{error}</span>}
      
      <button
        type="submit"
        className="mobile-submit-btn"
        disabled={loading || !phoneNumber}
      >
        {loading ? 'Sending OTP...' : 'Send OTP'}
      </button>
      
      <div id="recaptcha-container"></div>
    </form>
  );
};

export default MobileLoginForm;
