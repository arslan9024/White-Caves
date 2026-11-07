import React, { memo } from 'react';

interface PhoneAuthFormProps {
  phone: string;
  onPhoneChange: (value: string) => void;
  loading: boolean;
  error: string | null;
}

export const PhoneAuthForm = memo(function PhoneAuthForm({
  phone,
  onPhoneChange,
  loading,
  error,
}: PhoneAuthFormProps) {
  return (
    <form className="auth-form">
      <div className="form-group">
        <input
          id="signin-phone"
          aria-label="Phone number"
          type="tel"
          placeholder="+971 50 123 4567"
          value={phone}
          onChange={e => onPhoneChange(e.target.value)}
          className="form-input"
        />
      </div>

      {error && (
        <div className="auth-error" role="alert">
          {error}
        </div>
      )}

      <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
        {loading ? 'Please wait...' : 'Send OTP'}
      </button>
    </form>
  );
});

export default PhoneAuthForm;
