import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocialLoginButtons } from '../SocialLogin';
import { EmailLoginForm } from '../EmailLogin';
import { MobileLoginForm } from '../MobileLogin';
import './AuthLayout.css';

const AuthPage = ({ defaultMode = 'login', defaultTab = 'email', onSuccess }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState(defaultMode);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [error, setError] = useState(null);

  const handleAuthSuccess = (userData) => {
    setError(null);
    if (onSuccess) {
      onSuccess(userData);
    } else {
      navigate('/');
    }
  };

  const handleAuthError = (err) => {
    setError(err.message || 'Authentication failed. Please try again.');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
          <p>
            {mode === 'login'
              ? 'Sign in to access your account'
              : 'Join White Caves Real Estate today'}
          </p>
        </div>

        {error && (
          <div className="auth-error">
            <span>{error}</span>
            <button onClick={() => setError(null)} aria-label="Dismiss error">
              &times;
            </button>
          </div>
        )}

        <SocialLoginButtons
          onSuccess={handleAuthSuccess}
          onError={handleAuthError}
        />

        <div className="auth-tabs">
          <button
            className={`auth-tab ${activeTab === 'email' ? 'active' : ''}`}
            onClick={() => setActiveTab('email')}
          >
            Email
          </button>
          <button
            className={`auth-tab ${activeTab === 'phone' ? 'active' : ''}`}
            onClick={() => setActiveTab('phone')}
          >
            Phone
          </button>
        </div>

        <div className="auth-content">
          {activeTab === 'email' ? (
            <EmailLoginForm
              mode={mode}
              onSuccess={handleAuthSuccess}
              onError={handleAuthError}
              onModeChange={setMode}
            />
          ) : (
            <MobileLoginForm
              onSuccess={handleAuthSuccess}
              onError={handleAuthError}
            />
          )}
        </div>

        <div className="auth-footer">
          <p>
            By continuing, you agree to our{' '}
            <a href="/terms">Terms of Service</a> and{' '}
            <a href="/privacy">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
