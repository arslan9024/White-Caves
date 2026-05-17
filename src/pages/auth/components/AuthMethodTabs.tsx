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
    <div className="auth-tabs">
      <button
        className={`auth-tab ${activeTab === 'email' ? 'active' : ''}`}
        onClick={() => onChange('email')}
      >
        {emailLabel}
      </button>
      <button
        className={`auth-tab ${activeTab === 'phone' ? 'active' : ''}`}
        onClick={() => onChange('phone')}
      >
        {phoneLabel}
      </button>
    </div>
  );
});
