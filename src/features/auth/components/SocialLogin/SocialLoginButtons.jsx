import React from 'react';
import GoogleLoginButton from './GoogleLoginButton';
import FacebookLoginButton from './FacebookLoginButton';
import AppleLoginButton from './AppleLoginButton';
import LinkedInLoginButton from './LinkedInLoginButton';
import UAEPassLoginButton from './UAEPassLoginButton';
import './SocialLogin.css';

const SocialLoginButtons = ({ 
  onSuccess, 
  onError, 
  disabled = false,
  showLinkedIn = false,
  showUAEPass = true,
  layout = 'vertical'
}) => {
  return (
    <div className={`social-login-container ${layout === 'horizontal' ? 'horizontal' : ''}`}>
      <div className="social-login-header">
        <h3>Quick sign in with</h3>
      </div>
      
      {showUAEPass && (
        <UAEPassLoginButton
          onSuccess={onSuccess}
          onError={onError}
          disabled={disabled}
        />
      )}
      
      <GoogleLoginButton
        onSuccess={onSuccess}
        onError={onError}
        disabled={disabled}
      />
      
      <FacebookLoginButton
        onSuccess={onSuccess}
        onError={onError}
        disabled={disabled}
      />
      
      <AppleLoginButton
        onSuccess={onSuccess}
        onError={onError}
        disabled={disabled}
      />
      
      {showLinkedIn && (
        <LinkedInLoginButton
          onSuccess={onSuccess}
          onError={onError}
          disabled={disabled}
        />
      )}
      
      <div className="social-divider">
        <span>or continue with</span>
      </div>
    </div>
  );
};

export default SocialLoginButtons;
