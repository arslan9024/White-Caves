import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../../../../config/firebase';
import { loginSuccess, loginStart, loginFailure } from '../../../../store/authSlice';
import OTPVerification from './OTPVerification';
import './MobileLogin.css';

const MobileLoginForm = ({ onSuccess, onError }) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState('phone');
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+971');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState('');

  const countryCodes = [
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

  const handleSendOTP = async (e) => {
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
      const result = await signInWithPhoneNumber(auth, fullPhoneNumber, window.recaptchaVerifier);
      setConfirmationResult(result);
      setStep('otp');
    } catch (error) {
      console.error('Send OTP error:', error);
      setError(error.message || 'Failed to send OTP');
      dispatch(loginFailure(error.message));
      onError?.(error);
      
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otp) => {
    setLoading(true);
    setError('');
    
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        phoneNumber: user.phoneNumber,
        photoURL: user.photoURL,
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
      console.error('Verify OTP error:', error);
      setError('Invalid OTP. Please try again.');
      dispatch(loginFailure(error.message));
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
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
