import React, { memo } from 'react';

interface PhoneAuthFormProps {
  phone: string;
  onPhoneChange: (value: string) => void;
  loading: boolean;
  error: string | null;
  onRequestOtp?: () => void;
}

export const PhoneAuthForm = memo(function PhoneAuthForm({
  phone,
  onPhoneChange,
  loading,
  error,
  onRequestOtp,
}: PhoneAuthFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onRequestOtp) {
      onRequestOtp();
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="signin-phone" className="auth-field-label">
          UAE Mobile Number
        </label>
        <div className="auth-phone-input-wrapper">
          <span className="auth-phone-prefix">🇦🇪 +971</span>
          <input
            id="signin-phone"
            aria-label="Phone number"
            type="tel"
            placeholder="50 123 4567"
            value={phone.replace(/^\+971\s*/, '')}
            onChange={e => onPhoneChange(`+971${e.target.value.replace(/[^\d]/g, '')}`)}
            className="form-input auth-phone-field"
          />
        </div>
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
