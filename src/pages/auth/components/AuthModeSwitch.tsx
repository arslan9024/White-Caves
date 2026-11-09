import React, { memo } from 'react';

interface AuthModeSwitchProps {
  mode: 'signin' | 'signup';
  onSwitch: () => void;
  signInPromptText: string;
  signUpPromptText: string;
}

export const AuthModeSwitch = memo(function AuthModeSwitch({
  mode,
  onSwitch,
  signInPromptText,
  signUpPromptText,
}: AuthModeSwitchProps) {
  return (
    <div className="auth-switch">
      <div className="auth-switch-divider">
        <span>or</span>
      </div>
      <button type="button" className="btn btn-link auth-switch-link" onClick={onSwitch}>
        {mode === 'signup' ? signInPromptText : signUpPromptText}
      </button>
    </div>
  );
});

export default AuthModeSwitch;
