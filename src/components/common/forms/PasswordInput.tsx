import React, { useState, forwardRef } from 'react';
import * as S from './PasswordInput.styles';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string | boolean;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showStrength?: boolean;
  toggleable?: boolean;
  className?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({
    label,
    placeholder = '••••••••',
    value = '',
    onChange,
    onBlur,
    onFocus,
    error,
    helperText,
    required = false,
    disabled = false,
    readOnly = false,
    size = 'md',
    showStrength = true,
    toggleable = true,
    className = '',
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const calculateStrength = (pwd: string): { percent: number; text: string; color: string } => {
      let strength = 0;
      const checks = {
        length: pwd.length >= 8,
        uppercase: /[A-Z]/.test(pwd),
        lowercase: /[a-z]/.test(pwd),
        number: /[0-9]/.test(pwd),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
      };

      Object.values(checks).forEach(check => {
        if (check) strength += 20;
      });

      let text = 'Weak';
      let color = theme.colors.error;

      if (strength <= 33) {
        text = 'Weak';
        color = '#C62828';
      } else if (strength <= 66) {
        text = 'Medium';
        color = '#F57F17';
      } else {
        text = 'Strong';
        color = '#388E3C';
      }

      return { percent: strength, text, color };
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const passwordStrength = calculateStrength(String(value));
    const isError = !!error;

    return (
      <S.Container className={className}>
        {label && (
          <S.Label required={required}>
            {label}
            {required && <S.Required>*</S.Required>}
          </S.Label>
        )}

        <S.Wrapper
          size={size}
          focused={isFocused}
          error={isError}
          disabled={disabled}
        >
          <S.Input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            readOnly={readOnly}
            size={size}
            aria-label={label || 'Password'}
            aria-required={required}
            aria-invalid={isError}
            aria-describedby={helperText || error ? `${props.id}-helper` : undefined}
            {...props}
          />

          {toggleable && !disabled && !readOnly && (
            <S.ToggleButton
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '👁' : '👁‍🗨'}
            </S.ToggleButton>
          )}
        </S.Wrapper>

        {showStrength && value && (
          <>
            <S.StrengthIndicator>
              <S.StrengthBar strength={passwordStrength.percent} color={passwordStrength.color} />
            </S.StrengthIndicator>
            <S.StrengthText strength={passwordStrength.percent}>
              {passwordStrength.text}
            </S.StrengthText>
          </>
        )}

        {(helperText || isError) && (
          <S.HelperText error={isError} id={`${props.id}-helper`}>
            {error && typeof error === 'string' ? error : helperText}
          </S.HelperText>
        )}
      </S.Container>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;

// Note: This is a placeholder for theme import
const theme = {
  colors: {
    error: '#C62828',
    warning: '#F57F17',
    success: '#388E3C',
    text: {
      tertiary: '#999999',
    },
  },
};
