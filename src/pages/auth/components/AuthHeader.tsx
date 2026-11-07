import React, { memo } from 'react';

interface AuthHeaderProps {
  isSignup: boolean;
}

export const AuthHeader = memo(function AuthHeader({ isSignup }: AuthHeaderProps) {
  return (
    <div className="auth-header">
      <div className="auth-logo">
        <span className="auth-logo-text">White Caves</span>
      </div>
      <h1>{isSignup ? 'Create Account' : 'Welcome Back'}</h1>
      <p className="auth-subtitle">
        {isSignup
          ? 'Join White Caves to explore luxury properties in Dubai'
          : 'Sign in to access your personalized dashboard'}
      </p>
    </div>
  );
});

export default AuthHeader;
