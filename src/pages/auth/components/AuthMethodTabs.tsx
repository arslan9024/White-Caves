import React, { memo } from 'react';

interface AuthMethodTabsProps {
  activeTab: 'email' | 'phone';
  onChange: (tab: 'email' | 'phone') => void;
  emailLabel: string;
  phoneLabel: string;
}

export const AuthMethodTabs = memo(function AuthMethodTabs({
  activeTab,
  onChange,
  emailLabel,
  phoneLabel,
}: AuthMethodTabsProps) {
  return (
    <div className="auth-tabs" role="tablist" aria-label="Input credentials channel">
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'email'}
        className={`auth-tab ${activeTab === 'email' ? 'active' : ''}`}
        onClick={() => onChange('email')}
      >
        <span className="auth-tab-icon">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
        </span>
        {emailLabel}
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'phone'}
        className={`auth-tab ${activeTab === 'phone' ? 'active' : ''}`}
        onClick={() => onChange('phone')}
      >
        <span className="auth-tab-icon">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
          </svg>
        </span>
        {phoneLabel}
      </button>
    </div>
  );
});

export default AuthMethodTabs;
