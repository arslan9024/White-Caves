import React, { useState, useRef, useEffect } from 'react';
import './MobileLogin.css';

const OTPVerification = ({ phoneNumber, onVerify, onResend, loading, error }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (value.length > 1) {
      const digits = value.split('').slice(0, 6);
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const newOtp = [...otp];
      pastedData.split('').forEach((digit, i) => {
        newOtp[i] = digit;
      });
      setOtp(newOtp);
      inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length === 6) {
      onVerify(otpString);
    }
  };

  const handleResend = () => {
    setResendTimer(60);
    setOtp(['', '', '', '', '', '']);
    onResend();
  };

  const maskedPhone = phoneNumber.replace(/(\d{3})\d+(\d{3})/, '$1****$2');

  return (
    <form className="otp-verification-form" onSubmit={handleSubmit}>
      <div className="otp-header">
        <h3>Verify your phone</h3>
        <p>Enter the 6-digit code sent to {maskedPhone}</p>
      </div>

      <div className="otp-inputs" onPaste={handlePaste}>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            disabled={loading}
            className={`otp-input ${error ? 'error' : ''}`}
            aria-label={`Digit ${index + 1}`}
          />
        ))}
      </div>

      {error && <span className="error-message">{error}</span>}

      <button
        type="submit"
        className="otp-submit-btn"
        disabled={loading || otp.join('').length !== 6}
      >
        {loading ? 'Verifying...' : 'Verify OTP'}
      </button>

      <div className="resend-section">
        {resendTimer > 0 ? (
          <p>Resend code in {resendTimer}s</p>
        ) : (
          <button type="button" onClick={handleResend} disabled={loading}>
            Resend Code
          </button>
        )}
      </div>
    </form>
  );
};

export default OTPVerification;
