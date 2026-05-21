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
      <button className="btn btn-link" onClick={onSwitch}>
        {mode === 'signup' ? signInPromptText : signUpPromptText}
      </button>
    </div>
  );
});
