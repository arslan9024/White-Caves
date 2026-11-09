import React, { memo } from 'react';
import type { AuthMode } from './authTypes';

interface AuthNavTabsProps {
  mode: AuthMode;
  onSelectMode: (mode: AuthMode) => void;
  disabled?: boolean;
}

export const AuthNavTabs = memo(function AuthNavTabs({
  mode,
  onSelectMode,
  disabled = false,
}: AuthNavTabsProps) {
  return (
    <div className="auth-segmented-nav" role="tablist" aria-label="Authentication Flow Selection">
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'signin'}
        className={`auth-segmented-btn ${mode === 'signin' ? 'active' : ''}`}
        onClick={() => onSelectMode('signin')}
        disabled={disabled}
      >
        <span className="auth-nav-icon">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
        </span>
        Sign In
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'signup'}
        className={`auth-segmented-btn ${mode === 'signup' ? 'active' : ''}`}
        onClick={() => onSelectMode('signup')}
        disabled={disabled}
      >
        <span className="auth-nav-icon">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </span>
        Register
      </button>
    </div>
  );
});

export default AuthNavTabs;
