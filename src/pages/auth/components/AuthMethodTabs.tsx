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
    <div className="auth-method-tabs" role="tablist" aria-label="Sign-in method">
      <button
        type="button"
        role="tab"
        id="auth-method-email-tab"
        aria-selected={activeTab === 'email'}
        aria-controls="auth-method-email-panel"
        tabIndex={activeTab === 'email' ? 0 : -1}
        className={`auth-method-tab ${activeTab === 'email' ? 'active' : ''}`}
        onClick={() => onChange('email')}
      >
        {emailLabel}
      </button>
      <button
        type="button"
        role="tab"
        id="auth-method-phone-tab"
        aria-selected={activeTab === 'phone'}
        aria-controls="auth-method-phone-panel"
        tabIndex={activeTab === 'phone' ? 0 : -1}
        className={`auth-method-tab ${activeTab === 'phone' ? 'active' : ''}`}
        onClick={() => onChange('phone')}
      >
        {phoneLabel}
      </button>
    </div>
  );
});
