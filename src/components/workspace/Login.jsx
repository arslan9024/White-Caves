import React, { useState, useCallback } from 'react';
import { useAuthContext } from './contexts/AuthContext';

/**
 * Login.jsx — Premium dark login form for White Caves CRM
 *
 * Features:
 * - Email + password authentication against mock profiles
 * - Quick-select profile buttons for rapid testing
 * - Error shake animation on failed attempts
 * - Fully self-contained — no router dependencies
 */
export default function Login() {
  const { login, loginWithProfile } = useAuthContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Simulate tiny network delay for UX realism
    setTimeout(() => {
      const result = login(email, password);
      if (!result.success) {
        setError(result.error);
      }
      setIsSubmitting(false);
    }, 400);
  }, [email, password, login]);

  const handleQuickLogin = useCallback((profileKey) => {
    setError('');
    loginWithProfile(profileKey);
  }, [loginWithProfile]);

  return (
    <div className="ws-login-page">
      <div className="ws-login-card">
        {/* Brand */}
        <div className="ws-login-brand">
          <div className="ws-login-logo">WC</div>
          <h1>White Caves</h1>
          <p>Real Estate CRM Platform</p>
        </div>

        {/* Login Form */}
        <form className="ws-login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="ws-login-error" role="alert">
              {error}
            </div>
          )}

          <div className="ws-form-group">
            <label htmlFor="ws-login-email">Email Address</label>
            <input
              id="ws-login-email"
              type="email"
              className="ws-form-input"
              placeholder="you@whitecaves.ae"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="ws-form-group">
            <label htmlFor="ws-login-password">Password</label>
            <input
              id="ws-login-password"
              type="password"
              className="ws-form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="ws-login-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Authenticating…' : 'Sign In to Workspace'}
          </button>
        </form>

        {/* Quick Profile Switcher */}
        <div className="ws-login-divider">Quick Access Profiles</div>

        <div className="ws-quick-profiles">
          <button
            type="button"
            className="ws-quick-profile-btn"
            onClick={() => handleQuickLogin('admin')}
          >
            <span className="ws-qp-icon">🦁</span>
            Arslan Malik
            <span className="ws-qp-label">Admin · CL4</span>
          </button>

          <button
            type="button"
            className="ws-quick-profile-btn"
            onClick={() => handleQuickLogin('broker')}
          >
            <span className="ws-qp-icon">🏠</span>
            Fatima Al-Rashid
            <span className="ws-qp-label">Broker · CL1</span>
          </button>

          <button
            type="button"
            className="ws-quick-profile-btn"
            onClick={() => handleQuickLogin('founder')}
            style={{ borderColor: '#EF4444' }}
          >
            <span className="ws-qp-icon">👑</span>
            Arslan Goraha
            <span className="ws-qp-label">Founder · CL5</span>
          </button>
        </div>
      </div>
    </div>
  );
}
