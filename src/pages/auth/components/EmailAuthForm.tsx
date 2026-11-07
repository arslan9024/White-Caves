import React, { memo } from 'react';
import PasswordStrength from '../../../components/PasswordStrength';

interface EmailAuthFormProps {
  email: string;
  onEmailChange: (value: string) => void;
  password: string;
  onPasswordChange: (value: string) => void;
  confirmPassword: string;
  onConfirmPasswordChange: (value: string) => void;
  rememberMe: boolean;
  onRememberMeChange: (checked: boolean) => void;
  isSignup: boolean;
  loading: boolean;
  error: string | null;
  successMsg: string | null;
  onSubmit: (e: React.FormEvent) => void;
}

export const EmailAuthForm = memo(function EmailAuthForm({
  email,
  onEmailChange,
  password,
  onPasswordChange,
  confirmPassword,
  onConfirmPasswordChange,
  rememberMe,
  onRememberMeChange,
  isSignup,
  loading,
  error,
  successMsg,
  onSubmit,
}: EmailAuthFormProps) {
  return (
    <form onSubmit={onSubmit} className="auth-form">
      <div className="form-group">
        <input
          id="signin-email"
          aria-label="Email address"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => onEmailChange(e.target.value)}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <input
          id="signin-password"
          aria-label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={e => onPasswordChange(e.target.value)}
          required
          className="form-input"
        />
      </div>

      {isSignup && <PasswordStrength password={password} />}

      {isSignup && (
        <div className="form-group remember-me">
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={e => onRememberMeChange(e.target.checked)}
            />
            Remember me
          </label>
        </div>
      )}

      {isSignup && (
        <div className="form-group">
          <input
            id="signin-confirm-password"
            aria-label="Confirm password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={e => onConfirmPasswordChange(e.target.value)}
            required
            className="form-input"
          />
        </div>
      )}

      {error && (
        <div className="auth-error" role="alert">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="auth-success" role="status">
          {successMsg}
        </div>
      )}

      <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
        {loading ? 'Please wait...' : isSignup ? 'Sign Up' : 'Sign In'}
      </button>
    </form>
  );
});

export default EmailAuthForm;
